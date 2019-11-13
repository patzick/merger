import * as core from "@actions/core";
import * as github from "@actions/github";
import { getRefsAddress, getRepoRefs, getMatchingRefs } from "./refs";
import execa from "execa";

function getRepo():any {
  const repo = github.context && github.context.payload && github.context.payload.repository
  return repo || {}
}

async function run() {
  try {
    // const ms = core.getInput("milliseconds");
    // console.log(`Waiting ${ms} milliseconds ...`);
    // console.log(`PR: ${getPrNumber()}`);
    console.log(`CONTEXT`, github.context);
    console.log(`OWNER`, getRepo().owner);

    const address = getRefsAddress();

    console.log("GET TO ADDRESS", address);

    const refs = await getRepoRefs(address);
    const refsList = getMatchingRefs(refs, "green*/*");
    console.log("REFS", refsList);
    if (refsList.length) {
      core.info("HELLO WORLD");
      const gitToken = core.getInput("gitToken");
      // git format-patch master --stdout | git-apply --check
      // const {stdout} = await execa("git format-patch master --stdout | git-apply --check")
      // core.info(stdout)
      const octokit = new github.GitHub(gitToken);
      const response = await octokit.repos.merge({
        owner: getRepo().owner.name,
        repo: getRepo().name,
        base: refsList[0],
        head: github.context.sha
      });
      core.info('RESPONSE')
      core.info(JSON.stringify(response))
    }

    core.debug(new Date().toTimeString());
    // await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

// function getPrNumber(): number | undefined {
//   const pullRequest = github.context.payload.pull_request;
//   if (!pullRequest) {
//     return undefined;
//   }

//   return pullRequest.number;
// }
