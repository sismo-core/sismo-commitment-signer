import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
} from "aws-lambda";

import { getSecretHandler, SecretHandlerType } from "./secret-manager";
import { randomBytes } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { commitmentSignerFactory } from "commitment-signer/factory";

type CommitInputData = {
  commitment: string;
};

export const commit: Handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const requestData: CommitInputData = JSON.parse(event.body!);
  const commitment = requestData.commitment;

  const commitmentSigner = commitmentSignerFactory();

  try {
    await commitmentSigner.commit(commitment);
    return {
      statusCode: 200,
      body: "OK",
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

type GetSignedCommitInputData = {
  commitment: string;
};
export const getSignedCommit: Handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const requestData = event.queryStringParameters! as GetSignedCommitInputData;
  const commitment = requestData.commitment;

  const commitmentSigner = commitmentSignerFactory();

  try {
    const signedCommitment = commitmentSigner.getSignedCommitment(commitment);
    return {
      statusCode: 200,
      body: JSON.stringify(signedCommitment),
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
  const commitmentSigner = commitmentSignerFactory();
  return commitmentSigner.getPubKey();
};
