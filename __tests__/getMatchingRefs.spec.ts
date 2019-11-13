import { getMatchingRefs, GitHubRefs } from "../src/refs";
import { context } from "@actions/github";

jest.mock("@actions/github");
const mocketGithub = context as jest.Mocked<typeof context>;

const refs: GitHubRefs[] = [
  {
    ref: "refs/heads/greenkeeper/initial",
    node_id: "MDM6UmVmMjIwODU4MDc0OmdyZWVua2VlcGVyL2luaXRpYWw=",
    url:
      "https://api.github.com/repos/patzick/merger/git/refs/heads/greenkeeper/initial",
    object: {
      sha: "1444b43c1c87c7561ff8b4b83d398803ab4b6bc0",
      type: "commit",
      url:
        "https://api.github.com/repos/patzick/merger/git/commits/1444b43c1c87c7561ff8b4b83d398803ab4b6bc0"
    }
  },
  {
    ref: "refs/heads/master",
    node_id: "MDM6UmVmMjIwODU4MDc0Om1hc3Rlcg==",
    url: "https://api.github.com/repos/patzick/merger/git/refs/heads/master",
    object: {
      sha: "33f078577a66129167c79d68b09c614e03a15006",
      type: "commit",
      url:
        "https://api.github.com/repos/patzick/merger/git/commits/33f078577a66129167c79d68b09c614e03a15006"
    }
  }
];

describe("refs - getMatchingRefs", () => {
  it("should return matching branches", async () => {
    const result = getMatchingRefs(refs, "greenkeeper/**");
    expect(result).toEqual(["refs/heads/greenkeeper/initial"]);
  });
});
