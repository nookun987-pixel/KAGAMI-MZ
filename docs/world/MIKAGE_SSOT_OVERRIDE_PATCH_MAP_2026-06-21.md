# SSOT OVERRIDE — PATCH MAP (2026-06-21)

```
AUTHORIZED = BOOS BỚP ("ghi vào đi"), 2026-06-21
OVERRIDE   = (1) Lyre/LYRA-0 tách 2 nhân vật + reveal · (2) Tai Vane(AI) -> Vane(NGƯỜI) + "the Archive"(system)
SSOT NEW   = docs/world/MIKAGE_LORE_WORLD_CANON_V0_6_SSOT.md · docs/world/MIKAGE_CAST_SHEETS_V0_2.md
```

## ĐÃ GHI (Lane B / world-lore — operator-authorized)
| File | Hành động |
|---|---|
| docs/world/MIKAGE_LORE_WORLD_CANON_V0_6_SSOT.md | **CREATED** — SSOT narrative mới (7 entity) |
| docs/world/MIKAGE_CAST_SHEETS_V0_2.md | **CREATED** — đè V0.1 (giữ V0.1 cho history) |
| MIKAGE_ZENITH_CANON_V2.md | **PATCHED** — §8.2/§8.3/§8.5 marker SUPERSEDED + chèn block §8-OVERRIDE (non-destructive; backup .bak_2026-06-21) |

## CẦN SYNC — Lane B narrative/handoff (BOOS duyệt từng cái rồi tôi sửa, hoặc tự sửa nếu OK)
| File | Chỗ phải đổi |
|---|---|
| docs/world/MIKAGE_CAST_SHEETS_V0_1.md | thay bằng V0.2, hoặc dán banner "SUPERSEDED by V0.2" |
| docs/world/MIKAGE_WORLD_BIBLE_V0_2.md | mọi chỗ Tai Vane=Archive AI / Lyre=LYRA-0 1 entity |
| docs/world/MIKAGE_TRANSMISSION_LORE_MAP_V0_1.md | T06 THE THEOREM (Vane) + map Lyre/LYRA-0 |
| docs/handoff/MIKAGE_CHARACTER_SYSTEM_V0_1_OUTLINE.md | §8.5 Tai Vane (4 chỗ) + relationship grid |
| docs/handoff/MIKAGE_IP_CORE_V0_1_OUTLINE.md | companion entities list (§8.1–§8.6) |
| docs/handoff/MIKAGE_IP_WORLD_BACKGROUND_PLAN_V0_1_SAFE_REVISION.md | §8.5 Tai Vane=Archive Tower AI |
| docs/handoff/MIKAGE_LOCATION_SEEDS_V0_1_OUTLINE.md | Tai Vane tower/Archive (2 chỗ) |
| docs/handoff/MIKAGE_VOICE_PROFILE_LOCK_V0_1.md | "Tai Vane HUD HELD/Archive Tower type spec" -> Vane (người) voice |
| docs/handoff/MIKAGE_7_STEP_OUTLINE_PHASE_CLOSEOUT_REPORT_V0_1.md | Tai Vane tower placement note |
| character_workflow/CHARACTER_OPERATOR_DECISION_BOARD_V0_4/V0_5.md | §8.5 "Tai Vane — Archive Tower AI" |
| character_workflow/CHARACTER_CANON_V2_LORA_SUBSTRATE_PATCH_PROPOSAL_V0_1.md | tham chiếu §8.5 Tai Vane |

## ⚠️ LANE A — FLAG ONLY (KHÔNG tự sửa; bàn giao Lane A / rig+render pipeline)
> Lane discipline: render briefs + entity JSON là Lane A. Lane B KHÔNG đụng. Hand sang Lane A để sync sau khi BOOS lock.

| File | Lý do cần sync |
|---|---|
| docs/automation/render_briefs/BRIEF_COMMANDER_LYRE_PHASE_1_IMPERIAL_DUTY_V0_1..V0_3 (.md/.json) | Lyre giờ có lớp "mask/reveal" + dưới quyền Vane (người) |
| docs/automation/render_briefs/BRIEF_LYRA_GLITCH_PHANTOM_PHASE_1_V0_1 (.md/.json) | LYRA-0 = nhân vật riêng (heart of erased Lyre), không phải "chung slot ARCHON" |
| docs/automation/render_briefs/BRIEF_ARCHON_IX_FRACTAL_PLAGUE_PHASE_1_V0_1 (.md/.json) | thêm lớp E-pre (đồng hóa em Aris); giữ ARCHON core |
| character_workflow/proposals/commander_lyre.json · lyra.json | entity JSON: tách Lyre/LYRA-0, thêm mask/reveal field |
| (chưa có) Vane entity JSON / Dr. Aris JSON | Vane=người + Aris(27, clock) — Lane A draft khi cần render |

## CÒN MỞ (chưa lock — chặn 1 phần sync)
1. Ngoại hình/tuổi **Vane** · 2. Chi tiết ngoại hình **Dr. Aris** · 3. **Scene/track** hiện reveal (E7)+E8.

## NEXT
- BOOS: duyệt danh sách "Lane B narrative/handoff" -> tôi sed sync hàng loạt 1 lượt.
- Lane A items: bàn giao sang lane rig/render khi lock 3 ô OPEN.
- Operator: `git add docs/world/ MIKAGE_ZENITH_CANON_V2.md && git commit && git push` (tôi không tự push).
