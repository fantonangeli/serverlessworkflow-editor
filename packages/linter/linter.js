/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const oxlintBin = process.platform === "win32" ? "oxlint.cmd" : "oxlint";
const oxlintPath = join(__dirname, "node_modules", ".bin", oxlintBin);

const args = ["--config", "oxlintrc.json", ...process.argv.slice(2)];

const oxlint = spawn(oxlintPath, args, {
  stdio: "inherit",
});

oxlint.on("exit", (code) => {
  process.exit(code ?? 0);
});
