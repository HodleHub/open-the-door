import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve, relative } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignored = new Set([".git", "node_modules", ".build"]);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !ignored.has(entry.name))
      .map(async (entry) => {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) return walk(path);

        return [path];
      }),
  );

  return nested.flat();
};

const files = await walk(root);
const inventory = new Set(files);
const markdown = files.filter((file) => file.endsWith(".md"));
const index = await readFile(resolve(root, "docs/README.md"), "utf8");
const failures = [];

for (const file of markdown) {
  const content = await readFile(file, "utf8");
  const links = [...content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)];

  for (const match of links) {
    const target = match[1].split("#")[0];

    if (!target || /^(https?:|mailto:)/.test(target)) continue;

    const path = resolve(dirname(file), decodeURIComponent(target));

    if (!path.startsWith(root + "/") || !inventory.has(path)) {
      failures.push(`${relative(root, file)}: missing local link ${target}`);
    }
  }

  if (file !== resolve(root, "docs/README.md")) {
    const indexedPath = relative(resolve(root, "docs"), file).replaceAll(
      "\\",
      "/",
    );

    if (!index.includes(`](${indexedPath})`))
      failures.push(`${relative(root, file)}: not indexed`);
  }

  if (!/^# .+/m.test(content))
    failures.push(`${relative(root, file)}: missing title`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Documentation OK: ${markdown.length} Markdown files, local links and index checked.`,
  );
}
