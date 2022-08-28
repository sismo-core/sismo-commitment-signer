import MemoryCommitmentStore from "../commitment-store/commitment-store-memory";
import { buildPoseidon, EddsaAccount } from "@sismo-core/crypto";
import {
  CommitmentSigner,
  IssuerIdentifier,
  CommitmentReceiptResponse,
} from "./commitment-signer";
import LocalSecretManager from "../secret-manager/secret-manager-local";
import { BigNumber } from "ethers";

export class CommitmentSignerTest extends CommitmentSigner {
  private validIdentifier: { [identifier: string]: boolean } = {};

  public validate(identifier: string): void {
    this.validIdentifier[identifier] = true;
  }

  protected async _createIssuerIdentifier(): Promise<IssuerIdentifier> {
    return Promise.resolve("123-456-789");
  }

  protected async _isIssuerIdentifierValidated(
    issuerIdentifier: IssuerIdentifier
  ): Promise<boolean> {
    return Promise.resolve(this.validIdentifier[issuerIdentifier]);
  }

  protected async _getIssuerIdentifierAssociatedValue(
    issuerIdentifier: IssuerIdentifier
  ): Promise<string> {
    return Promise.resolve("0x1");
  }

  protected async _getIssuerIdentifierGroupId(
    issuerIdentifier: string
  ): Promise<string> {
    return Promise.resolve("0x2");
  }
}

let poseidon: any;
let localCommitmentStore: MemoryCommitmentStore;
let localSecretManager: LocalSecretManager;
let commitmentSignerTest: CommitmentSignerTest;

beforeAll(async () => {
  // setup cryptography libraries
  poseidon = await buildPoseidon();
  // setup local service for testing.
  localCommitmentStore = new MemoryCommitmentStore();
  localSecretManager = new LocalSecretManager();
  commitmentSignerTest = new CommitmentSignerTest(
    localCommitmentStore,
    localSecretManager
  );
});

test("Should have publicKey", async () => {
  const pubKey = await commitmentSignerTest.getPubKey();
  expect(pubKey.length).toBe(2);
});

test("add a commitment and get an issuerIdentifier in exchange", async () => {
  const commitment = "123";

  const issuerIdentifier = await commitmentSignerTest.commit(commitment);
  expect(issuerIdentifier).toEqual("123-456-789");
});

test("should not retrieve a commitment receipt if it is not validated by the issuer", async () => {
  const commitment = "123";

  await expect(
    commitmentSignerTest.retrieveCommitmentReceipt(commitment)
  ).rejects.toEqual(Error("IssuerIdentifier was not validated"));
});

test("should validate the issuerIdentifier corresponding to the test commitment", async () => {
  commitmentSignerTest.validate("123-456-789");
});

test("send retrieve a commitment receipt", async () => {
  const commitment = "123";

  const secret = await localSecretManager.get();
  const eddsaAccount = await EddsaAccount.generateFromSeed(
    BigNumber.from(secret.seed)
  );
  const expectedCommitmentReceipt = await eddsaAccount
    .sign(
      poseidon([
        BigNumber.from(commitment),
        BigNumber.from("0x1"), // value
        BigNumber.from("0x2"), // groupId
      ])
    )
    .map((x) => x.toHexString());

  const commitmentReceipt: CommitmentReceiptResponse =
    await commitmentSignerTest.retrieveCommitmentReceipt(commitment);
  expect(commitmentReceipt.commitmentSignerPubKey).toEqual(
    eddsaAccount.getPubKey().map((coord) => coord.toHexString())
  );
  expect(commitmentReceipt.commitmentReceipt).toEqual(
    expectedCommitmentReceipt
  );
});
