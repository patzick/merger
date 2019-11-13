import { wait } from "../src/wait";
import * as process from "process";
import execa from "execa";
import * as path from "path";

test("throws invalid number", async () => {
  const input = parseInt("foo", 10);
  await expect(wait(input)).rejects.toThrow("milleseconds not a number");
});

test("wait 500 ms", async () => {
  const start = new Date();
  await wait(500);
  const end = new Date();
  var delta = Math.abs(end.getTime() - start.getTime());
  expect(delta).toBeGreaterThan(450);
});

// shows how the runner will run a javascript action with env / stdout protocol
test("test runs", async () => {
  const ip = path.resolve(__dirname, "../dist/index.js");
  const options = {
    env: {
      INPUT_MILLISECONDS: "500"
    }
  };
  try {
    const { stdout } = await execa(`node`, [ip], options);
    console.log(stdout);
  } catch (e) {
    console.error(e.stdout);
  }
});
