# shogi-endgame-trainer-engine

Corresponding Source and build information for the shogi engine that the web app
**ひとり感想戦 (shogi-endgame-trainer)** ships for its "ソフトで確認" (check with the engine) feature.

このリポジトリは、アプリ「ひとり感想戦」が「ソフトで確認」機能のために配布している将棋ソフト
(WebAssembly 版 YaneuraOu)の、**ソース・ビルド手順・ハッシュ・出所**をまとめたものです。

> This is not legal advice and makes no claim of legal compliance; it collects, in one place, the materials needed
> to review that. See `RELEASE-CHECKLIST.md` for what is present and what is still open.

## Relationship to the app

"ひとり感想戦" is a web app for reviewing shogi positions. Its "ソフトで確認" feature runs the engine below in the
user's browser (a Dedicated Worker, single thread) and loads the evaluation file from a version-fixed URL. This
repository is not the app: it holds only what is needed to inspect, rebuild and verify the engine the app serves.

## What the app distributes

| Item | Where | License |
|---|---|---|
| YaneuraOu WebAssembly build (`yaneuraou.nnue768.js` / `.wasm`) | served by the app from `/engine/<buildId>/`, copy in `dist/` here | GPL-3.0 (`LICENSE`) |
| AobaNNUE v1.1 evaluation file (`nn.bin`, 192,624,720 bytes) | downloaded by the user's browser from a version-fixed URL on first use; **not in this repository** | GPL-3.0 per the author's statement (`MODEL.md`) |

Build ID: `yo-9.60.2-ff8b229-hkp768-g5a61066f`

| File | SHA-256 |
|---|---|
| `yaneuraou.nnue768.js` | `5a61066f16cddda883b5fde0c13d5842328e189f0140ec31e0a0ce56ce8e0898` |
| `yaneuraou.nnue768.wasm` | `2c5b95c57c1e3a45f168e0a75519e2415c32a1afd4bb69f53a214aa764145aca` |
| `nn.bin` | `f8ee839ae8c08537036f23345dd5ed0416958b22425476fc60177942903219b5` |

## Where the source is

- Engine: <https://github.com/shielune/YaneuraOu>, tag `v9.60.2`, commit
  `ff8b229b2cffbdd4a2ded35509bf3a66ee2ff6a8` (fork of <https://github.com/yaneurao/YaneuraOu>).
- The engine source is **not modified** (see `MODIFICATIONS.md`).
- This repository adds: the build script, build flags, toolchain versions, expected hashes,
  provenance of the evaluation file and a release checklist.

## Reproduce the build

```bash
node scripts/fetch-source.mjs ./YaneuraOu                  # clone + verify the exact commit and tree
# activate Emscripten 5.0.5 (see BUILD.md), then:
node scripts/build-engine.mjs --source ./YaneuraOu/source --out ./out
node scripts/verify.mjs ./out                              # compares with the shipped hashes
```

The build is bit-reproducible: on 2026-10-04 the build was repeated from a clean checkout of the
pinned commit, at a different path than the original build, and both output files were
byte-identical to the shipped ones (`BUILD-INFO.json` → `reproduced`).

## Releases / tags

Each engine build the app serves has an immutable, annotated tag named exactly like its **build ID**
(`yo-9.60.2-ff8b229-hkp768-g5a61066f` for the current one; the name encodes engine version, source commit,
architecture and the first 8 hex digits of the glue's SHA-256). The app links to the tag, not to the branch head.
A different binary or evaluation file always gets a new build ID and a new tag; existing tags are never moved.

## License provenance of the model

`LICENSE-PROVENANCE.md` records, with dates and posters, the author's public statement that `nn.bin` is GPL v3.

## Files

| File | Purpose |
|---|---|
| `LICENSE` | GNU GPL v3 text (same file the app bundles) |
| `NOTICES.md` | copyright notices transcribed from the source and the model's bundled notes |
| `BUILD.md` | toolchain, exact steps and flags |
| `MODIFICATIONS.md` | what differs from upstream (nothing in the source) |
| `MODEL.md` | AobaNNUE provenance, size, hash |
| `LICENSE-PROVENANCE.md` | the author's statement that `nn.bin` is GPL v3: where, when, in reply to what |
| `BUILD-INFO.json` / `SHA256SUMS.txt` | machine-readable build record and hashes |
| `SOURCE-TREE.git-ls-tree.txt` | git object ids of every file under `source/` at the pinned commit |
| `scripts/` | `fetch-source.mjs`, `build-engine.mjs`, `verify.mjs` |
| `dist/<buildId>/` | the exact binaries the app serves |
| `RELEASE-CHECKLIST.md` | audit of what is present / still open before release |
