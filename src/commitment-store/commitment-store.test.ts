import { getCommitmentStore, CommitmentStoreType } from "./index";
import DynamoDBCommitmentStore from "./commitment-store-dynamodb";
import { LocalCommitmentStore } from "./commitment-store-local";

const setDynamoEnvVars = () => {
  process.env.COMMITMENT_STORE_TABLE_SUFFIX = "test";
};

const deleteDynamoEnvVars = () => {
  delete process.env.COMMITMENT_STORE_TABLE_SUFFIX;
};

const commitmentStoreNamespaceTest = "test";

test("throw error if env var are not set for DynamoDB", async () => {
  expect(() => {
    getCommitmentStore(
      commitmentStoreNamespaceTest,
      CommitmentStoreType.DynamoDBCommitmentStore
    );
  }).toThrow();
});

test("force DynamoDB", async () => {
  setDynamoEnvVars();
  const commitmentStore = getCommitmentStore(
    commitmentStoreNamespaceTest,
    CommitmentStoreType.DynamoDBCommitmentStore
  );
  deleteDynamoEnvVars();
  expect(commitmentStore).toBeInstanceOf(DynamoDBCommitmentStore);
});

test("force LocalCommitmentStore", async () => {
  expect(
    getCommitmentStore(
      commitmentStoreNamespaceTest,
      CommitmentStoreType.LocalCommitmentStore
    )
  ).toBeInstanceOf(LocalCommitmentStore);
});

test("default to LocalCommitmentStore if local", async () => {
  process.env.IS_OFFLINE = "true";
  const commitmentStore = getCommitmentStore(commitmentStoreNamespaceTest);
  expect(commitmentStore).toBeInstanceOf(LocalCommitmentStore);
});
