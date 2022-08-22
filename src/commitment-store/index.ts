export * from "./commitment-store";
import { LocalCommitmentStore } from "./commitment-store-local";
import DynamoDBCommitmentStore from "./commitment-store-dynamodb";

export const enum CommitmentStoreType {
  DynamoDBCommitmentStore,
  LocalCommitmentStore,
}

const getDynamoDBCommitmentStoreInstance = () => {
  const env = process.env;
  if (!env.COMMITMENT_STORE_TABLE_SUFFIX) {
    throw "COMMITMENT_STORE_TABLE_SUFFIX env var must be set";
  }
  return new DynamoDBCommitmentStore(`${env.COMMITMENT_STORE_TABLE_SUFFIX}`);
};

export const getCommitmentStore = (force?: CommitmentStoreType) => {
  if (force === CommitmentStoreType.DynamoDBCommitmentStore) {
    return getDynamoDBCommitmentStoreInstance();
  }
  if (force === CommitmentStoreType.LocalCommitmentStore) {
    return new LocalCommitmentStore();
  }
  return process.env.IS_OFFLINE
    ? new LocalCommitmentStore()
    : getDynamoDBCommitmentStoreInstance();
};
