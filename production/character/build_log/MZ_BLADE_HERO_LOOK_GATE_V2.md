# ZENITH BLADE — CHUẨN "HERO LOOK" V2.2

**2026-07-30 · V2.2 · thay thế V1 · ĐỀ XUẤT, chưa duyệt, chưa canon-lock.**

> ✅ **BOOS CHỐT 30/07: Zenith Blade dùng cho MV / phim trước ⇒ FILM / RENDER-ONLY.**
> **Chặng 5 (low-poly/retopo) và chặng 6 (UV + bake) KHOÁ LẠI — không làm, không mở lại trừ khi có quyết định mới.**
> Hệ quả: giữ subdivision + bevel bằng geometry thật; không retopo, không UV, không bake normal/AO/curvature.
> Cửa số 10 đã viết lại cho phù hợp (bỏ lỗi bake, thay bằng lỗi shading/hình học).
Gộp research Lane B + bản research BOOS đưa 30/07. Thông số Marmoset đã dịch sang Blender.

> **Đây là chuẩn nội bộ (house standard), không phải chuẩn AAA công bố.** Research hai phía đều xác nhận: **không tồn tại checklist prop AAA công khai thống nhất**, không có bảng bevel theo mm, không có "1-second test" chính thức, không có chuẩn trình bày ArtStation bắt buộc. Các ngưỡng số bên dưới là **ngưỡng vận hành của Mikage**, đặt ra để chấm được, không phải trích từ tiêu chuẩn ngành.

---

## 0. SÁU QUYẾT ĐỊNH CHẶN — mỗi quyết định chặn ĐÚNG chặng nó ảnh hưởng

**Sửa ở V2.2:** V2.1 bắt chốt cả sáu trước khi chạy bất kỳ chặng nào. Sai — nó biến renderer và màu viền thành blocker của việc cắt hình, trong khi hai thứ đó không liên quan gì tới silhouette. Nhưng chiều dài thật thì **có** liên quan, và V2.1 lại để lỏng ở phiếu FORM_A1. Từ V2.2, mỗi quyết định gắn đúng chặng nó chặn.

| # | Quyết định | Chặn trước chặng | Trạng thái |
|---|---|---|---|
| 1 | Film hay game | **toàn bộ pipeline** | ✅ CHỐT 30/07 — render-only, chặng 5–6 khoá |
| 4 | **Chiều dài thật (m) + scene scale** | **FORM_A1** | ⛔ CHƯA CHỐT — chặn FORM_A1 |
| 6 | Người ký duyệt cuối | **mọi vòng review** | mặc định BOOS, cần xác nhận |
| 2 | Renderer (Cycles / Eevee) | LIGHT_D1 · lookdev | không chặn FORM_A1 |
| 3 | Hero shot có tay cầm không | LIGHT_D1 · hero shot | không chặn FORM_A1 |
| 5 | Viền bù màu ấm hay lạnh | LIGHT_D1 · hero shot | không chặn FORM_A1 |

**Vì sao chiều dài thật chặn ngay từ chặng hình:** tỉ lệ đầu dao so với bàn tay, vị trí trọng lượng thị giác, độ dài đoạn thon, kích thước khối chính so với khối phụ, khoảng cách từ điểm nhô về chuôi — tất cả đều tính theo chiều dài thật. Chốt scale sau khi duyệt silhouette nghĩa là phải cắt lại silhouette vừa duyệt.

---

## 1. PIPELINE — TỪNG CHẶNG, "DONE" NGHĨA LÀ GÌ

| Chặng | Việc | "Done" khi |
|---|---|---|
| 0 · Brief | Khoá kích thước thật, chức năng, cách cầm, bộ phận chuyển động, target camera, target renderer | Có reference front/side/3-4 + số đo + câu chuyện sử dụng. **Chưa biết vật vận hành thế nào thì chưa được chi tiết hoá.** |
| 1 · Blockout | Khối chính, silhouette, độ dài/dày, grip, điểm cân bằng | Đúng tỉ lệ ở góc hero. ✅ **Blade đã qua** |
| 2 · Mid-poly | Chia **primary–secondary–tertiary**, plane change, cut-in, khe ghép, logic lắp ráp | Thu nhỏ vẫn đọc được thiết kế, **không cần texture cứu hình**. ❌ Blade đang kẹt ở đây |
| 3 · High-poly | Chamfer/bevel, bo chuyển tiếp, recess, seam, hư hại hình học lớn | Shade sạch, **không pinching**, cạnh đủ mềm để bắt highlight |
| 4 · Bevel & support | Phân loại cạnh theo vật liệu | Mọi cạnh chính bắt được **một dải specular liên tục** dưới đèn hero |
| ~~5 · Low-poly~~ | 🔒 **KHOÁ — không làm** (render-only) | — |
| ~~6 · UV + bake~~ | 🔒 **KHOÁ — không làm** (render-only) | — |
| 7 · Vật liệu sạch | base color, metalness, roughness, normal, biến thiên quy mô lớn | Sứ / kim loại / cao su đọc khác nhau **dưới đèn trung tính, chưa có bụi bẩn** |
| 8 · Wear | 4 nhóm ở mục 3 | Mỗi vết có nguyên nhân vật lý; generator đã mask tay |
| 9 · Lookdev | Kiểm vật liệu dưới đèn trung tính **trước**, rồi mới dựng key/fill/rim | Các mảng lớn khác value nhau; nền không nuốt silhouette |
| 10 · Hero shot | Khoá camera/đèn/nền; 1 ảnh chính + 2 cận + 1 turntable | Chấm được bằng 10 cửa mục 4 |

**Luật thứ tự:** fail ở chặng nào thì quay về đúng chặng đó. Sửa texture để cứu silhouette là đốt công — vật liệu nền chiếm 80–90% khối lượng, không phải chi tiết.

---

## 2. BEVEL — VÌ SAO BẮT BUỘC

Cạnh sắc toán học có bán kính 0 ⇒ **không có diện tích hướng về nguồn sáng** ⇒ không sinh nổi một vệt highlight. Có bevel thì normal đổi dần, dải bevel phản xạ ở góc khác hai mặt chính, sinh một dải specular dọc cạnh — và mắt người đọc được **bán kính cạnh → kích thước thật → loại vật liệu**.

Quy tắc có nguồn:

- **Bevel thay đổi theo vật liệu:** kim loại gia công → hẹp; nhựa/sứ đúc khuôn → rộng hơn; cao su → rộng nhất. **Vát đều một cỡ toàn thân = mọi thứ đọc ra một loại nhựa.**
- Bevel không được rộng hơn phần hình học chứa nó (gây faceting).
- Support loop quá thưa → gradient kéo dài trên cạnh; bevel không đều → bề mặt trông "không được sản xuất chính xác".
- Lỗ và bu-lông cần chamfer hoặc mặt trong hơi nghiêng để bắt sáng từ xa.

**Ngưỡng Mikage (nội bộ):** ở ảnh hero 3840×2160, mỗi cạnh ngoài quan trọng phải cho **≥ 2 pixel dải highlight ổn định** trên ít nhất một đoạn chiều dài. Còn là đường đen hoặc biến mất khi thu nhỏ ⇒ chưa đạt.

**Blender:** Bevel modifier (harden normals) hoặc bevel bằng geometry; nếu render-only thì không cần bake nên bevel thật luôn, đừng dùng bevel shader.

---

## 3. WEAR — 4 NHÓM, MỖI NHÓM MỘT LOGIC

| Nhóm | Ở đâu | Dấu vết hợp lý |
|---|---|---|
| 1 · Tiếp xúc | grip, cò, công tắc, chỗ lòng bàn tay và ngón chạm | roughness đổi, bóng hơn, vân tay, dầu da, màu phai |
| 2 · Va đập lồi | góc ngoài, mũi/lưỡi, chỗ hay đặt xuống | tróc lớp phủ, mẻ, lộ vật liệu nền, xước có hướng |
| 3 · Đọng trong khe | khe ghép, hốc bu-lông, chỗ khó lau | bụi, cáu, dầu, tối do AO |
| 4 · Vận hành | bộ phận chuyển động, khe thoát nhiệt, lõi năng lượng | vệt dầu, muội, đổi màu do nhiệt, xước theo chiều chuyển động |

**Ngưỡng Mikage:** đủ **4 nhóm** + **1–3 dấu vết riêng có câu chuyện** (một vết va lớn, một đường vá, một mảng sứ mẻ). **Không được thấy pattern generator lặp trên hai mảng lớn.**

Nguyên tắc: *tinh tế là mấu chốt — quá tay là rối mắt.* Mòn phải bất đối xứng, mask lại bằng tay.

---

## 4. TÍN HIỆU TÍM — dựng lại theo cấu trúc, không chỉnh thông số

### Vì sao vạch hiện tại đọc ra decal
Rộng đều · sáng đều · mép cứng · kết thúc đột ngột · **không chiếu sáng gì xung quanh**. Nó chỉ chứng minh shader có màu sáng, không chứng minh có năng lượng bên trong.

### Stack tối thiểu (theo cấu trúc ILM lightsaber: lõi nóng → dải màu → quầng)
1. **Khe hình học thật** — không đặt vạch phẳng ngang mặt vỏ.
2. **Lõi** — nhỏ, gần trắng.
3. **Dải màu** — tím bão hoà, rộng hơn lõi.
4. **Quầng tan dần** — rộng, yếu.
5. **Đèn ẩn hắt sáng** — thân/tay/sàn phải ăn màu.
6. **Glare hậu kỳ** — chỉ bổ sung, không gánh toàn bộ cảm giác sáng.

**Ngưỡng Mikage:** lõi nóng chiếm **20–35%** bề rộng vùng sáng · bề rộng/cường độ biến thiên **10–25%** dọc chiều dài · **hai đầu phải thon hoặc bị che**, không cắt vuông · ảnh cuối phải nhận ra **3 dải**: lõi → màu bão hoà → tan tối.

### Đèn ẩn (bắt buộc)
Vật liệu phát sáng lo **hình dạng nhìn thấy**; **đèn thật giấu bên trong** lo **hắt sáng**. Không hệ nào một mình làm được cả hai.
Blender: Object Properties → Visibility → **tắt Camera ray** để giấu đèn; **light linking** để đèn chỉ chiếu lên tay/thân/sàn.
**Không tăng emission để có spill** — bề mặt nhỏ + cực sáng = firefly. Muốn sáng hơn thì **nới rộng khối phát sáng**. Hạ **Clamp Indirect** từ 10 xuống dần nếu nổ đốm.

### ⚠ AgX nhiều khả năng đang ăn màu tím
Blender ghi rõ: AgX **khử bão hoà các màu phơi sáng cao**. Cường độ đủ "nóng" ở scene-linear rất có thể chính là cường độ biến `#8F00FF` thành trắng ở ảnh cuối — khớp với việc đo hue thì đúng mà nhìn vẫn ra vạch hồng phẳng.

**Cách kiểm, làm đúng thứ tự:**
1. View Transform = **False Color** → lõi phải rơi vào **dải đỏ (~+4.3 EV)**, KHÔNG phải dải trắng (>16.3 scene-linear). Đã trắng thì hết màu để cứu.
2. Xem `Render Result` với **đúng view transform sẽ dùng khi xuất**.
3. Xuất PNG/sRGB thật rồi mới chấm màu.
4. **Không bao giờ duyệt màu bằng swatch trong shader hoặc viewport** — đó là scene-linear, nó nói dối về kết quả.

Glare: **Threshold** chọn pixel nào tạo quầng; **Mix** −1 = chỉ ảnh gốc, 0 = chia đều, +1 = chỉ hiệu ứng. Khoá exposure và màu lõi **trước**, rồi mới chỉnh threshold — đừng tăng emission toàn cục chỉ để có bloom.

### Nền phải tối thì tím mới nổi
Tương phản sáng–tối là tương phản mạnh nhất, và **diện tích lớn át diện tích nhỏ** — vạch tím nhỏ trên thân trắng lớn thì thua. Mẹo ILM: **làm tối vùng nền nằm trong bán kính quầng TRƯỚC khi cộng quầng vào**, để giữ độ bão hoà.

---

## 5. ẢNH HERO — SPEC KHOÁ CỐ ĐỊNH

Đổi spec giữa các vòng là mất khả năng so sánh.

| Thành phần | Khoá |
|---|---|
| Xuất | 3840×2160, PNG, 16:9 |
| Camera | 3/4, hơi thấp — **không bao giờ chính diện hoặc side phẳng** |
| Ống kính | **85 mm** (Blender focal length; ≈ FOV 24°). Muốn nén phối cảnh gần trực giao thì 100–120 mm |
| Khung | dao chiếm **75–85%** chiều dài khung, không chạm mép |
| Dáng | trục dao chạy chéo nhẹ, đầu tấn công hướng vào vùng trống |
| Nền | tối trung tính, **không đen tuyệt đối** (đen tuyệt đối làm silhouette dính nền) |
| Đèn | **Rim trước** (tách nền) → **Key** (tạo khối, lệch trục camera) → **Fill** yếu → Overhead nếu thân tròn |
| Phân bậc sáng | **70 / 20 / 10** — một điểm sáng lớn, một vừa, một nhỏ |
| Giao nộp | 1 ảnh hero + 2 cận + 1 turntable |

---

## 6. MƯỜI CỬA — CHỈ PASS HOẶC FAIL, KHÔNG CÓ "GẦN ĐẠT"

| # | Cửa | PASS khi | Chứng minh |
|---|---|---|---|
| 1 | **Silhouette đen** | tô đen đặc, thu còn **128 px** chiều dài — vẫn phân biệt đầu/đuôi, grip, hướng tấn công | thiết kế không dựa vào texture |
| 2 | **Đọc trong 1 giây** | hiện ảnh hero 1 giây, người xem gọi được đủ **ba** thứ: "đây là vũ khí" · "đây là đầu tấn công" · "đây là vùng năng lượng" | phân bậc đủ rõ, và vùng năng lượng đã được **hình khối** đỡ chứ không phải chỉ là vạch trang trí |
| 3 | **Hình có hướng** | có thon hoặc chuyển khối rõ + **1–2 điểm nhô** trên silhouette; hết hình chữ nhật bo tròn đối xứng | có hướng, có landmark |
| 4 | **Cạnh bắt sáng** | ở 4K, mọi cạnh ngoài quan trọng có dải specular **≥ 2 px** trên một phần chiều dài; hết cạnh đen tuyền | bevel + scale đã đọc |
| 5 | **Tách vật liệu** | **khử màu về 0** — sứ/kim loại/grip vẫn phân biệt bằng value + specular + roughness | vật liệu không dựa vào hue |
| 6 | **Wear có lý** | thấy bằng chứng đủ **4 nhóm**; không có pattern generator phủ đều | vật có lịch sử |
| 7 | **Sáng khi TẮT bloom** | tắt glare: vẫn còn lõi/dải/tan dần **và** thân ăn màu tím; có tay/sàn thì phải nhận màu | sáng từ trong, không phải sticker |
| 8 | **Sáng khi BẬT bloom** | tím vẫn nhận ra là tím; vùng trắng cháy không nuốt quá phần lõi nhỏ; hai đầu thon/bị che | hậu kỳ không phá màu |
| 9 | **Phân bậc điểm nhìn** | một điểm sáng chính áp đảo, phụ yếu hơn, rim nhỏ nhất — không có ba vùng tranh nhau | mắt bị dẫn đúng chỗ |
| 10 | **Sạch kỹ thuật** *(bản render-only)* | hero + 2 cận: không faceting, không pinching ở subdiv, không shading gãy, không n-gon xoắn, không mặt lật ngược, không hình học đâm xuyên hay z-fighting, không mặt trùng nhau | đủ sạch để gọi final |

**Đậu 10/10 mới gọi là ứng viên hero.**

---

## 7. FAIL THÌ QUAY VỀ ĐÂU

| Fail cửa | Quay về |
|---|---|
| 1, 2, 3 | Blockout / mid-poly — **cấm sửa texture** |
| 4 | Bevel / support loop / scene scale |
| 5 | Vật liệu PBR nền + roughness |
| 6 | Reference + wear pass mask tay |
| 7 | Khe hình học, đèn ẩn, cấu trúc 3 lớp |
| 8 | Exposure, emission strength, view transform, glare threshold |
| 9 | Camera + key/fill/rim |
| 10 | Sửa topology/subdiv/normal ngay trên high-poly — **không** retopo, **không** bake |
| Đậu hết mà ảnh vẫn yếu | Bố cục ảnh hero, nền, khung hình |
| Sửa mãi không dứt | Khoá lại brief + tiêu chí nghiệm thu + người ký duyệt |

---

## 8. LUẬT DUYỆT

- Mọi vòng review dùng **đúng** camera/đèn/xuất ở mục 5.
- Luôn đặt **bản hiện tại + bản trước + reference** trong CÙNG một ảnh, CÙNG camera hero đã khoá ở mục 5. Mắt không nhớ được, và đổi camera giữa hai vòng là tự lừa mình — hình trông khá hơn chỉ vì góc nhìn.
- **Chỉ sửa cửa đang FAIL.**
- Feedback về hình hoặc ánh sáng **phải kèm paint-over** — vẽ đè lên ảnh, không phê bằng câu chữ mơ hồ.
- **Trần 3 vòng mỗi chặng.** Quá 3 vòng thì dừng, xét xem có đang sửa sai tầng không — đúng như 8 vòng chỉnh màu khi công tắc phase đã hỏng từ đầu.
- **Một người ký duyệt: BOOS.** Máy không được tự tuyên bố đậu.
- Đậu 10/10 rồi thì **không mở lại** vì "có thể đẹp hơn tí nữa", trừ khi brief đổi.

---

## 9. VIỆC KẾ TIẾP, ĐÚNG THỨ TỰ

1. ✅ Câu #1 đã chốt (render-only, chặng 5–6 khoá). Còn **5 quyết định** ở mục 0 chờ BOOS.
2. **V0.89** sửa mitten (phiếu đã có trong AGENTS.md, chưa chạy). Không đụng dao.
3. Đồng bộ `00_LATEST_CODEX_HANDOFF.md` + `.mikage/tasks/active_task.yaml` về V0.89.
4. **Chặng 2 — mid-poly: cắt lại dáng cho có hướng.** Phiếu: `LANEA_CODEX_TASK_ZENITH_BLADE_FORM_A1_DIRECTIONAL_SILHOUETTE.md` — **DISPATCH: BLOCKED**, chờ V0.89 PASS + chốt scale. Đây là chặng đổi nhiều nhất về "dừng lại ngắm".
5. Chặng 3 → 4 → 7 → 8 → 9 → 10, chấm bằng 10 cửa. (5 và 6 đã khoá.)

---

## 10. NGUỒN

Pipeline & bevel: [80.lv building weapons](https://80.lv/articles/building-weapons-and-props-for-games) · [80.lv weapon art tips: high poly/UV](https://80.lv/articles/weapon-art-tips-high-poly-uvs-texturing) · [Marmoset bevel shader](https://marmoset.co/posts/revolutionize-your-3d-workflow-with-toolbags-bevel-shader/) · [Marmoset baking](https://marmoset.co/posts/toolbag-baking-tutorial/) · [Polycount AAA hero prop](https://polycount.com/discussion/237029/breakdown-of-the-aaa-pipeline-for-game-ready-realistic-hero-props)

Silhouette & thiết kế: [80.lv Ishkov](https://80.lv/articles/003qxl-working-on-visual-weapon-design) · [80.lv Sutton](https://80.lv/articles/weapon-art-tips-for-design-texturing-and-presentation) · [80.lv Senechal](https://80.lv/articles/visual-weapon-design-tutorial)

Wear: [80.lv gun production](https://80.lv/articles/gun-production-from-start-to-finish/) · [Adobe Paint Wear](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/mesh-based-generators/mask-generators/paint-wear) · [Adobe Dirt](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/mesh-based-generators/mask-generators/dirt)

Phát sáng: [ILM lightsaber breakdown](https://beforesandafters.com/2019/05/21/the-world-already-loved-lightsabers-but-then-the-phantom-menace-made-them-even-better/) · [Marmoset emissive / under clearcoat](https://docs.marmoset.co/docs/emissive/) · [80.lv crystal material](https://80.lv/articles/breakdown-how-to-create-an-optimized-and-realistic-crystal-material) · [Chaos emissive best practices](https://blog.chaos.com/best-practices-for-emissive-materials-in-sketchup) · [Blender light linking](https://docs.blender.org/manual/en/latest/render/lights/light_linking.html) · [Blender color management / AgX](https://docs.blender.org/manual/en/4.0/render/color_management.html) · [Blender glare](https://docs.blender.org/manual/es/3.4/compositing/types/filter/glare.html) · [Filmic-Blender False Color](https://sobotka.github.io/filmic-blender/) · [Blender Guru fireflies](https://www.blenderguru.com/articles/7-ways-get-rid-fireflies)

Ảnh hero & duyệt: [Marmoset portfolio](https://marmoset.co/posts/building-a-studio-art-portfolio-in-marmoset-toolbag/) · [Marmoset lighting guns](https://marmoset.co/posts/lighting-and-rendering-guns-in-toolbag/) · [Marmoset hard-surface lighting](https://marmoset.co/posts/how-to-light-hard-surface-assets-in-toolbag/) · [GameDeveloper — lead artist methodologies](https://www.gamedeveloper.com/production/common-methodologies-for-lead-artists) · [Stairway — paint-over review](https://blog.stairwaygames.com/post/swag-crew-damas-nawanda-co-art-director)

**UNCONFIRMED:** bevel theo mm tuyệt đối · số vùng wear chuẩn ngành · chuẩn trình bày ArtStation chính thức · ngưỡng 128 px, 2 px, 20–35%, 10–25%, 70/20/10 là **ngưỡng nội bộ Mikage**, không phải tiêu chuẩn công bố.
