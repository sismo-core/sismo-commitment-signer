import MemoryCommitmentStore from "../commitment-store/commitment-store-memory";
import { buildPoseidon } from "@sismo-core/crypto";
import {
  CommitmentSigner,
  IssuerIdentifier,
  CommitmentReceiptResponse,
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

  protected async _getIssuerIdentifierAssociatedValue(
    issuerIdentifier: IssuerIdentifier
  ): Promise<string> {
    return Promise.resolve("0x1");
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

  const commitmentReceipt: CommitmentReceiptResponse =
    await commitmentSignerTest.retrieveCommitmentReceipt(commitment);
  expect(commitmentReceipt.commitmentSignerPubKey).toEqual([
    "0x0739d67c4d0c90837361c2fe595d11dfecc2847dc41e1ef0da8201c0b16aa09c",
    "0x2206d2a327e39f643e508f5a08e922990cceba9610c15f9a94ef30d6dd54940f",
  ]);
  expect(commitmentReceipt.commitmentReceipt).toEqual([
    "0xb8f112e19f16adb9e6fb6eebbd853b13976200e6a2dca22047b1260577b28c",
    "0x1b46832e4b477a98ea085d7fd9313f9df8c5147ad5e6ccf2df5a3543016cbbb8",
    "0xdd6834237cf1b07ddaea8957065c3ff941839c311047e5a72fe3329ad17ccf",
  ]);
});
