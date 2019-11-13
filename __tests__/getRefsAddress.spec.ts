import { getRefsAddress } from "../src/refs";
import { context } from "@actions/github";

jest.mock("@actions/github");
const mocketGithub = context as jest.Mocked<typeof context>;

describe("refs - getRefsAddress", () => {
  it("should return address from github context", async () => {
    const payload: any = {
      repository: {
        git_refs_url:
          "https://api.github.com/repos/patzick/merger/git/refs{/sha}"
      }
    };
    mocketGithub.payload = payload;

    const result = getRefsAddress();
    expect(result).toEqual(
      "https://api.github.com/repos/patzick/merger/git/refs"
    );
  });
});
