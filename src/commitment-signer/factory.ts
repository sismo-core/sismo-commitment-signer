import { CommitmentSigner } from ".";
import { getCommitmentStore } from "../commitment-store";
import { getSecretHandler } from "../secret-manager";
import { CommitmentSignerSynaps } from "./commitment-signer-synaps";

export const commitmentSignerFactory = async (): Promise<CommitmentSigner> => {
  return new CommitmentSignerSynaps(getCommitmentStore(), getSecretHandler());
};
