# Evaluation file: AobaNNUE v1.1

The app's engine needs an NNUE evaluation file. It is **not** part of this repository (192,624,720 bytes) and is
**not** embedded in the WebAssembly binary: the user's browser downloads it once from a version-fixed URL and
verifies its SHA-256 before use.

| Item | Value |
|---|---|
| Name / version | AobaNNUE ver 1.1 (2026-01-03) |
| Author (as written in the bundled notes `aobannue.txt`) | Hiroshi Yamashita |
| File | `eval/nn.bin` |
| Size | 192,624,720 bytes |
| SHA-256 | `f8ee839ae8c08537036f23345dd5ed0416958b22425476fc60177942903219b5` |
| Real layout | `HalfKP_768x2_16_64` (the file's header string says `256x2`; the layout is what the author's engine and this build use) |
| Header version / hash | `0x7AF32F16` / `0x3E5AA222` |

## Official distribution

- Repository: <https://github.com/yssaya/AobaNNUE> (GPL-3.0; its `Copying.txt` starts with SHA-256 `94a9ed02…`),
  inspected HEAD `8613a0ac911fe35e3fa70aaf012ab6243b7096eb` (2026-01-03).
- Release tags: `v1` = `502519eabc9107f599f60e9a446fe6ed173caf2a`, `v1.1` = `514c956e914d4c66b077b3635b68d65c071a708f`.
  The GitHub releases carry **no assets**; they link to Google Drive.
- Archive used: `20260103AobaNNUE.zip` (v1.1), Google Drive id `1bf7GGGM8vM8kQ_icAwbiR7IM6uH3BJ4u`,
  77,797,439 bytes, SHA-256 `83d4798d7461e29e95ba1700f4f5bf10e670b360ab1004102e21b913c22ed979`.
  `nn.bin` is `eval/nn.bin` inside it. The zip contains `source/`, three Windows executables, `aobannue.txt` and
  `engine_name.txt`, and **no license text**.

## License statement

The archive carries no license file. The author stated the license of `nn.bin` publicly, in reply to a direct
question about whether the whole distribution including `nn.bin` is GPLv3
(<http://www.yss-aya.com/bbs/patio.cgi?read=210&ukey=0>, question 2026/09/26 19:58, answer 2026/09/27 14:55:
"はい。nn.binもGPLv3でお願いします。"). The question, answer, dates, posters, the saved page's SHA-256 and what the
statement does and does not establish are recorded in **`LICENSE-PROVENANCE.md`**.

## How it was made (author's notes, `aobannue.txt`)

- Engine source: YaneuraOu V9.00 with small changes; HalfKP_768x2_16_64 instead of the standard NNUE;
  `FV_SCALE` default changed from 16 to 40.
- Training data: positions from `shogi_hao_depth9` re-evaluated with AobaZero's evaluation values; trained with the author's `train.py` command line given in `aobannue.txt`.
  Related pages listed there: <http://www.yss-aya.com/bbs/patio.cgi?read=195&ukey=1>,
  <https://github.com/yssaya/cshogi_aoba/tree/main/psv_shuffle>.
- Training-data licensing as recorded when this was audited (verify before relying on it): `shogi_hao_depth9` is
  MIT per its Hugging Face dataset card; AobaZero data/weights are public domain.
- How far GPL "Corresponding Source" reaches for trained weights is not settled; the training procedure above is
  linked rather than reproduced.

## How the app uses it

- Model id `aoba-nnue`, version `1.1`, SHA-256 above. The browser cache key is `modelId / version / sha256`;
  a different file must change the URL **and** the version **and** the SHA-256 (never replace the content behind
  an existing URL).
- Written to `/eval/nn.bin` in the engine's in-memory file system before `isready`, then released after
  `readyok` (the engine keeps its own copy).
