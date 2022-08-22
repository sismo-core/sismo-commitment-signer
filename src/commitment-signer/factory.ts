import { CommitmentSigner } from "commitment-signer/commitment-signer";
import CommitmentSignerTest from "commitment-signer/commitment-signer.test";
import { CommitmentStoreType, getCommitmentStore } from "commitment-store";
import { getSecretHandler } from "secret-manager";

export const commitmentSignerFactory = (): CommitmentSigner => {
  return new CommitmentSignerTest(
    getCommitmentStore("test", CommitmentStoreType.DynamoDBCommitmentStore),
    getSecretHandler()
  );
};
