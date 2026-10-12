import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Keep the independent migration snapshot intact; subsequent user-approved
// changes have their own exact byte contract for local and deployed assets.
export function getSiteAssetContract(reference) {
  const approvedChanges = JSON.parse(readFileSync("tests/approved-asset-changes.json", "utf8"));
  const originals = reference.files.filter((file) => file.path.startsWith("dist/assets/"));
  assert.equal(new Set(approvedChanges.map((change) => change.path)).size, approvedChanges.length);
  for (const change of approvedChanges) {
    const original = originals.find((file) => file.path === change.path);
    assert.ok(original, `Approved asset missing from source snapshot: ${change.path}`);
    assert.equal(change.originalSha256, original.sha256, `Original asset hash changed: ${change.path}`);
    assert.match(change.sha256, /^[a-f0-9]{64}$/);
    assert.ok(Number.isInteger(change.bytes) && change.bytes > 0);
    assert.ok(change.approvedOn && change.reason);
  }
  const assets = originals.map((original) => {
    const change = approvedChanges.find((item) => item.path === original.path);
    return change ? { ...original, bytes: change.bytes, sha256: change.sha256 } : original;
  });
  return { assets, approvedChanges };
}
