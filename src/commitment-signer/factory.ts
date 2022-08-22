import { CommitmentSigner } from ".";
import { CommitmentSignerExample } from "./commitment-signer-example";
import { getCommitmentStore } from "../commitment-store";
import { getSecretHandler } from "../secret-manager";

export const commitmentSignerFactory = async (): Promise<CommitmentSigner> => {
  return new CommitmentSignerExample(getCommitmentStore(), getSecretHandler());
};
