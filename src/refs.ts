import * as github from "@actions/github";
import axios from "axios";
import minimatch from "minimatch";

export function getRefsAddress(): string {
  let address =
    github.context &&
    github.context.payload &&
    github.context.payload.repository &&
    github.context.payload.repository.git_refs_url;
  if (!address)
    address = "https://api.github.com/repos/patzick/merger/git/refs{/sha}";
  return address.replace("{/sha}", "");
}

export function getCurrentRef(): string {
  let ref =
    github.context && github.context.payload && github.context.payload.ref;
  return ref || "";
}
export interface GitHubRefs {
  ref: string;
  node_id?: string;
  url?: string;
  object?: {
    sha?: string;
    type?: string;
    url?: string;
  };
}

export async function getRepoRefs(address): Promise<GitHubRefs[]> {
  const refsResponse = await axios.get(address);
  return refsResponse.data;
}

export function getMatchingRefs(
  refs: GitHubRefs[],
  template: string
): string[] {
  return refs
    .map(ref => ref.ref)
    .filter(ref => minimatch(ref, `refs/heads/${template}`));
}

export function getAllRefs(
  refs: GitHubRefs[],
  matches: string[] = []
): string[] {
  let selectedRefs: string[] = [];
  matches.forEach(match => {
    selectedRefs = [...selectedRefs, ...getMatchingRefs(refs, match)];
  });
  return [...new Set(selectedRefs)];
}
