import { DynamoDB } from "aws-sdk";

import { CommitmentStore, Key, Value } from ".";

export default class DynamoDBCommitmentStore implements CommitmentStore {
  private _tableName: string;
  private _documentClient: DynamoDB.DocumentClient;

  constructor(tableName: string) {
    this._tableName = tableName;
    this._documentClient = new DynamoDB.DocumentClient();
  }

  async add(key: Key, value: Value): Promise<void> {
    return this._documentClient
      .put({
        TableName: this._tableName,
        Item: {
          Key: key,
          Value: value,
        },
      })
      .promise()
      .then();
  }

  async get(key: Key): Promise<Value> {
    return this._documentClient
      .get({
        TableName: this._tableName,
        Key: { Key: key },
      })
      .promise()
      .then((data) =>
        data.Item
          ? data.Item.Value
          : Promise.reject(new Error("key does not exist in store"))
      );
  }
}
