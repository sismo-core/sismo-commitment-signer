import { CommitmentSigner, IssuerIdentifier } from "./commitment-signer";

export class CommitmentSignerExample extends CommitmentSigner {
  protected async _createIssuerIdentifier(): Promise<IssuerIdentifier> {
    return Promise.resolve("123-456-789");
  }

  protected async _isIssuerIdentifierValidated(
    issuerIdentifier: IssuerIdentifier
  ): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected async _getIssuerIdentifierAssociatedValue(
    issuerIdentifier: IssuerIdentifier
  ): Promise<string> {
    return Promise.resolve("0x1");
  }

  protected async _getIssuerIdentifierGroupId(
    issuerIdentifier: string
  ): Promise<string> {
    return Promise.resolve("0x1");
  }
}
