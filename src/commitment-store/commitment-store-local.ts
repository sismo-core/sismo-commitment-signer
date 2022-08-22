import fs from "fs";
import Path from "path";
import { CommitmentStore, Key, Value } from "./commitment-store";

const DEFAULT_DISK_PATH = `${__dirname}/../../../.tmp`;

export class LocalCommitmentStore implements CommitmentStore {
  basePath: string;

  constructor(diskPath: string = DEFAULT_DISK_PATH) {
    this.basePath = `${diskPath}/`;
  }

  public async add(key: Key, value: Value): Promise<void> {
    const path = this._getPath(key);
    await fs.promises.mkdir(Path.dirname(path), { recursive: true });
    await fs.promises.writeFile(path, JSON.stringify(value, null, 2), "utf-8");
  }

  public async get(key: Key): Promise<Value> {
    const path = this._getPath(key);
    if (!(await this._exists(key))) {
      throw Error(`File ${path} does not exist!`);
    }
    return JSON.parse((await fs.promises.readFile(path, "utf8")).toString());
  }

  private _getPath(filename: string) {
    return `${this.basePath}/${filename}`;
  }

  private async _exists(filename: string): Promise<boolean> {
    return fs.existsSync(this._getPath(filename));
  }

  reset(): void {
    fs.rmSync(this.basePath, { recursive: true, force: true });
  }
}
