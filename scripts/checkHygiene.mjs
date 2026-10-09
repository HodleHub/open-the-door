import { readdir, readFile } from "node:fs/promises";
import { resolve, relative, extname, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignored = new Set([".git", "node_modules", ".build"]);
const allowedExtensions = new Set([".md", ".ts", ".mjs", ".json"]);
const allowedNames = new Set([
  "LICENSE",
  ".gitignore",
  ".prettierignore",
  ".env.example",
]);
const findings = [];

const scan = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;

    const path = resolve(directory, entry.name);
    const label = relative(root, path);

    if (entry.isSymbolicLink()) {
      findings.push(`${label}: symlink not allowed in publication inventory`);
      continue;
    }

    if (entry.isDirectory()) {
      await scan(path);
      continue;
    }

    if (
      !allowedExtensions.has(extname(path)) &&
      !allowedNames.has(basename(path))
    ) {
      findings.push(`${label}: unexpected file type`);
      continue;
    }

    if (entry.name.startsWith(".env") && entry.name !== ".env.example") {
      findings.push(`${label}: real environment file`);
      continue;
    }

    const text = await readFile(path, "utf8");
    const rules = [
      [
        "private key block",
        /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
      ],
      ["formatted personal identifier", /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/],
      ["formatted company identifier", /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/],
      ["cloud access-key shape", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
      ["personal filesystem path", /\/(?:Users|home)\/[a-zA-Z0-9_-]+\//],
      ["binary content", /\x00/],
    ];

    for (const [name, pattern] of rules) {
      if (pattern.test(text)) findings.push(`${label}: ${name}`);
    }
  }
};

await scan(root);

if (findings.length) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    "Repository hygiene OK. This pattern check complements secret scanning and manual PII review.",
  );
}
