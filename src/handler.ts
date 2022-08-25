import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";
import { getSecretHandler, SecretHandlerType } from "./secret-manager";
import { randomBytes } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { commitmentSignerFactory } from "./commitment-signer/factory";

type CommitInputData = {
  commitment: string;
};

export const commit: Handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const requestData: CommitInputData = JSON.parse(event.body!);
  const commitment = requestData.commitment;

  const commitmentSigner = await commitmentSignerFactory();

  try {
    const issuerIdentifier = await commitmentSigner.commit(commitment);
    return {
      statusCode: 200,
      body: JSON.stringify({
        issuerIdentifier,
      }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
      }),
    };
  }
};

type retrieveCommitmentReceiptInputData = {
  commitment: string;
};
export const retrieveCommitmentReceipt: Handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const requestData: retrieveCommitmentReceiptInputData = JSON.parse(
    event.body!
  );
  const commitment = requestData.commitment;

  const commitmentSigner = await commitmentSignerFactory();

  try {
    const commitmentReceipt = await commitmentSigner.retrieveCommitmentReceipt(
      commitment
    );
    return {
      statusCode: 200,
      body: JSON.stringify(commitmentReceipt),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
      }),
    };
  }
};

export const generateSecret: Handler = async () => {
  const secretGenerator = async () => ({
    seed: BigNumber.from(randomBytes(32)).toHexString(),
  });
  const created = await getSecretHandler(
    SecretHandlerType.SecretManagerAWS
  ).generate(secretGenerator);
  return {
    status: created ? "created" : "unchanged",
  };
};

export const getPublicKey: Handler = async () => {
  const commitmentSigner = await commitmentSignerFactory();
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        commitmentSignerPubKey: await commitmentSigner.getPubKey(),
      }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: e.message,
      }),
    };
  }
};
