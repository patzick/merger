import { getAllRefs } from "../src/refs";

describe("refs - getAllRefs", () => {
  it("should return single matching branch", async () => {
    const refs: any = [
      {
        ref: "refs/heads/greenkeeper/initial"
      },
      {
        ref: "refs/heads/master"
      }
    ];
    const result = getAllRefs(refs, ["greenkeeper/**"]);
    expect(result).toEqual(["refs/heads/greenkeeper/initial"]);
  });

  it("should return multiple matching branch", async () => {
    const refs: any = [
      {
        ref: "refs/heads/greenkeeper/initial"
      },
      {
        ref: "refs/heads/greenkeeper/someother"
      },
      {
        ref: "refs/heads/master"
      }
    ];
    const result = getAllRefs(refs, ["greenkeeper/**"]);
    expect(result.length).toEqual(2);
  });

  it("should return multiple matching branch", async () => {
    const refs: any = [
      {
        ref: "refs/heads/greenkeeper/initial"
      },
      {
        ref: "refs/heads/greenkeeper/someother"
      },
      {
        ref: "refs/heads/master"
      },
      {
        ref: "refs/heads/feat/some-feature"
      }
    ];
    const result = getAllRefs(refs, ["greenkeeper/**", "feat/**/*"]);
    expect(result.length).toEqual(3);
  });

  it("should not repeat branches", async () => {
    const refs: any = [
      {
        ref: "refs/heads/greenkeeper/initial"
      },
      {
        ref: "refs/heads/greenkeeper/someother"
      },
      {
        ref: "refs/heads/master"
      },
      {
        ref: "refs/heads/feat/some-feature"
      }
    ];
    const result = getAllRefs(refs, [
      "greenkeeper/**",
      "feat/**/*",
      "green*/*"
    ]);
    expect(result.length).toEqual(3);
  });
});
