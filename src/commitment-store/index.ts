export * from "./commitment-store";

import DynamoDBCommitmentStore from "./commitment-store-dynamodb";
import LocalCommitmentStore from "./commitment-store-local";

export const enum CommitmentStoreType {
  DynamoDBCommitmentStore,
  LocalCommitmentStore,
}

const getDynamoDBCommitmentStoreInstance = (namespace: string) => {
  const env = process.env;
  if (!env.COMMITMENT_STORE_TABLE_SUFFIX) {
    throw "COMMITMENT_STORE_TABLE_SUFFIX env var must be set";
  }
  if (!namespace) {
    throw "Namespace for the commitment store should be defined";
  }
  return new DynamoDBCommitmentStore(
    `${namespace}-${env.COMMITMENT_STORE_TABLE_SUFFIX}`
  );
};

export const getCommitmentStore = (
  namespace: string,
  force?: CommitmentStoreType
) => {
  if (force === CommitmentStoreType.DynamoDBCommitmentStore) {
    return getDynamoDBCommitmentStoreInstance(namespace);
  }
  if (force === CommitmentStoreType.LocalCommitmentStore) {
    return new LocalCommitmentStore();
  }
  return process.env.IS_LOCAL
    ? new LocalCommitmentStore()
    : getDynamoDBCommitmentStoreInstance(namespace);
};
