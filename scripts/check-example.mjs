// End to end, the way a user gets this pack: pack it into a .tgz, install the
// .tgz, and make the example page check clean. Run after `npm run build`.
// Uses a throwaway state dir, so it never touches ~/.austere-axi.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const cli = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "austere-axi.cmd" : "austere-axi");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "austere-pack-gantt-"));
const env = { ...process.env, AUSTERE_AXI_STATE_DIR: path.join(work, "state") };

function run(cmd, args, { expect = 0 } = {}) {
  const r = spawnSync(cmd, args, { cwd: root, env, encoding: "utf8", shell: process.platform === "win32" });
  process.stdout.write(`$ ${path.basename(cmd)} ${args.join(" ")}\n${r.stdout}${r.stderr}`);
  if (r.status !== expect) throw new Error(`${path.basename(cmd)} ${args.join(" ")} exited ${r.status}, expected ${expect}`);
  return r.stdout;
}

try {
  const packed = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", work]));
  const tgz = path.join(work, packed[0].filename);
  run(cli, ["components", "add", tgz, "--trust"]);

  const page = path.join(work, "rollout.html");
  fs.copyFileSync(path.join(root, "examples", "rollout.html"), page);
  // The example does not declare the pack, so the first check must fail and say how to fix it.
  const first = run(cli, ["check", page], { expect: 1 });
  if (!first.includes("missing-pack")) throw new Error("expected a missing-pack error before --fix");
  run(cli, ["check", "--fix", page]);
  run(cli, ["check", page]);
  console.log("ok: the packed .tgz installs and the example checks clean");
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
