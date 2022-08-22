import MemoryCommitmentStore from "./commitment-store-memory";

test("get not added key fail", async () => {
  const commitmentStore = new MemoryCommitmentStore();
  expect(async () => await commitmentStore.get("1")).rejects.toThrow();
});

test("add then get have correct values", async () => {
  const commitmentStore = new MemoryCommitmentStore();
  await commitmentStore.add("1", "value1");
  await commitmentStore.add("2", "value2");
  const value1 = await commitmentStore.get("1");
  expect(value1).toEqual("value1");
  const value2 = await commitmentStore.get("2");
  expect(value2).toEqual("value2");
});
