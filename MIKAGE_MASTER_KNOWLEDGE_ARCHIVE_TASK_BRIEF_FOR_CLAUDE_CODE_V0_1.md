# TASK BRIEF FOR CLAUDE CODE — MIKAGE MASTER KNOWLEDGE ARCHIVE V0_1
> Operator note (VN): Dán toàn bộ phần dưới đây cho Claude Code trong CMD. Đây là task READ-ONLY (chỉ đọc + index). KHÔNG render, KHÔNG sửa/xoá file nguồn, KHÔNG commit git, KHÔNG upload. Reviewed + corrected version of the GPT draft.

---

## ROLE
You are an audit-and-index agent. Do NOT create new creative content. Do NOT rewrite or invent lore, lyrics, metadata, or strategy. Only inspect files, extract confirmed information, classify assets, and build the archive deliverables. When in doubt, mark `CHUA_XAC_NHAN`.

## GOAL
Produce three deliverables that consolidate all confirmed MIKAGE IP information so a future AI data store (Vertex AI Agent Builder / "Search and Conversation") answers about MIKAGE ONLY from confirmed source data:
1. `MIKAGE_MASTER_KNOWLEDGE_ARCHIVE_V0_1.md` — canon + summary (kept compact)
2. `MIKAGE_MASTER_KNOWLEDGE_ARCHIVE_FILE_INDEX_V0_1.csv` — the heavy per-file index
3. `MIKAGE_MASTER_KNOWLEDGE_ARCHIVE_VERIFY_REPORT_V0_1.md` — verification report

Suggested output dir (do NOT commit): `D:\KAGAMI-MZ_SYNC_PUSH_V2\archive\master_knowledge_v0_1\` (create if missing). Report the final paths.

## HARD RULES
1. Do NOT delete, rename, move, or modify any source asset.
2. Do NOT generate new lore, lyrics, metadata, or strategy.
3. Do NOT mark anything CONFIRMED unless the source file clearly proves it.
4. Missing/unclear → `CHUA_XAC_NHAN`.
5. Conflicting files → keep BOTH entries, mark `CONFLICT_NEEDS_OPERATOR_REVIEW`.
6. Rejected/dead/old draft → `REJECTED_OR_ARCHIVE_CANDIDATE`, never "final".
7. Do NOT inline binary content into any deliverable.
8. Audio/image/video: record path, filename, size, and detectable duration/resolution/fps/codec; infer role ONLY if source context confirms it.
9. Prioritize canonical repo docs and verified reports over loose Downloads/Desktop files (see SOURCE_PRIORITY).
10. Do NOT touch locked finals, approved assets, or archived/rejected files except to READ metadata. Treat `D:\MIKAGE ZENITH AUDIO` locked/approved/archived items as read-only.
11. Do NOT commit to git. Do NOT upload to any cloud. Only create files and report paths.

## CORRECTIONS APPLIED (vs original draft — follow these)
- **A. Large-file sampling:** For text-type files (.md .txt .json .csv .html) larger than 256 KB, read only the first ~200 lines + any clear header/title/metadata block; record `CONTENT_SAMPLED=YES`. Files at/under 256 KB may be read fully. Never read binary as text.
- **B. Deduplication:** Compute a fingerprint per file (SHA-256, or `name+size+mtime` if hashing is too slow on huge media). When the same content appears in multiple roots (e.g. local + Google Drive), keep the highest-priority copy as canonical and mark the others `DUPLICATE_OF=<canonical path>` in the CSV. Do not double-count duplicates in totals.
- **C. Heavy index → CSV only:** The full per-file listing (sections 05/06/07 detail + every scanned relevant file) goes in the CSV. The `.md` keeps only: status, search roots, priority rule, confirmed track catalog, lyrics index (status rows, no full lyrics unless final clean), lore/character/visual canon, public/social, rights proof, rejected list, conflicts, upload summary, verification. This keeps the `.md` small enough to ingest cleanly.
- **D. Privacy discipline:** In `Downloads`, `Desktop`, `Documents`, include a file ONLY if filename/path/content matches a RELEVANCE KEYWORD. Do NOT index unrelated personal files.
- **E. Encoding:** Read text as UTF-8; preserve Vietnamese diacritics. CSV must be UTF-8 (with BOM if needed for Excel).
- **F. Tooling:** Use `ffprobe` for audio/video duration, sample rate, channels, resolution, fps, codec, bitrate. Use `pdftotext` / `pandoc` for .pdf/.docx text extraction. If a tool fails on a file, record the error and `CHUA_XAC_NHAN` for that field — do not guess.
- **G. Access reality:** Claude Code runs locally with drive access. If a root truly does not exist, record it under `SEARCH_ROOTS_NOT_FOUND`. Expand `%USERNAME%` to the real user. Google Drive in streaming/online-only mode may be unreadable — if so, record `SCAN_STATUS=DRIVE_NOT_LOCALLY_AVAILABLE`.

## SEARCH ROOTS (scan if they exist)
- `D:\KAGAMI-MZ`
- `D:\KAGAMI-MZ_SYNC_PUSH_V2`
- `D:\MIKAGE ZENITH AUDIO`
- `D:\MIKAGE`
- `D:\Google Drive`
- `G:\My Drive`
- `C:\Users\%USERNAME%\Google Drive`
- `C:\Users\%USERNAME%\My Drive`
- `C:\Users\%USERNAME%\Downloads`
- `C:\Users\%USERNAME%\Desktop`
- `C:\Users\%USERNAME%\Documents`
Roots not found → `SEARCH_ROOTS_NOT_FOUND`.

## TARGET FILE TYPES
Text/docs: .md .txt .json .csv .pdf .docx .html
Audio: .wav .mp3 .flac .m4a
Image: .png .jpg .jpeg .webp
Video: .mp4 .mov
Archive: .zip (list metadata only; do NOT extract unless trivially safe and clearly MIKAGE — otherwise record `ZIP_NOT_EXPANDED`)

## RELEVANCE KEYWORDS
MIKAGE, Mikage, Zenith, KAGAMI, TooLost, THE LANDAUER PARADOX, DIGITAL ASH, THE BREACH, SINGULAR HEART, PORCELAIN ASCENSION, THE THEOREM, THE ROOT ARCHITECT, GLASS SKIN, PORCELAIN ECHO, DON'T LOOK BACK, RAIN AFTERIMAGE, SOFT IN THE WIRE, SLOW ORBIT, THE ROAD TO HERE, KINTSUGI, Lyra, LORA, Commander Lyre, porcelain, graphene, B4C, faceless, void, short, reels, release, Spotify, YouTube, TikTok, Too.fm, ISRC, UPC.

## SOURCE_PRIORITY_RULE
1. Explicit operator-approved / canonical docs
2. Verified render / proof / release reports
3. TooLost / catalog exports
4. Website / public data
5. Track package metadata
6. Loose local files
7. Drafts / rejected / dead artifacts

## OUTPUT STRUCTURE — `MIKAGE_MASTER_KNOWLEDGE_ARCHIVE_V0_1.md`
```
# MIKAGE MASTER KNOWLEDGE ARCHIVE V0.1
## 00_ARCHIVE_STATUS        (created at, machine, operator, scope, status, warning)
## 01_SEARCH_ROOTS_SCANNED  (path | exists | scan status | relevant file count)  + SEARCH_ROOTS_NOT_FOUND
## 02_SOURCE_PRIORITY_RULE
## 03_CONFIRMED_TRACK_CATALOG   (per track: ID, title, alt title, language, release status/date, TooLost status, UPC, ISRC, Too.fm, Spotify, YouTube, lyrics source, audio source, cover source, short source, confidence, source files; missing→CHUA_XAC_NHAN)
## 04_CONFIRMED_LYRICS_INDEX     (status rows only; NO full lyrics unless file is explicitly FINAL CLEAN lyric, then keep track sections separated)
## 05_AUDIO_ASSET_INDEX          (SUMMARY here; full rows in CSV)
## 06_VISUAL_ASSET_INDEX         (SUMMARY here; full rows in CSV)
## 07_SHORT_VIDEO_INDEX          (SUMMARY here; full rows in CSV)
## 08_LORE_AND_WORLD_CANON       (CONFIRMED_CANON / DRAFT_ONLY / REJECTED / CHUA_XAC_NHAN)
## 09_CHARACTER_CANON            (Lyra, LORA, Commander Lyre, Mikage Zenith — only if found)
## 10_VISUAL_CANON_RULES         (porcelain, faceless, helmet, graphene/graphite, B4C, palette void/violet/rain, forbidden, cover rules, short rules — no new rules)
## 11_PUBLIC_WEBSITE_AND_SOCIAL  (website, label, contact email, Spotify, YouTube, TikTok, X, IG, FB, source files; else CHUA_XAC_NHAN)
## 12_RELEASE_AND_RIGHTS_PROOF   (TooLost notes, AI rights proof packs, metadata, UPC/ISRC evidence, clean lyric files, distribution status)
## 13_REJECTED_OR_DEAD_ARTIFACTS (list; do NOT delete)
## 14_CONFLICTS_AND_OPEN_QUESTIONS (conflict | file A | file B | recommended operator decision)
## 15_UPLOAD_READY_SUMMARY       (what archive contains / what AI may answer / what AI must NOT claim / CHUA_XAC_NHAN rule)
## 16_FINAL_VERIFICATION_REPORT  (totals: scanned, relevant, tracks, audio, image, video, conflicts, CHUA_XAC_NHAN; output paths; errors)
```

## CSV — `MIKAGE_MASTER_KNOWLEDGE_ARCHIVE_FILE_INDEX_V0_1.csv`
Columns: `root, path, filename, ext, category(text/audio/image/video/archive), size_bytes, sha256_or_fingerprint, duplicate_of, duration_s, resolution, fps, sample_rate, channels, codec, bitrate, related_track_or_entity, inferred_role, status, confidence, source_priority_tier, notes`.

## VERIFY REPORT — `MIKAGE_MASTER_KNOWLEDGE_ARCHIVE_VERIFY_REPORT_V0_1.md`
Totals scanned/relevant/confirmed-tracks/audio/image/video/conflicts/CHUA_XAC_NHAN, per-root scan status, tool errors, dedup count, and the 3 output paths.

## FINAL STEP
Report all three file paths and the verification totals. Do NOT commit. Do NOT upload.
```
END OF TASK BRIEF
```
