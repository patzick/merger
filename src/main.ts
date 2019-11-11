import * as core from "@actions/core";
import * as github from "@actions/github";
import { wait } from "./wait";

async function run() {
  try {
    const ms = core.getInput("milliseconds");
    console.log(`Waiting ${ms} milliseconds ...`);
    console.log(`PR: ${getPrNumber()}`);
    console.log(`CONTEXT`, github.context);

    core.debug(new Date().toTimeString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toTimeString());

    core.setOutput("time", new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

function getPrNumber(): number | undefined {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
}
