import { getCommitmentStore, CommitmentStoreType } from "./index";
import DynamoDBCommitmentStore from "./commitment-store-dynamodb";
import { LocalCommitmentStore } from "./commitment-store-local";

const setDynamoEnvVars = () => {
  process.env.COMMITMENT_STORE_TABLE_SUFFIX = "test";
};

const deleteDynamoEnvVars = () => {
  delete process.env.COMMITMENT_STORE_TABLE_SUFFIX;
};

test("throw error if env var are not set for DynamoDB", async () => {
  expect(() => {
    getCommitmentStore(CommitmentStoreType.DynamoDBCommitmentStore);
  }).toThrow();
});

test("force DynamoDB", async () => {
  setDynamoEnvVars();
  const commitmentStore = getCommitmentStore(
    CommitmentStoreType.DynamoDBCommitmentStore
  );
  deleteDynamoEnvVars();
  expect(commitmentStore).toBeInstanceOf(DynamoDBCommitmentStore);
});

test("force LocalCommitmentStore", async () => {
  expect(
    getCommitmentStore(CommitmentStoreType.LocalCommitmentStore)
  ).toBeInstanceOf(LocalCommitmentStore);
});

test("default to LocalCommitmentStore if local", async () => {
  process.env.IS_OFFLINE = "true";
  const commitmentStore = getCommitmentStore();
  expect(commitmentStore).toBeInstanceOf(LocalCommitmentStore);
});
