import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await Promise.all([
  rm(".next/standalone/public", { recursive: true, force: true }),
  rm(".next/standalone/.next/static", { recursive: true, force: true }),
  rm(".next/standalone/site/dist", { recursive: true, force: true }),
]);
await mkdir(".next/standalone/.next", { recursive: true });
await cp("public", ".next/standalone/public", { recursive: true, force: true });
await cp(".next/static", ".next/standalone/.next/static", { recursive: true, force: true });
await mkdir(".next/standalone/site", { recursive: true });
await cp("site/dist", ".next/standalone/site/dist", { recursive: true, force: true });

const packagePath = ".next/standalone/package.json";
const packageManifest = JSON.parse(await readFile(packagePath, "utf8"));
packageManifest.scripts = { start: "HOSTNAME=127.0.0.1 node server.js" };
await writeFile(packagePath, `${JSON.stringify(packageManifest, null, 2)}\n`);
