import MemoryCommitmentStore from "../commitment-store/commitment-store-memory";
import { buildPoseidon } from "@sismo-core/crypto";
import {
  CommitmentSigner,
  IssuerIdentifier,
  SignedCommitmentResponse,
} from "./commitment-signer";
import LocalSecretManager from "../secret-manager/secret-manager-local";

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

test("should not retrieve a signed commitment if it is not validated by the issuer", async () => {
  const commitment = "123";

  await expect(
    commitmentSignerTest.retrieveSignedCommitment(commitment)
  ).rejects.toEqual(Error("IssuerIdentifier was not validated"));
});

test("should validate the issuerIdentifier corresponding to the test commitment", async () => {
  commitmentSignerTest.validate("123-456-789");
});

test("send retrieve a signed commitment", async () => {
  const commitment = "123";

  const signedCommitment: SignedCommitmentResponse =
    await commitmentSignerTest.retrieveSignedCommitment(commitment);
  expect(signedCommitment.commitmentSignerPubKey).toEqual([
    "0x0739d67c4d0c90837361c2fe595d11dfecc2847dc41e1ef0da8201c0b16aa09c",
    "0x2206d2a327e39f643e508f5a08e922990cceba9610c15f9a94ef30d6dd54940f",
  ]);
  expect(signedCommitment.signedCommitment).toEqual([
    "0x0b7aab7f755cb88c494dbbb2473b4dfc2148e0e2c752ea46050dfa3a465af097",
    "0x2521df2f3816fceda803147578f69c4806bb879811109cc7587aad33c0b10f68",
    "0x018a7fa524f8120ac4e8bbc634e5e0467cc0720d09f600e7d8a8451d3ff94b50",
  ]);
});
