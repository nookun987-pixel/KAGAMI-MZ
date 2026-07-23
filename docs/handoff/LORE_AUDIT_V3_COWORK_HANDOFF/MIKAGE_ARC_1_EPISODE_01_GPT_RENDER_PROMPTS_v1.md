# MIKAGE ARC 1 — TẬP 1 — BỘ PROMPT GPT RENDER (25 KEYFRAME) v1

> **Trạng thái:** `PROMPT_SET_DRAFT — theo shot list v1.1 RULED.` Soạn cho **GPT render** (GPT
> Images): GPT không có ô negative prompt riêng, nên mọi điều cấm đã được nhúng thẳng vào từng
> prompt dưới dạng "Do not include...". Prompt viết tiếng Anh (model ăn tốt nhất), mô tả văn
> xuôi thay vì tag kiểu MJ.
>
> **Cách dùng:**
> 1. Mỗi hình = dán **KHỐI A (style chung)** + **KHỐI B (nhân vật — chỉ khi hình có Mikage)** +
>    **prompt riêng của hình** thành một tin nhắn.
> 2. Chạy **C1-KF2 TRƯỚC TIÊN** (design lock). Bồ duyệt hình đó xong mới chạy 24 hình còn lại.
> 3. Từ hình thứ hai trở đi có Mikage: **đính kèm hình C1-KF2 đã duyệt làm ảnh tham chiếu** và
>    thêm câu: *"Match the character design, materials and chamber exactly as in the attached
>    reference image."* — đây là cách giữ continuity tốt nhất với GPT.
> 4. Khung: **16:9, master 3840×2160** (đã LOCKED cho toàn tập).

---

## KHỐI A — STYLE CHUNG (dán vào đầu MỌI prompt)

```
Cinematic 16:9 widescreen film still, 4K quality, hard sci-fi industrial style, monumental
restrained composition. Color palette strictly limited to void black, deep neutral grays,
and ivory porcelain #F2EEEA (matte mineral ceramic — never pure white #FAFAFA, never glossy
plastic). Lighting is minimal, cold and neutral only. Do not include: warm light, yellow,
orange, red, crimson, gold, purple or violet light (unless this prompt explicitly says
otherwise), any text, letters, numbers, logos, signage or watermarks, any human face, eyes,
mouth, skin or hair, anime style, neon cyberpunk clutter, gaming HUD, fantasy armor.
```

## KHỐI B — NHÂN VẬT (dán thêm khi hình có Mikage)

```
The figure: a life-size sealed ceramic android statue in flawless ivory porcelain #F2EEEA,
matte mineral surface, zero cracks anywhere. Faceless sealed helmet with flat kitsune-mask
planar geometry and exactly two thin horizontal sensor slits — completely dark and unlit
(unless this prompt explicitly says they glow). It stands rigidly on a low pedestal, head
slightly bowed, shoulders closed, joints locked in a placed pose, like an artifact rather
than a person. A large closed rectangular slab weapon is mounted flat against its back —
matte dark, non-emissive, never glowing, visible only as a partial silhouette behind the
shoulders. Do not include: cracks, kintsugi seams, katana or curved sword shapes, a drawn
or glowing weapon, sitting or lying poses, dynamic action poses.
```

---

## CẢNH 1 — Buồng niêm phong

**C1-KF1** *(A only — tượng còn xa, chưa cần khối B đầy đủ)*
```
Very wide establishing shot of an old sealed vault chamber deep inside white monolithic
infrastructure: clean, symmetric architecture, minimal cold light, long abandoned — fine
dust along edges, dead equipment panels. At the center, small in frame, a dim pale
statue-like figure stands on a low pedestal, details not yet readable. Vast dark negative
space on both sides gives the chamber monumental scale.
```

**C1-KF2 — DESIGN LOCK, CHẠY ĐẦU TIÊN** *(A + B)*
```
Full-body frontal shot of the figure standing centered on its pedestal, occupying about
45–55% of frame height, with generous dark environmental space and symmetric architecture
on both sides so the chamber reads monumental. The figure, helmet and back-mounted slab
weapon all sit inside a vertical-safe central zone, with no tight cropping of the head,
feet, pedestal or weapon silhouette. Old sealed vault chamber as described; cinematic
widescreen composition, symmetrical monumental framing, 4K film still.
```

**C1-KF3** *(A + B)*
```
Close-up of the statue's helmet face: flat kitsune-mask planar geometry in matte ivory
porcelain #F2EEEA, the two thin horizontal sensor slits completely dark and unlit, head
angle slightly bowed exactly as in the reference image. Background falls into soft dark
chamber bokeh. Absolute stillness; ceramic material detail is the subject.
```

**C1-KF4** *(A + B)*
```
Wide shot of the chamber as a thin neutral scanning light-band sweeps horizontally across
the room, briefly grazing the motionless statue. In a corner of frame, a faint ghostly
system overlay made of abstract unreadable glyph-shapes (no real letters or numbers) marks
the statue as an unidentified object. The weapon silhouette remains visible in the
statue's shadow. The sweep passes; the room stays inert.
```

## CẢNH 2 — Nhịp sống trong tượng

**C2-KF1** *(A only)*
```
Extreme macro of the inside face of a porcelain shell: near-total darkness, the mineral
texture of the ceramic glaze barely visible, outside light reduced to a single muffled
smear bleeding through. No body, no face, no anatomy, no interior of a person — only
material and darkness.
```

**C2-KF2** *(A only)*
```
Almost pure darkness with a single tiny point of light pulsing at a slow steady interval —
an abstract visualization of a private counting rhythm. Each pulse faintly reveals the
ceramic texture around it before fading. The pulse is neutral white-gray, not violet. Do
not include: any heart shape, lungs, organs, anatomy, or mechanical interior of a body.
```

**C2-KF3** *(A only)*
```
Double-exposure composition: in the lower dark layer, the tiny steady pulsing point from
inside the shell; in the upper layer, the thin mechanical scanning light-band sweeping the
chamber outside. The two rhythms are visibly out of phase — one private and owned, one
institutional and blind. Neutral tones only.
```

## CẢNH 3 — Tín hiệu chạy qua thành phố

**C3-KF1** *(A only)*
```
High wide shot of a vast city power-and-data grid at night in heavy rain: entire blocks
blacked out in patches, remaining lights weak and neutral, the grid humming at sleep
level. Gray-black tonality, no neon color, no landmarks, no people, no vehicles readable.
```

**C3-KF2** *(A only)*
```
Close on a weakly glowing architectural surface in the rain: rainwater streams pull thin
dark data-like streaks down the surface — literal "black code in the rain", abstract
dark glyph-streaks with no real letters. Cold reflections, neutral light only.
```

**C3-KF3** *(A only)*
```
A single cold neutral light-trace travels along power lines through a blacked-out district
at night in the rain — a moving signal inside infrastructure, not a creature, not a face,
no anthropomorphic shape. A grid node it just passed flickers once, stutters, then
recovers. The trace moves with clear directional purpose toward somewhere off-frame.
```

**C3-KF4** *(A only)*
```
Abstract system-overlay frame: a dark schematic field where a chain of small anomaly
markers — abstract glyph-dots, no real letters or numbers — lights up one after another,
forming a single consistent line of travel pointing toward an off-frame destination.
Ghostly neutral interface tones on near-black.
```

## CẢNH 4 — Tín hiệu tới buồng

**C4-KF1** *(A only)*
```
Wide shot of an old infrastructure junction at the boundary of the sealed chamber: aged
conduits, power lines and data trunks converging in a dark dead corridor, dust of long
abandonment, cold minimal light. Same architectural language as the vault chamber.
```

**C4-KF2** *(A only)*
```
The cold neutral light-trace seeps through the old conduits toward the chamber — not
breaking anything, not exploding, simply spreading along the infrastructure like current
returning to a dead limb. Faint neutral glow advancing through dark pipes and cable runs.
```

**C4-KF3** *(A + B)*
```
Inside the chamber: dead equipment surfaces wake one after another in sequence — trickle
power returning, dark panels glowing faintly to life, the scanning band running outside
its normal cycle. The statue remains completely motionless in its locked placed pose, head
bowed, slits dark, slab weapon dark on its back. The room shifts from dead to waiting.
```

**C4-KF4** *(A + B)*
```
Extreme close-up: the thin neutral light-trace reaches the statue and touches the ivory
porcelain surface — the contact point glows very faintly, neutral white-gray, nothing
else on the figure reacts. The sensor slits remain completely dark. Quiet, restrained,
pivotal.
```

## CẢNH 5 — Thức tỉnh

**C5-KF1** *(A only)*
```
Inside/around the chamber systems: dark ash-like data particles hanging in the air are
drawn together into flowing streams of abstract dark code — "ash to code" — converging
with direction and intent. Abstract glyph-streams only, no real letters. Neutral cold
tones, no violet.
```

**C5-KF2** *(A only)*
```
The code streams condense into a core of rising energy at frame center — expressed ONLY
through increasing neutral-white brightness, heat-shimmer distortion of the air, thin
vapor, and neutral halation around the core. Strictly no yellow, no orange, no red, no
warm color grading, and no violet. Physics, not color, carries the heat.
```

**C5-KF3** *(A + B)*
```
The statue breaks its absolute stillness from its locked standing pose: the head lifts
first, then the shoulders unlock and open, the hands begin to move, joints releasing one
by one from the sealed placed pose into an active stance. This is an unlocking, not a
rising — it was always standing. Porcelain remains flawless with zero cracks; sensor slits
remain completely dark; the slab weapon stays dark on its back.
```

**C5-KF4** *(A only)*
```
System overlay frame: an abstract boot-sequence display of four stages completing one
after another, reaching the final field — which remains empty: a blank, corrupted,
unreadable box where a designation should be. Abstract glyph-shapes only, no real letters
or numbers anywhere, and the final field visibly void. Ghostly neutral interface on
near-black.
```

**C5-KF5** *(A + B)*
```
Near-still frame: the figure now stands in its completed active posture in the dim
chamber, head level, arms free — but the sensor slits are still completely dark. All
system light-layers have settled low. The frame holds an audible silence: the place where
a name should be is a visible emptiness. Neutral cold tones, no violet yet.
```

**C5-KF6 — HÌNH DUY NHẤT CÓ TÍM** *(A + B — bỏ câu cấm tím trong khối A cho hình này)*
```
Close-up of the helmet face, head now fully level: the two thin horizontal sensor slits
ignite in electric violet #8F00FF — the first and only violet light in the episode,
emitted strictly from the two slits and nowhere else. No violet wash on the environment
beyond their faint glow. The porcelain remains flawless; the posture is perfectly
machine-steady, no tremor. Cold, clean, quietly terrifying composure.
```

## CẢNH 6 — Mất điện & kết tập

**C6-KF1** *(A only)*
```
The blackout instant: every light source in and around the sealing block dies at once —
a near-black frame holding only fading afterimages of the equipment glow. Strictly a
local blackout: no city-wide view, no skyline going dark. Neutral tones.
```

**C6-KF2** *(A only)*
```
In the darkness, the physical cost becomes visible: a permanent scorched heat-ring seared
into the pedestal and floor around it, thin vapor still rising off the glaze, shattered
condensation on the old equipment surfaces nearby. Rendered through residual neutral heat
and vapor — no warm color, no red, no orange, no fire.
```

**C6-KF3** *(A only)*
```
A final faint system-overlay: an anonymous log entry of abstract unreadable glyph-shapes
recording an unclassified local anomaly — then the log dies mid-line as power fails,
glyphs cutting off into black. No real letters or numbers.
```

**C6-KF4 — HÌNH ĐÓNG TẬP** *(A + B — bỏ câu cấm tím trong khối A; khe được sáng)*
```
Wide closing shot of the pitch-dark chamber: the figure stands centered in its active
posture, and the only light in the entire frame is the electric violet #8F00FF glow of
its two thin sensor slits. The dark silhouette of the slab weapon is still present behind
its shoulders in the shadow. Far beyond the architecture, rain continues. Mirror
composition of the opening shot — but inverted: then a lit room held a dark statue, now a
dark room holds the only light. Hold on this.
```

---

## RESULT

```
FILE: MIKAGE_ARC_1_EPISODE_01_GPT_RENDER_PROMPTS_v1.md
PROMPTS: 25/25 — đủ theo shot list v1.1 RULED, thứ tự C1→C6
FORMAT: GPT render — khối A (style) + khối B (nhân vật) + prompt riêng; điều cấm nhúng thẳng vào prompt (GPT không có negative field)
VIOLET_DISCIPLINE: chỉ C5-KF6 và C6-KF4 được tím #8F00FF, và chỉ từ 2 khe
ASPECT: 16:9 · 3840×2160 (LOCKED)
THỨ_TỰ: C1-KF2 trước (design lock) → duyệt → 24 hình còn lại, hình có Mikage đính kèm C1-KF2 làm reference
```
