import * as core from "@actions/core";
import * as github from "@actions/github";
import { getRefsAddress, getRepoRefs, getAllRefs } from "./refs";

function getRepo(): any {
  const repo =
    github.context &&
    github.context.payload &&
    github.context.payload.repository;
  return repo || {};
}

async function run() {
  try {
    // const ms = core.getInput("milliseconds");
    // console.log(`Waiting ${ms} milliseconds ...`);
    // console.log(`PR: ${getPrNumber()}`);
    // console.log(`CONTEXT`, github.context);
    console.log(`OWNER`, getRepo().owner);

    const address = getRefsAddress();

    const into = core.getInput("branches");
    const branchTemplates = into.split("\n").map(el => el.trim());
    console.error("templates", branchTemplates);

    console.log("GET TO ADDRESS", address);

    const refs = await getRepoRefs(address);
    const refsList = getAllRefs(refs, branchTemplates);
    console.log("REFS", refsList);
    if (refsList.length) {
      const gitToken = core.getInput("gitToken");
      // git format-patch master --stdout | git-apply --check
      // const {stdout} = await execa("git format-patch master --stdout | git-apply --check")
      // core.info(stdout)
      const octokit = new github.GitHub(gitToken);

      await Promise.all(
        refsList.map(async branchRef => {
          const response = await octokit.repos.merge({
            owner: getRepo().owner.name,
            repo: getRepo().name,
            base: refsList[0],
            head: github.context.sha
          });
          if ([201, 204].includes(response.status)) {
            core.info(`Branch ${branchRef} is now up to date!`);
          } else if (response.status === 409) {
            core.error(`Branch ${branchRef} is in conflict!`);
          }else {
            core.error(`Unmet problem with merge into ${branchRef}!`);
            console.error(response);
          }
        })
      );
      core.info("Finished processing merges!");
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
