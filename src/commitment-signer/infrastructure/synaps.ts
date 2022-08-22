import axios from "axios";

const getSynapsCredentials = (): {
  clientId: string;
  apiKey: string;
  stepId: string;
} => {
  const { SYNAPS_CLIENT_ID, SYNAPS_API_KEY, SYNAPS_STEP_ID } = process.env;
  if (!SYNAPS_CLIENT_ID || !SYNAPS_API_KEY || !SYNAPS_STEP_ID) {
    throw new Error(
      "SYNAPS_CLIENT_ID and SYNAPS_API_KEY and SYNAPS_STEP_ID must be set"
    );
  }
  return {
    clientId: SYNAPS_CLIENT_ID,
    apiKey: SYNAPS_API_KEY,
    stepId: SYNAPS_STEP_ID,
  };
};

export const synapsStartSession = async (): Promise<string> => {
  const { clientId, apiKey } = getSynapsCredentials();
  const startSession = await axios.post(
    "https://individual-api.synaps.io/v3/session/init",
    {},
    {
      headers: {
        "Client-Id": clientId,
        "Api-Key": apiKey,
      },
    }
  );
  return startSession.data.session_id;
};

export const synapsVerifySession = async (
  sessionId: string
): Promise<boolean> => {
  const { clientId, apiKey, stepId } = getSynapsCredentials();
  const livenessRes = await axios.get(
    `https://individual-api.synaps.io/v3/liveness/details?step_id=${stepId}`,
    {
      headers: {
        "Session-Id": sessionId,
        "Client-Id": clientId,
        "Api-Key": apiKey,
      },
    }
  );
  return livenessRes.data.state === "VALIDATED";
};
