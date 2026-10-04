# Release checklist (Corresponding Source audit)

Audit of what a reviewer needs, as of 2026-10-04. **PRESENT** means the material exists in this package;
it is not a statement that GPL compliance is achieved. No legal review has been done.

## Materials

| # | Item | Status | Where / note |
|---|---|---|---|
| 1 | GNU GPL v3 text | PRESENT | `LICENSE` (same bytes the app serves at `/engine/<buildId>/LICENSE-GPL-3.0.txt`) |
| 2 | Exact engine source (repository, tag, commit) | PRESENT | `BUILD-INFO.json`; shielune/YaneuraOu `v9.60.2` = `ff8b229b…` |
| 3 | Engine source snapshot that does not depend on a third-party host | PRESENT | `source-archive/YaneuraOu-shielune-v9.60.2-ff8b229b.tar.gz` (`git archive` of the commit) |
| 4 | Source identity check | PRESENT | `SOURCE-TREE.git-ls-tree.txt` + `scripts/fetch-source.mjs` (tree id `7062656f…`) |
| 5 | Upstream provenance | PRESENT | yaneurao/YaneuraOu (`README.md`, `NOTICES.md`) |
| 6 | Toolchain versions (Emscripten, emsdk commit, node, python) | PRESENT | `BUILD.md`, `BUILD-INFO.json` |
| 7 | Exact build script and flags | PRESENT | `scripts/build-engine.mjs`, `BUILD.md` (script was previously only on the maintainer's machine) |
| 8 | Patches / modifications | PRESENT (none) | `MODIFICATIONS.md` |
| 9 | Architecture / edition | PRESENT | HalfKP_768x2_16_64 |
| 10 | Glue and wasm hashes | PRESENT | `SHA256SUMS.txt`, `BUILD-INFO.json` |
| 11 | Shipped binaries | PRESENT | `dist/<buildId>/` |
| 12 | Reproducible rebuild | PRESENT, verified 2026-10-04 | clean checkout, different path → byte-identical glue + wasm (`BUILD.md` → Reproducibility) |
| 13 | Build ID ↔ source mapping | PRESENT | `BUILD-INFO.json` (`buildId`, commit, hashes); the app's `engineBuilds.ts` carries the same values and a test pins the committed files to them |
| 14 | Copyright notices | PRESENT (extract) | `NOTICES.md`, transcribed from the source; not an exhaustive contributor list |
| 15 | Model provenance, size, SHA-256 | PRESENT | `MODEL.md` |
| 16 | Author's license statement for `nn.bin` | PRESENT, weak | BBS post only (`MODEL.md`); the archive has no license text |
| 17 | Training procedure for the model | PRESENT (links) | `MODEL.md`; reach of "Corresponding Source" for weights is unsettled |

## Open items (need a human)

| # | Item | Why it is open |
|---|---|---|
| A | **Create the public repository** (suggested name `shogi-endgame-trainer-engine`) and push this directory | Publishing is an external action; not done without explicit approval |
| B | Set the app env `NEXT_PUBLIC_ENGINE_CORRESPONDING_SOURCE_URL` to that repository's `https://` URL | Until set, the app's `/settings/software` shows "公開準備中" and no link (by design) |
| C | Confirm the `nn.bin` license in writing, or ask the author to add a license file/note to the official repository or release | Current evidence is a single bulletin-board post |
| D | Decide whether the repository should also carry a GitHub release with the exact binaries and archive | Convenience; not required by the build |
| E | Legal review of the whole arrangement (engine + weights + app) | Not performed; nothing here asserts compliance |
| F | Keep this repository in step with the app: any new engine/model build needs a new `buildId`, a new row in `BUILD-INFO.json` and a matching entry in the app's `engineBuilds.ts` | Process |

The app must not enable the feature for the public until A and B are done.
