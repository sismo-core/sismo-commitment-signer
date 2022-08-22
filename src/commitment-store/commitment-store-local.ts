import { CommitmentStore, Key, Value } from ".";

export default class LocalCommitmentStore implements CommitmentStore {
  private _store: Map<Key, Value>;

  constructor() {
    this._store = new Map<Key, Value>();
  }

  async add(key: Key, value: Value): Promise<void> {
    await this._store.set(key, value);
  }

  async get(key: Key): Promise<Value> {
    const res = await this._store.get(key);
    if (!res) throw new Error("key does not exist in store");
    return res;
  }
}
