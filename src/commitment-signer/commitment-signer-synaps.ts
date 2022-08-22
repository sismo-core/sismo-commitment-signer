import {
  CommitmentSigner,
  IssuerIdentifier,
} from "commitment-signer/commitment-signer";
import {
  synapsStartSession,
  synapsVerifySession,
} from "commitment-signer/infrastructure/synaps";

export class CommitmentSignerSynaps extends CommitmentSigner {
  protected async _createIssuerIdentifier(): Promise<IssuerIdentifier> {
    return synapsStartSession();
  }

  protected async _isIssuerIdentifierValidated(
    issuerIdentifier: IssuerIdentifier
  ): Promise<boolean> {
    return synapsVerifySession(issuerIdentifier);
  }
}
