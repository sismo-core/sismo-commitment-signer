export type Key = string;
export type Value = string;

export interface CommitmentStore {
  add(key: Key, value: Value): Promise<void>;
  get(key: Key): Promise<Value>;
}
