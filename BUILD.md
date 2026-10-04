# Build instructions

Target: the `YANEURAOU_ENGINE_NNUE_HALFKP_768X2_16_64` edition of the YaneuraOu fork at commit
`ff8b229b2cffbdd4a2ded35509bf3a66ee2ff6a8`, compiled to a single-thread WebAssembly module for web
browsers (no `SharedArrayBuffer`, no COOP/COEP needed). Requires WebAssembly SIMD at run time.

## Toolchain (exact versions of the shipped build)

| Component | Version |
|---|---|
| Emscripten | 5.0.5 (`bc569045b14c3fa7b960734ed2c50da7b20adea4`) |
| emsdk | <https://github.com/emscripten-core/emsdk> at `96c657fc60920d2a6a82318aa50e0abf82749604` |
| emsdk toolchain release | `releases-6eae703422b3962d1ed75e15f728ece57aad6bd6-64bit` |
| Node.js (bundled by emsdk, runs Emscripten) | 24.19.0 |
| Python (bundled by emsdk) | 3.13.3 |
| Host used for the shipped build | Windows 11 x64 |

```bash
git clone https://github.com/emscripten-core/emsdk.git && cd emsdk
git checkout 96c657fc60920d2a6a82318aa50e0abf82749604
./emsdk install 5.0.5 && ./emsdk activate 5.0.5
source ./emsdk_env.sh        # Windows: emsdk_env.bat / PowerShell: emsdk_env.ps1
```

`scripts/build-engine.mjs` needs `em++.py` on `PATH` (what `emsdk_env` provides), Node.js >= 18 and a
`python`/`python3` for the architecture header generator. On Windows with a bundled-python emsdk, set
`EMSDK_PYTHON` to that python (as `emsdk_env` does).

## Steps

1. `node scripts/fetch-source.mjs ./YaneuraOu` — clones and checks out the pinned commit and verifies that
   `source/` is exactly the tree listed in `SOURCE-TREE.git-ls-tree.txt` (tree id
   `7062656f62c9645b5102779cd6a7abbf7b4116be`).
2. `node scripts/build-engine.mjs --source ./YaneuraOu/source --out ./out`
   - generates `eval/nnue/architectures/HALFKP_768X2_16_64.h` with the repository's own
     `nnue_arch_gen.py HALFKP_768X2_16_64` (an output of the build, not a patch);
   - compiles the 54 translation units with the flags below;
   - links `yaneuraou.nnue768.js` + `.wasm`.
3. `node scripts/verify.mjs ./out` — compares with the shipped hashes.

## Why a script instead of `make`

The upstream Makefile target is `make tournament COMPILER=em++ TARGET_CPU=WASM YANEURAOU_EDITION=...`.
GNU make and Docker were not available on the build machine, so `scripts/build-engine.mjs` reproduces the
Makefile's source list and flags (taken from `source/Makefile` and `script/wasm_build.js` of the pinned
commit). Anyone with the upstream toolchain may build with `make` instead; the output is expected to
match only if the flags below are used.

## Flags

Compile (`-c`):

```
-std=c++17 -fno-exceptions -fno-rtti -Wextra -fpermissive -O2 -DNDEBUG -Wno-unused-parameter
-DUSE_WASM_SIMD -msimd128 -DUSE_SSE42 -msse4.2 -s STRICT=1 -DEM_MAXIMUM_MEMORY_SIZE=2147483648
-DUNICODE -DNO_EXCEPTIONS
-DYANEURAOU_ENGINE_NNUE -DYANEURAOU_ENGINE_NNUE_HALFKP_768X2_16_64
-DNNUE_ARCHITECTURE_HEADER="architectures/HALFKP_768X2_16_64.h"
-DTARGET_CPU="WASM" -DFOR_TOURNAMENT -flto
```

Link:

```
-flto -lpthread -v --pre-js wasm_pre.js
-s MODULARIZE=1 -s EXPORT_NAME=YaneuraOu_HalfKP768_noeval -s EXPORT_ES6=1 -s ENVIRONMENT=web
-s INCOMING_MODULE_JS_API=print,printErr,postRun,preRun,onAbort,onExit,onRuntimeInitialized,wasmBinary,locateFile,instantiateWasm,mainScriptUrlOrBlob,noInitialRun,noExitRuntime,arguments
-s FILESYSTEM=1 -s EXIT_RUNTIME=0 -s EXPORTED_RUNTIME_METHODS=['FS','ccall']
-s ALLOW_MEMORY_GROWTH=1 -s INITIAL_MEMORY=268435456 -s MAXIMUM_MEMORY=2147483648 -s STACK_SIZE=67108864
--closure 0
```

`--closure 0` matters: with Closure the `FS` methods are renamed and the model cannot be written to the
in-memory file system.

## Reproducibility notes

- The engine prints/embeds its compile date (`__DATE__`). Clang honours `SOURCE_DATE_EPOCH`; the script pins it
  to `1791028800` (2026-10-03T12:00:00Z) so the output is byte-identical to the shipped binary, whose
  embedded string is `Oct  3 2026`. Without it, the only difference is that one date string (one byte).
- Verified 2026-10-04: build from a clean checkout of the pinned commit (different absolute path than the
  original build, Windows line endings in the working tree) → glue and wasm identical to the shipped files.
- Not verified: other host operating systems / other Emscripten point releases.

## Runtime requirements and options used by the app

- The evaluation file is **not** embedded. The app writes it to `/eval/nn.bin` in the module's in-memory file
  system before `isready`.
- USI options set by the app: `Threads=1`, `FV_SCALE=40` (AobaNNUE's recommended value).
