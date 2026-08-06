# ZENITH BLADE LINEAGE AUDIT 01 — SOURCE MANIFEST

**Task:** `ZENITH_BLADE_CODEX_LINEAGE_AUDIT_01` · **Date:** 2026-08-07
**Parent:** [ZENITH_BLADE_LINEAGE_AUDIT_01.md](ZENITH_BLADE_LINEAGE_AUDIT_01.md) ·
[ZENITH_BLADE_DELTA_TABLE_01.md](ZENITH_BLADE_DELTA_TABLE_01.md)

Every hash below was computed with `sha256sum` from the file on disk during this audit.
None is hand-typed or carried over from another document. Where a hash also appears in an
existing repo manifest, it matched — noted inline.

**Roots.** `REPO` = `D:\KAGAMI-MZ_SYNC_PUSH_V2` · `OS` = `C:\Users\nt\Claude\Projects\Mikage Zenith — Studio OS`
(external, read-only). Paths are relative to their root.

---

## 1. Produced artifacts (new files only)

| File | SHA-256 | Bytes |
|---|---|---|
| `ZENITH_BLADE_LINEAGE_AUDIT_01.md` | `6e9c268f53bfb742c19d6f43a760d9c2c8f2464aea4647c0d6de003d5d86af2e` | 42362 |
| `ZENITH_BLADE_DELTA_TABLE_01.md` | `bbdc5823ad671808e3e270f8f3b2c5748d4ce40c1fd3df30200ea6bb45084a8a` | 15083 |
| `ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png` | `e050acf0351942669e5ab6f5ab7a065c88898cb86559be3cf263e5144d7f75ba` | 3258790 |

> This manifest is written last and deliberately does not hash itself — a two-way hash reference
> could never be simultaneously true. Verify it by recomputing its sha256 directly from disk.

---

## 2. Composite source images — `ZENITH_BLADE_MOCK_VS_CE15_SIDEBYSIDE.png`

Composite / layout only (Python + PIL). Blender was **not** opened. No ComfyUI, no image generation,
no AI synthesis, no retouch, no colour change. Sources are byte-unmodified. A missing source aborts
generation rather than substituting similar imagery.

| Panel | Cited source (REPO-relative) | SHA-256 | Bytes | Crop box applied | Scale |
|---|---|---|---|---|---|
| A | `assets/keyart/blade/MIKAGE_ZENITH_BLADE_LOCKED_4x5.png` | `b74216468a3c5b7e2cd4eaadae13d96ce55d4d09ffaa26041dfa1e2b76327c0e` | 6327334 | `(775, 251, 1399, 1993)` | 0.758 |
| B | `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_NEUTRAL_RENDER.png` | `eec210abf717407d1be5b8086051251bf3aac6df319490f96d4e2997b72d22c5` | 1630122 | `(390, 418, 893, 1728)` | 1.008 |
| C | `renders/board_v1_evidence/pass_03/HC_authored_P3.png` | `8a9d2522a5788a5728c2125881f973c6e3beb0479a1cfe652a77f95011a024d4` | 1973793 | `(611, 88, 1172, 990)` | 1.463 |
| D | `renders/board_v1_evidence/OUT1_HERO_P3_85MM.png` | `e1fd1772bcaa76f0478599fa122604ea0e03ba1ffeabbbac0cfaf3424d1dcde4` | 4583822 | `(366, 0, 1481, 2400)` | 0.550 |
| Silhouette (left) | same as panel A — threshold mask `L > 70` **derived** from the crop `(1022, 300, 1152, 1944)` | — | — | derived analysis artifact, **not a render** | nearest-neighbour |
| Silhouette (right) | `renders/board_v1_evidence/pass_03/SIL_ce15_128.png` | `cca61575e31bab2edda9051525a9b0d56c522e9fe75ec5d319804b956f127807` | 13500 | `(43, 11, 86, 116)` | nearest-neighbour |
| Finding inset (left) | `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_MATERIAL_ID.png` | `7128d01c47696c66fe0857a74ba4ee499ddaa6ea9342bb1f7d8d921afa537c34` | 1645330 | `(450, 1450, 840, 1720)` | fit to 280 px |
| Finding inset (right) | `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_NEUTRAL_RENDER.png` | as panel B | — | identical crop box `(450, 1450, 840, 1720)` | fit to 280 px |

**Panel C / D note.** `HC_authored_P3.png` shows the whole object inside the frame (subject bbox
`(726, 113, 1057, 965)` inside 1920×1080). `OUT1_HERO_P3_85MM.png` is a tight hero crop — the blade
extends to the frame edge top and bottom (subject bbox `(366, 0, 1481, 2400)`). Both are labelled as
such on the composite.

**Typeface substitution.** Annotation text uses `C:\Windows\Fonts\arial.ttf` and
`C:\Windows\Fonts\consola.ttf`. Cinzel and Space Mono are **not present on disk** in this repo
(`find . -iname "*.ttf"` returns nothing outside `node_modules`). The composite is a forensic
diagram, not a brand asset; the substitution is recorded here rather than silently made.

**Panel-A hash cross-check.** `assets/keyart/blade/MIKAGE_ZENITH_BLADE_LOCKED_4x5.png`
(`b7421646…27c0e`) is **byte-identical** to `OS\BLADE_V0.1\MIKAGE_ZENITH_BLADE_LOCKED_4x5.png`.
Same for `MIKAGE_BLADE_3D_INSPECT.html` (`5aceca5f…7abaf`).

---

## 3. Cited evidence — REPO

### 3.1 V0.1 cine layer

| Path | SHA-256 |
|---|---|
| `assets/keyart/blade/MIKAGE_ZENITH_BLADE_LOCKED_4x5.png` | `b74216468a3c5b7e2cd4eaadae13d96ce55d4d09ffaa26041dfa1e2b76327c0e` |
| `assets/keyart/blade/MIKAGE_BLADE_3D_INSPECT.html` | `5aceca5f51b91ff00f1a8ed49f9f5a6b0107f794db42037d5fc27f725d07abaf` |
| `assets/keyart/CHARACTER_KEYART_V0.1/ZENITH_BLADE_REVEAL_STORYBOARD.md` | `13637788992ea27912c28107060742afcf7ac3cf8aed74dc14a7d07ffbca6167` |
| `docs/MIKAGE_SESSION_LESSONS.md` | `d71ecdcfe20f4f38d73bfde8cb6ddf8ffe491156e274b4e258b8947e4b0666f8` |

### 3.2 Locked-era canon / contract documents

| Path | SHA-256 |
|---|---|
| `MIKAGE_ZENITH_CANON_V2.md` | `4bafe29a2d8a60c4c54a6de4dd6920b003ddf56679f72bc79c405a7e7b1d5e9c` |
| `docs/handoff/MIKAGE_ZENITH_BLADE_SPEC_V1.md` | `55937e4439ee2eeea9cbec2405b41d3105cc42b0b41c5da587037fcc796f0acb` |
| `design_system/mikage-cine-color-contract.md` | `5c2b73a35890df0a92a8e72a0b4257d71be41ca0092e9b9d4e0075b82a18ab2b` |
| `production/character/keyart_candidates/MIKAGE_FOUNDATION_LOCK_V0_4.md` | `82b3fd83ff6b5e5a84392a25ff10d619cf194b1db888a15731ca9f46f04ae9c1` |
| `AGENTS.md` | `5240cea19e915b742b9b2cbb9bbef97cb76692c5a7dcf725b4cc77344d6fff55` |

### 3.3 Bridge — 2026-07-05 Codex slab brief

| Path | SHA-256 |
|---|---|
| `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1.md` | `a5d25165e344971c751bfafbec2ef5d31efdd4f358b2007d8f28ca9aa5fde04d` |
| `production/character/build_log/ZENITH_BLADE_SLAB_REFERENCE.svg` | `b011c379408a66404f69ee25047a77f55dee6dc31dcdbbf09313edf4575a1b29` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_SLAB_REMODEL_V0_1_PROOF.md` | `ab04651363a7e567305b1d041d36d8cef9ce69d5ce41fcb02d70265260440c2b` |

### 3.4 Built lineage — briefs, proofs and operator rulings

| Path | SHA-256 |
|---|---|
| `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_3PHASE_REBUILD_V0_1.md` | `8e4db295d6fa0ec2a8fb497b8617eb8cc4dcd93d0cae596b476362e7c3f13628` |
| `production/character/build_log/MIKAGE_ZENITH_BLADE_DEVELOPMENT_BUILD_LOG_V0_1.md` | `1f8708713fe1cb444740b772892ab68c47496359270aefdaf1d99b02b0ddb29e` |
| `production/character/build_log/GATHER_REEL_V0_1/build_buildlog_blade.py` | `25f2db321fc6ccc6b7d3f9c3f975e5b4df13a8c7cb15801ca225ea2c20d60062` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_3PHASE_REBUILD_V0_1_PROOF.md` | `a18dc529ba40f7fccfb24ea6b23f191837dfd73a9f8592f33ce37ab24fb43c89` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_FINAL_DRIFT_REVIEW_V0_1.md` | `9124c20dd1359391feb7630197b9a648bb88eb3c4dbb4e309e866c2961c08077` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_STANDALONE_FORM_REFINEMENT_V0_23_PROOF.md` | `3795c5185dc8b8c218b051b06968464dd037dcd87e384505c23a865213cee9d4` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MATERIAL_FIDELITY_V0_26_PROOF.md` | `197ce3daa4c378fb2dc064559b981773e8599b31373578d15f2d518ec1f3e2e4` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MATERIAL_FINALING_V0_29_PROOF.md` | `2b4a3ea210cf5ca271478f804711cd731cb41aee9c1db820d205df80376ed037` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_OPERATOR_LOCK_V0_33_RULING.md` | `4894f99c35beb9215b6a7ff404ee27f7e661c3bcdeaf9d251af6ecbf7ebff61e` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_VISUAL_NONCONFORMANCE_RESET_V0_41.md` | `63f692303f3d5b51c2e97e9b8fe83a02f34e66d36dc5d36be043217acc8498d7` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_V0_44_OPERATOR_VISUAL_RULING.md` | `2945284b0552e5f468954d949785046435dd86aa50419b63f401c310832142a6` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_V0_45_OPERATOR_RULING.md` | `c907a4b4c4f2988c9976f5e3b1252d863a7aa3016981b878a029e49d60228d6b` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_V0_46_OPERATOR_RULING.md` | `4fc2ebc3fd94dca17d6e7f7f6de661ee0192b266517b9f59410dd9e211c21390` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89_PROOF.md` | `d1f37d0541bf7e7877c2256ada06204cc43cc1c0428bd6b0579f0600e5a63c97` |

### 3.5 Proof series — FORM_A / EDGE_B / MAT_C / LIGHT_D / HERO_E1 (all 2026-07-31)

| Path | SHA-256 |
|---|---|
| `production/character/reviews/MIKAGE_ZENITH_BLADE_FORM_A1_PROOF.md` | `03f230ed8fe12d1fc77bcf775e16df334283b7da4a7a12a380468efc4cabaccc` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_FORM_A3_PROOF.md` | `0c62100b76484732cf26f22f7f28c8d0476eb1446f7f6e25fa0019b6132839f6` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_EDGE_B1_PROOF.md` | `b4b367b9142bbbe4348ccc73a610eafcb9601a8f0ed13803953e6153d909300f` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C1_PROOF.md` | `a77f115e927327417eca9aa47484869370a3a32d5305aff7b94bd8a31e6ed380` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C1_REPORT.json` | `079a770ae0dcc7ae1ef1e86a55f57b448ab24618ef5a5565f50177ee8dfcf98b` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_PROOF.md` | `c5072dbb90be6b9ad503b8965be1b3ab1afcd1c5638673fa996ca2afbb0ddbad` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_REPORT.json` | `7b11444dae20aa9d4784eecf2aca7852b611a9e829ae6c53164284690d6d7abb` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_NEUTRAL_RENDER.png` | `eec210abf717407d1be5b8086051251bf3aac6df319490f96d4e2997b72d22c5` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_MATERIAL_ID.png` | `7128d01c47696c66fe0857a74ba4ee499ddaa6ea9342bb1f7d8d921afa537c34` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C2_CONTACT_SHEET.png` | `c5968525a418577402b99a675a62ef1033c96790cc7bed26a411d51774b55f9c` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C3_PROOF.md` | `7994c5205db2059e534f1bbdeddfd63f719c13498cb56706d58f02cd3e228141` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_MAT_C3_REPORT.json` | `b8bc037c636b81287ae12266cf3ed951806ac703b8916f5ec78a7171d4e67139` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_LIGHT_D3_PROOF.md` | `235653c9f779955f7c77eae26301c6bd1b2ce81781391390d64ffbe53966dd6f` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_E1_QA_PROOF.md` | `6d845d374155de2745d9c02fdd410161f93419e2005e2ab1172dd13bf5e76b61` |
| `production/character/reviews/MIKAGE_ZENITH_BLADE_HERO_E1_QA_REPORT.json` | `53a3da3ef830188359c84f7c74a8183dc6a0652247349b2591372f224f4032ad` |

> The remaining 24 PNGs of the MAT_C / EDGE_B / LIGHT_D sets were opened and pixel-swept for the
> warm-colour measurement in §1 F2 of the audit but are not individually hashed here; the three
> files that carry the finding (`MAT_C2_MATERIAL_ID`, `MAT_C2_NEUTRAL_RENDER`, `MAT_C2_CONTACT_SHEET`)
> are hashed above. The full swept set is: `MIKAGE_ZENITH_BLADE_{MAT_C1,MAT_C2,MAT_C3,EDGE_B1,LIGHT_D1,LIGHT_D2,LIGHT_D3}_*.png`
> under `production/character/reviews/` — 39 files.

### 3.6 CE candidate lineage (`_tmp/`)

| Path | SHA-256 |
|---|---|
| `_tmp/zenith_blade_hero_e1_ce02/form02/FORM02_PROOF.md` | `043cd3febc401e5ddd9ea0535c3eb538cb1731ac5a5d58e2eda18b3fa0979f88` |
| `_tmp/zenith_blade_hero_e1_ce04/architecture01/ARCHITECTURE01_PROOF.md` | `aebeb0b193721ce02b68b0fe956d62f79d563c32b131aecf561216f2581945e3` |
| `_tmp/zenith_blade_hero_e1_ce05/architecture02/ARCHITECTURE_02_RESULT.md` | `1b1f578a2ce0a5a9fa232e3efbc513205145ad2d1129845b887ea56d4bfeaa0d` |
| `_tmp/zenith_blade_hero_e1_ce09/architecture03_rebuild/run_arch03_rebuild.py` | `360ba362587bd3d1a36f2afb2f0c637ba47d56f4ce3a727d74c85a548b1836ed` |
| `_tmp/zenith_blade_hero_e1_ce13/final_form_polish01/FP_TECHNICAL_INTEGRITY_REPORT.md` | `b5d8b47570169ba2beea52dc8940e9fc8857ed4cc19d7285dc670900b7c4d990` |
| `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/HC_TECHNICAL_INTEGRITY_REPORT.md` | `6989ce94304bcb140ff951cf9b1b5567e0af705f65c3bd84c97bd09c983ff37e` |
| `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/pass_03/HC_PASS03_REPORT.json` | `50ae8721fafb17fcaf807e63a63c0d8d76e202308acff2f2cca80a8174d0cf19` |
| `_tmp/zenith_blade_hero_e1_ce15/hero_cohesion_correction01/MIKAGE_ZENITH_BLADE_HERO_COHESION_CORRECTION_01_FIRST_PASSING_CANDIDATE.blend` | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` ✅ matches CANON_LOCK_V1 |

### 3.7 Board V1 evidence and lock documents

| Path | SHA-256 |
|---|---|
| `renders/board_v1_evidence/ZENITH_BLADE_CE15_SOURCE.blend` | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` ✅ byte-identical to the `_tmp` original |
| `renders/board_v1_evidence/BASELINE_METHOD.md` | `a01a0973daff6ad4df7f93a42fdb3c4ca36527c8a3f84b30f71c2c2c781f5891` ✅ matches Board V1 manifest |
| `renders/board_v1_evidence/OUT1_HERO_P3_85MM.png` | `e1fd1772bcaa76f0478599fa122604ea0e03ba1ffeabbbac0cfaf3424d1dcde4` ✅ matches Board V1 manifest |
| `renders/board_v1_evidence/OUT1_HERO_P3_85MM_ANNOTATED.png` | `588d8f8aaca507bd082c91c6103305d5ac06a27b6f9cea94cba07d120c08db27` ✅ matches Board V1 manifest |
| `renders/board_v1_evidence/pass_03/HC_authored_P3.png` | `8a9d2522a5788a5728c2125881f973c6e3beb0479a1cfe652a77f95011a024d4` ✅ matches Board V1 manifest |
| `renders/board_v1_evidence/pass_03/HC_front_P3.png` | `2490282bce746efd0cf96a0051a6a4c54bc5883de443f5e8bbcc172f0023da4c` ✅ matches Board V1 manifest |
| `renders/board_v1_evidence/pass_03/SIL_ce15_128.png` | `cca61575e31bab2edda9051525a9b0d56c522e9fe75ec5d319804b956f127807` ✅ matches Board V1 manifest |
| `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.png` | `62deec95df990893324ef376719c026ad14a8ce86b64fd213c58e439be9dd8d5` ✅ matches CANON_LOCK_V1 |
| `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1.md` | `30471b4e61a70513e2cc64eb0149ddd7770c61b4236193d27159f77f8e273179` ✅ matches CANON_LOCK_V1 |
| `ZENITH_BLADE_FINAL_DESIGN_BOARD_V1_SOURCE_MANIFEST.md` | `a1f1cb10017fb7b414fde7fb5cb69b27d39fe54e457f076b89142b7d27bc3242` |
| `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_DECISIONS.md` | `19b2bcbc166e4de68b2392dc9387d973476c2401cbc0b5422f4028e0c6c41217` |
| `ZENITH_BLADE_FINAL_DESIGN_OPERATOR_RULING.md` | `033858de1214e1427c3c3b9ee5548c765d275d382c1230c9b465033752affadd` |
| `ZENITH_BLADE_CANON_LOCK_V1.md` | `a2f340678aa27725c3f09b6fd42c4ebc3017946425ffcdd4832575bf2541427c` ✅ matches Board V1 source manifest |
| `ZENITH_BLADE_CANON_LOCK_V1_ERRATA_01.md` | `ad30196a92cd7003e1381b3a5325a27a495b30784aa67a072bd70452b96448a2` ✅ matches Board V1 source manifest |
| `ZENITH_BLADE_CANON_AMENDMENT_CORE_COLOUR.md` | `c5a91e285c0f510e24acad31136abd03c6ab3cdf9aa92c24f61d1d54f426d3b4` |
| `ZENITH_BLADE_MATERIAL_CANON_V1.md` | `5b4c04f3777fa3685c5d47134b016a957f48bcd56f5e4ed00d874f5d926e2d20` ✅ matches Board V1 source manifest |
| `ZENITH_BLADE_CANON_EVIDENCE_MATRIX.md` | `113c9efeec2c8d5dea88710df21ef1bf37d76a882174330959f080571e66df8f` |
| `ZENITH_BLADE_DESIGN_BIBLE_V1.md` | `4b0a850ea1518b405bd1ab9c9474486a8fbd6eee0567681b4918885263858bef` |
| `ZENITH_BLADE_DESIGN_DNA.md` | `890b6c55ee07c64c1d350cb90e66feed3ccd8871873ad52cc68d58f420596531` |
| `ZENITH_BLADE_FORM_RIG_HANDOFF_CONTRACT.md` | `22861dda206318e356b1539a1851b1f4d431e15558f2b7d0e09ae5db87cd6250` |

---

## 4. Cited evidence — EXTERNAL (`OS`, read-only)

### 4.1 `BLADE_V0.1\` — complete 17-file set, all mtime 2026-06-28

| File | SHA-256 |
|---|---|
| `MIKAGE_ZENITH_BLADE_LOCKED_4x5.png` | `b74216468a3c5b7e2cd4eaadae13d96ce55d4d09ffaa26041dfa1e2b76327c0e` |
| `MIKAGE_BLADE_3D_INSPECT.html` | `5aceca5f51b91ff00f1a8ed49f9f5a6b0107f794db42037d5fc27f725d07abaf` |
| `MIKAGE_BLADE_BUILD_2D_to_3D.mp4` | `52343952c26bd1597f50a125e27c9174a392b1b447a49317e335703251d0df8d` |
| `MIKAGE_BLADE_BUILD_THUMBNAIL_16x9.png` | `c0756042df75b3bdb37b12136984cfa8c27d4d2020cad0399fb4efe99d081458` |
| `MIKAGE_BLADE_BUILD_THUMBNAIL_4x5.png` | `c0d0d7d3278db3f9142bcef26b3e7f180e123d21e1c1b3f5407115c375b2bb62` |
| `MIKAGE_BLADE_BUILD_WAKE_65s_4x5.mp4` | `f26697d022b58ea5d4eeba85735e93055615997c410b7cba54e7d9861c5c03c5` |
| `MIKAGE_BLADE_INSPECT_WAKE_4x5.mp4` | `95b13c61e9487ef51894f98a3006ae2e1ee7225f0d208829820bfdd41fda905a` |
| `MIKAGE_BLADE_LOOP_16s_silent_4x5.mp4` | `b60304f923dac3382c89e8484fdccc1ae33ca011df8e12a398fa802f6fd3030c` |
| `MIKAGE_BLADE_LOOP_48s_silent_4x5.mp4` | `35b482498c14ab263fa0e971854e02edd6dc5c628305a1d5672c2d8532f00c13` |
| `MIKAGE_BLADE_TURNTABLE_4x5.mp4` | `40a1f730a03f9abeecec55da4205695444faf344bb948f789b19204135f909e2` |
| `MIKAGE_BLADE_WAKE_LYRIC_EN_65s.mp4` | `9009be06d12115c34430d8c1056d50e2dcb77c016103daf01725432740092b85` |
| `MIKAGE_BLADE_WAKE_LYRIC_JP_65s.mp4` | `6a09e3503bf626c4e517473dbf4121d36af41c13c02c6b69db42c48a7ab9b4ff` |
| `MIKAGE_BLADE_WAKE_fulltrack_4x5.mp4` | `c235170f322ccb8ec5e00a5c4ed0cea9b651f5818025aeba417682095670dc4a` |
| `MIKAGE_WAKE_LYRIC_4x5_EN.mp4` | `6ce3fcbc527be303d61e4a97726e422849d31066de1ac77941d9662256ed77d2` |
| `MIKAGE_WAKE_LYRIC_4x5_JP.mp4` | `fdc31e0bc133388cf4e98d350f208e8f0eec1885f03dd858aea3c2b0e31f899b` |
| `MIKAGE_WAKE_LYRIC_INSPECT_4x5_EN.mp4` | `3fc548e98ea779a1b8868ff801cfd8825a8f199e10ea442832ffa286efcb5445` |
| `MIKAGE_WAKE_LYRIC_INSPECT_4x5_JP.mp4` | `806e468d40b88d7ef26911590c5bdb3f73453d12cf18dfa71b1f3ae1c94a60c1` |

> The 15 video/thumbnail files are inventoried for completeness of the corpus (audit finding P3).
> They were **not** opened, decoded, or analysed.

### 4.2 `CODEX_BRIEFS\` — the four blade files, all dated 2026-07-05

| File | SHA-256 | Note |
|---|---|---|
| `2026-07-05_zenith-blade-slab-remodel.md` | `15641630b9b5f61c8fd47b70a4219e352d912af5cc7bea073185ef373176ae64` | design-side brief; source of the §4 GRIP RING spec |
| `2026-07-05_zenith-blade-slab-remodel_LANEA_BRIEF.md` | `a5d25165e344971c751bfafbec2ef5d31efdd4f358b2007d8f28ca9aa5fde04d` | **byte-identical** to the repo copy `production/character/build_log/LANEA_CODEX_TASK_ZENITH_BLADE_SLAB_REMODEL_V0_1.md` |
| `2026-07-05_zenith-blade-slab-remodel_DISPATCH_PACKAGE.md` | `f110cde16cc486f37e0afa1002d691fa107d7864eb0c19ee3e62fd18a91ae4c1` | |
| `2026-07-05_zenith-blade-slab-reference.svg` | `b011c379408a66404f69ee25047a77f55dee6dc31dcdbbf09313edf4575a1b29` | **byte-identical** to the repo copy `production/character/build_log/ZENITH_BLADE_SLAB_REFERENCE.svg` |

> `CODEX_BRIEFS/` does **not** exist in this repo (audit gap G4). The external directory holds
> exactly 10 files, of which these four concern the Blade.

---

## 5. Integrity verification — pre and post

| Check | Expected | Pre | Post | Result |
|---|---|---|---|---|
| Workstation tripwire v2 | `3a62ac63849609a37ee3282bcb10259061039db76133ee3623d2ed279bcc44c9` | match | match | **UNCHANGED** |
| Tripwire file count | 79 | 79 | 79 | **UNCHANGED** |
| CE15 anchor, `_tmp` original | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | match | match | **UNCHANGED** |
| CE15 anchor, durable copy | `465b212ef49a4b8ad3eacd682757d9fe0512fa5d242c1b09611439b9c76c3129` | match | match | **UNCHANGED** |
| `git diff --name-only \| wc -l` | 0 | 0 | 0 | **UNCHANGED** |
| Existing files modified | 0 | — | 0 | **NONE** |

Tripwire method of record: `renders/board_v1_evidence/BASELINE_METHOD.md`
(`a01a0973daff6ad4df7f93a42fdb3c4ca36527c8a3f84b30f71c2c2c781f5891`).

---

## 6. Method statement

- **Read-only.** No `.blend` was opened. Blender was not launched. No render, no ComfyUI, no FAL,
  no Seedance, no image generation of any kind.
- **Measurements** were taken by reading pixel values from existing PNGs with PIL, and by reading
  JSON/Markdown/HTML/Python source files. No file was written except the four new deliverables.
- **The composite** is a PIL layout of unmodified crops plus text annotation. The only derived
  raster is the V0.1 threshold mask, which is labelled on the image itself as a derived analysis
  artifact and not a render.
- **No file was deleted, moved, renamed, or overwritten.**

---

*End of ZENITH_BLADE_LINEAGE_AUDIT_01_SOURCE_MANIFEST. No canon approval, no asset lock, no PASS,
no production-ready claim. No commit, no push.*
