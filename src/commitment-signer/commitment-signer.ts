import { SecretManager } from "../secret-manager";
import { CommitmentStore } from "../commitment-store";
import { EddsaAccount } from "@sismo-core/crypto";
import { BigNumber } from "ethers";

export type CommitmentSignerPublicKey = string[];

export type SignedCommitmentResponse = {
  commitmentSignerPubKey: string[];
  signedCommitment: string[];
};

export type Commitment = string;
export type IssuerIdentifier = string;

export abstract class CommitmentSigner {
  private _commitmentStore: CommitmentStore;
  private _secretManager: SecretManager;

  constructor(commitmentStore: CommitmentStore, secretManager: SecretManager) {
    this._commitmentStore = commitmentStore;
    this._secretManager = secretManager;
  }

  protected abstract _createIssuerIdentifier(): Promise<IssuerIdentifier>;
  protected abstract _isIssuerIdentifierValidated(
    issuerIdentifier: IssuerIdentifier
  ): Promise<boolean>;

  async commit(commitment: Commitment): Promise<IssuerIdentifier> {
    const issuerIdentifier = await this._createIssuerIdentifier();
    await this._storeCommitment(commitment, issuerIdentifier);
    return issuerIdentifier;
  }

  async getSignedCommitment(
    commitment: Commitment
  ): Promise<SignedCommitmentResponse> {
    const issuerIdentifier = await this._getIdentifierForCommitment(commitment);
    const isIssuerIdentifierValidated = await this._isIssuerIdentifierValidated(
      issuerIdentifier
    );
    if (!isIssuerIdentifierValidated) {
      throw new Error("IssuerIdentifier is not valid");
    }

    const signedCommitment = (await this._getEddsaAccount()).sign(
      BigNumber.from(commitment)
    );
    return {
      commitmentSignerPubKey: await this.getPubKey(),
      signedCommitment: signedCommitment.map((signature: BigNumber) =>
        signature.toHexString()
      ),
    };
  }

  async getPubKey(): Promise<CommitmentSignerPublicKey> {
    return (await this._getEddsaAccount())
      .getPubKey()
      .map((coord: BigNumber) => coord.toHexString());
  }

  private async _getEddsaAccount(): Promise<EddsaAccount> {
    const secret = await this._secretManager.get();
    const eddsaAccount = await EddsaAccount.generateFromSeed(
      BigNumber.from(secret.seed)
    );
    return eddsaAccount;
  }

  private async _getIdentifierForCommitment(
    commitment: string
  ): Promise<string> {
    return this._commitmentStore.get(commitment);
  }

  private async _storeCommitment(
    commitment: string,
    issuerIdentifier: string
  ): Promise<void> {
    await this._commitmentStore.add(commitment, issuerIdentifier);
  }
}
