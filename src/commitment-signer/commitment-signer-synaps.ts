import { ethers } from "ethers";
import { CommitmentSigner, IssuerIdentifier } from "./commitment-signer";
import {
  synapsStartSession,
  synapsVerifySession,
} from "./infrastructure/synaps";

export class CommitmentSignerSynaps extends CommitmentSigner {
  protected async _createIssuerIdentifier(): Promise<IssuerIdentifier> {
    return synapsStartSession();
  }

  protected async _isIssuerIdentifierValidated(
    issuerIdentifier: IssuerIdentifier
  ): Promise<boolean> {
    return synapsVerifySession(issuerIdentifier);
  }

  protected async _getIssuerIdentifierAssociatedValue(
    issuerIdentifier: IssuerIdentifier
  ): Promise<string> {
    return Promise.resolve("0x1");
  }

  protected async _getIssuerIdentifierGroupId(
    issuerIdentifier: string
  ): Promise<string> {
    return ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["uint128", "bool"],
        // internalCollectionId, isScore
        [0, false]
      )
    );
  }
}
