import LocalSecretManager from "./secret-manager-local";

const testCommitmentSignerSecret = {
  seed: "test_seed",
};

test("create is not implemented", async () => {
  const secretManager = new LocalSecretManager();
  expect(async () => {
    await secretManager.generate(async () => testCommitmentSignerSecret);
  }).rejects.toThrowError("Not implemented");
});

test("get a valid commitmentSigner secret", async () => {
  const secretManager = new LocalSecretManager();
  const secret = await secretManager.get();
  expect(secret).toEqual(
    expect.objectContaining({
      seed: expect.any(String),
    })
  );
});
