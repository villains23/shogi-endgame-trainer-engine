# Modifications

## To the engine source: none

The build compiles the files of `shielune/YaneuraOu` at commit `ff8b229b2cffbdd4a2ded35509bf3a66ee2ff6a8`
(tag `v9.60.2`) unmodified. Verified: the `source/` directory that produced the shipped binaries was
compared with a clean `git` checkout of that commit; the only difference was the generated header below.
`SOURCE-TREE.git-ls-tree.txt` lists the git object id of every file.

## Generated during the build (not patches)

- `source/eval/nnue/architectures/HALFKP_768X2_16_64.h` — written by the repository's own
  `eval/nnue/architectures/nnue_arch_gen.py HALFKP_768X2_16_64 eval/nnue/architectures`.

## Differences from the upstream release flow

- The build is driven by `scripts/build-engine.mjs` (a re-implementation of the Makefile's source list and
  flags) instead of `make` / Docker, with `--closure 0` and `SOURCE_DATE_EPOCH` pinned (see `BUILD.md`).
- No `brotli`/`gzip` post-processing, no `usi.js` / `.d.ts` generation (not needed by the app).

## The fork relative to upstream

`shielune/YaneuraOu` is a fork of `yaneurao/YaneuraOu` (V9.60 based) that adds WebAssembly build tooling and a few
engine options (see `docs/fork_engine_options.md` in the fork). The app uses `Threads`, `FV_SCALE`,
`MultiPV` and `go movetime`. This repository does not reproduce the fork's history; use the fork's git history
and the upstream repository for the full change log.

## The evaluation file

AobaNNUE's `nn.bin` is used unmodified (SHA-256 in `MODEL.md`). Its header string says `256x2` although the real
layout is `HalfKP_768x2_16_64`; that is a property of the author's file, not something this project changed.
