# ZENITH BLADE — CỬA KIỂM "HERO LOOK" V1 + LỘ TRÌNH VỀ ĐÍCH

**Soạn 2026-07-30 · Lane B (Cowork) · ĐỀ XUẤT — chưa duyệt, chưa canon-lock.**
Mục đích: biến câu "nhìn phải dừng lại ngắm" thành thứ chấm được bằng mắt trong 5 giây, để mỗi vòng render có cái mà so.

---

## 0. VÌ SAO CẦN CỬA NÀY

Toàn bộ cửa kiểm hiện tại của Blade đều đếm số: bao nhiêu tam giác chồng, hue bao nhiêu độ, tỉ lệ sáng bao nhiêu lần. Không cửa nào hỏi "nhìn có muốn dừng lại không". Hệ quả đo được: qua ~90 vòng, con dao không hỏng thêm, cũng không đẹp thêm.

Bản V0.17/V0.19 hiện tại, nhìn bằng mắt:

- Dao đọc ra là **khối chữ nhật bo tròn màu trắng** — đối xứng cả hai trục, không thon, không mũi, không phân biệt được đầu/chuôi.
- Đường tím là **vạch thẳng đều, viền cứng** — nằm *trên* vật thể chứ không phát ra *từ trong*. Không hắt sáng lên thân, lên tay, lên sàn.
- Bề mặt **một sắc độ**, không vát cạnh → không có chỗ ánh sáng gãy → đọc ra nhựa, không ra sứ/kim loại.
- Ánh sáng **tán đều, nền sáng** — không giấu gì nên không có gì để ngắm.

Đây là trạng thái **blockout/mid-poly có vật liệu tạm**, không phải hero asset. Còn 3 chặng nghề nữa mới tới đích.

---

## 1. LỘ TRÌNH — BLADE ĐANG Ở ĐÂU TRONG PIPELINE CHUẨN

Thứ tự chuẩn của prop vũ khí (Polycount AAA hero-prop, Howel Ganuchaud):
`blockout → mid-poly → high-poly (support loop + bevel) → low-poly → UV → bake → texture → lookdev/hero shot`

| Chặng | Trạng thái Blade | Việc cụ thể |
|---|---|---|
| Blockout | ✅ xong | dáng slab đã duyệt |
| Cơ cấu P1/P2/P3 | ✅ chạy | driver hiển thị đã sửa |
| Tương thích tay | ⛔ **V0.89 đang chặn** | mitten đâm xuyên vỏ, 216 chỗ |
| **A · Cạnh & hình** | ❌ chưa làm | thon/hướng + vát cạnh toàn bộ |
| **B · Vật liệu** | ❌ chưa làm | roughness biến thiên, mòn tay, bụi rãnh |
| **C · Tín hiệu tím** | ❌ chưa làm | 3 lớp + đèn ẩn hắt sáng |
| **D · Ánh sáng + ảnh hero** | ❌ chưa làm | rig 3 điểm, nền tối, FOV hẹp |
| Cửa HERO LOOK | — | chấm bằng mục 3 |

**Còn 4 chặng, không phải 1.** Làm đúng thứ tự A→B→C→D; đảo thứ tự là đốt công (kosh3d: *"đừng thêm chi tiết khi vật liệu nền chưa đọc đúng — vật liệu nền chiếm 80–90% công việc"*).

---

## 2. BỐN CHẶNG — LÀM GÌ, VÌ SAO

### A · CẠNH & HÌNH (ưu tiên cao nhất)

**Vát cạnh mọi cạnh cứng.** Cạnh sắc toán học có diện tích bằng 0 hướng về nguồn sáng ⇒ **không sinh highlight nào** ⇒ mắt đọc ngay ra "đồ CG". Marmoset nói thẳng: cạnh vật thật luôn được vát, bevel là cách nhanh nhất để có độ tin cậy. Bake cũng cần: baker chỉ thấy *đổi hướng*, không thấy độ sâu — mặt song song tuyệt đối ghi lại được số không.

- Nguyên tắc kích thước: **làm rộng hơn đời thật**. Không nguồn nào công bố số mm tuyệt đối — cả nghề làm theo tỉ lệ và khoảng nhìn. Sàn cứng duy nhất: chi tiết nhỏ hơn 1 pixel texture thì không bake được.
- **Đừng vát đều nhau toàn thân.** Vát rộng/mềm = cao su, vát vừa = nhựa, vát hẹp gắt = kim loại CNC. Vát đồng loạt một cỡ chính là thứ làm mọi thứ đọc ra một loại nhựa (Alex Senechal).

**Cắt lại dáng cho có hướng.** Hình đối xứng hai trục không có "đằng trước". Kỹ thuật có tên: **Dynamic Balance / Zig-zag** — phân bố chi tiết lệch trục (Vitaliy Ishkov). Thêm **một hoặc hai** điểm phức tạp trên silhouette, không phải rắc đều (Patrick Sutton). Chừa **vùng nghỉ** xen kẽ vùng chi tiết.

### B · VẬT LIỆU

Điểm mấu chốt không phải "thêm bẩn" mà là **roughness phải biến thiên**. Sutton (343 Industries): thứ quan trọng nhất trong PBR là *"nhiều giá trị roughness khác nhau trên cùng một model"*; hai vật liệu trùng roughness thì tách bằng *hoa văn*.

Vùng mòn chuẩn (Ganuchaud): **đổi màu + đổi roughness quanh chỗ tay nắm và chỗ bộ phận chuyển động · dầu/mỡ · hư hại đúng chỗ**. Đặt theo tuổi vật, mức sử dụng, môi trường.

- Ethan Hiley (Treyarch): *"Tinh tế là mấu chốt với edge wear — quá tay là gây rối mắt."*
- Không dùng generator mặc định nguyên bản; mask phải **không đều nhau** giữa các mặt.
- **Noise xám tương phản thấp trên specular** để mắt xác định được kích thước vật thể (Ed Fedorei) — thiếu cái này vật thể mất cảm giác tỉ lệ.

### C · TÍN HIỆU TÍM — dựng lại theo cấu trúc 3 lớp

Đây là phần sai bản chất, không phải sai thông số. Cấu trúc chuẩn của ILM cho lightsaber (Terrence Masson) là **tối thiểu 3 lớp**: **lõi nóng gần trắng → dải màu chính bão hoà → quầng sáng rộng ngoài cùng**, mỗi lớp một độ mờ khác nhau. Vạch đơn viền cứng chính là ca suy biến của cấu trúc này.

1. **Ba khối, không phải một.** Lõi mảnh gần trắng · dải tím rộng hơn · vỏ quầng rất rộng, rất yếu.
2. **Bề rộng và độ sáng phải biến thiên dọc chiều dài.** Lightsaber ILM là hình 8 điểm — 3 điểm ở gốc, 5 điểm ở ngọn — cố ý không đều. Bóp ở hai đầu, phình ở giữa. Chỗ có kết cấu che ngang thì **cắt hẳn và đổ bóng**, không tan đều.
3. **Đèn ẩn làm việc hắt sáng, không phải emission.** Chaos nói rõ: gắn vật liệu phát sáng cho *hình dạng nhìn thấy*, đặt **đèn thật bên trong** cho bóng đổ và độ tắt dần — *"không hệ nào một mình cho cả hai"*. Trong Blender: Object Properties → Visibility → **tắt Camera ray** để giấu đèn; dùng **light linking** cho đèn chỉ chiếu lên tay/thân/sàn.
4. **Đừng tăng emission để có spill.** Bề mặt nhỏ + cực sáng = máy sinh firefly. Chaos: *"bề mặt phát sáng càng lớn thì càng ít noise"*; muốn sáng hơn thì **nới rộng khối phát sáng**, đừng tăng cường độ. Blender Guru: firefly do nguồn nhỏ; hạ **Clamp Indirect** từ **10** xuống dần.
5. **Bloom ≤ ~0.3**, ưu tiên hoà trộn giữ màu thay vì cộng thô. Bloom cộng thô làm pixel sáng càng sáng và **rửa trôi màu** (Froyok).
6. ⚠ **AgX nhiều khả năng đang ăn mất màu tím.** Blender manual: AgX *"khử bão hoà các màu phơi sáng cao"* để mô phỏng phim. Nghĩa là cường độ đủ "nóng" ở scene-linear rất có thể chính là cường độ mà AgX biến `#8F00FF` thành trắng. Cách kiểm: **View Transform = False Color**, lõi phải rơi vào **dải đỏ (~+4.3 EV)**, KHÔNG phải dải trắng (>16.3 linear). Đã trắng thì không còn màu để cứu.
7. **Nền phải tối thì tím mới nổi.** ERCO: tương phản sáng-tối là tương phản mạnh nhất; **diện tích lớn át diện tích nhỏ** — vạch tím nhỏ trên thân trắng lớn thì thua. Knoll (ILM) làm ngược đời mà đúng: **làm tối vùng nền nằm trong bán kính quầng sáng TRƯỚC khi cộng quầng vào**, để giữ độ bão hoà.

> ⚠ **Điểm cần BOOS quyết:** sách vở nói bù màu cho tím là **hổ phách/vàng** (cặp bù: vàng–tím). Nhưng canon Mikage cấm màu ấm. Đây là **đề xuất, không phải thứ canon đang cho phép** — hoặc anh duyệt một viền ấm rất nhỏ, hoặc thay bằng viền trắng sứ lạnh và chấp nhận tím nổi ít hơn.

### D · ÁNH SÁNG & ẢNH HERO

Rig 3 điểm, số liệu từ Marmoset (hard-surface lighting):

| Đèn | Vai trò | Ghi chú |
|---|---|---|
| Key | định hình, tương phản cao | **đặt lệch trục camera** để bắt phản chiếu ở mặt bên; đừng chiếu thẳng từ sau vai — làm bẹt model |
| Rim | tách silhouette khỏi nền | đường kính nhỏ + cường độ cao = viền sắc |
| Fill | nâng vùng đen kịt | yếu hơn key, đường kính lớn hơn |
| Sky | môi trường | rất thấp |

- **70-20-10** (Sutton): một highlight lớn, một vừa, một nhỏ — coi vật thể như khối lập phương, mỗi mặt một giá trị khác nhau.
- **Giữ bóng.** Woodman: *"bóng đổ then chốt phải có mặt để gắn kết bức ảnh, ngang với ánh sáng."*
- Camera: **FOV 20–25** (bán trực giao, giống ống 85mm) · góc **3/4, hơi thấp** · không bao giờ chính diện phẳng.
- Nền: **giá trị rất tối nhưng KHÔNG đen tuyệt đối** — đen tuyệt đối làm silhouette dính vào nền.
- Xuất **4K (3840×2160)**, sampling cao, không aliasing.

---

## 3. CỬA "HERO LOOK" — 8 CÂU HỎI, CHẤM BẰNG MẮT

Điều kiện chụp cố định mỗi vòng (đổi điều kiện là mất so sánh): **3/4 hơi thấp · FOV 20–25 · nền tối không đen tuyệt đối · rig key/rim/fill · 4K.**

| # | Câu hỏi | Cách chấm | Chứng minh điều gì |
|---|---|---|---|
| 1 | Thu nhỏ về cỡ thumbnail — có nhận ra ngay là một cây vũ khí, và nhận ra **một đặc điểm chữ ký** không? | thu nhỏ 1 giây | sống được ở cỡ người ta thật sự nhìn |
| 2 | Tô đen toàn bộ — silhouette có **hướng** không (phân biệt đầu/chuôi)? | tô đen | hình có ý đồ, không phải khối trung tính |
| 3 | Nheo mắt (hoặc blur mạnh) — thứ đập vào mắt **đầu tiên** có đúng là chỗ mình muốn không? | nheo mắt | mắt rơi đúng chỗ |
| 4 | **Khử màu về 0** — ảnh còn đọc được không, vùng trọng tâm còn sáng/tương phản nhất không? | tắt saturation | cấu trúc sáng-tối gánh bức ảnh, không phải màu |
| 5 | Viền: **mọi đoạn silhouette chính** có viền tách khỏi nền không? Có đoạn nào tan vào nền không? | rà mắt theo đường bao | shape nổi |
| 6 | Cạnh: soi cận — **cạnh cứng nào cũng có dải highlight mảnh** chạy dọc không? | cận cảnh | ra sứ/kim loại, không ra nhựa |
| 7 | Tím: có **lõi sáng hơn → tan dần ra rìa**, và có **hắt màu lên thân/tay/sàn** không? Ở False Color, lõi nằm dải đỏ hay đã trắng? | nhìn + False Color | ánh sáng từ trong, không phải decal |
| 8 | Bề mặt: có **ít nhất 3 chỗ** kể chuyện đã dùng (mòn chỗ nắm, bụi rãnh, xước cạnh) mà không rối không? | cận cảnh | vật có lịch sử, không phải đồ chơi |

**Cách dùng:** đậu **8/8** mới được gọi là ứng viên hero. Rớt câu nào thì vòng sau chỉ sửa đúng câu đó. Mỗi vòng đặt cạnh vòng trước — bắt buộc, vì mắt không nhớ được.

**Chống lặp vô tận (Andrew Maximov, Naughty Dog):** *"rất dễ chạm ngưỡng lợi ích giảm dần khi lặp quá lâu."* Đặt trần: **tối đa 3 vòng cho mỗi chặng A/B/C/D**, quá thì dừng lại xem có phải đang sửa sai tầng không — đúng như 8 vòng chỉnh màu vừa rồi khi công tắc phase đã hỏng từ đầu.

**Người duyệt: chỉ BOOS.** Máy không được tự tuyên bố đậu cửa này.

---

## 4. VIỆC KẾ TIẾP, ĐÚNG THỨ TỰ

1. **V0.89** — sửa mitten (đã có phiếu trong AGENTS.md, chưa chạy). Không đụng dao.
2. **Đồng bộ 2 biển chỉ đường**: `docs/handoff/00_LATEST_CODEX_HANDOFF.md` (đang trỏ V0_9, 10/07) và `.mikage/tasks/active_task.yaml` (đang trỏ phim V0.19 đã xong 23/07) → trỏ về V0.89.
3. **Chặng A** — vát cạnh + cắt dáng có hướng. Đây là chặng đổi nhiều nhất về mặt "dừng lại ngắm".
4. **Chặng B** — vật liệu.
5. **Chặng C** — dựng lại tín hiệu tím 3 lớp + đèn ẩn.
6. **Chặng D** — ánh sáng + ảnh hero, rồi chấm 8 câu.

---

## 5. NGUỒN

Pipeline & bevel: [Polycount AAA hero prop](https://polycount.com/discussion/237029/breakdown-of-the-aaa-pipeline-for-game-ready-realistic-hero-props) · [Games Artist / Ganuchaud](https://gamesartist.co.uk/advanced-weapon-creation-prop-breakdown-howel-ganuchaud/) · [Marmoset Bevel Shader](https://marmoset.co/posts/revolutionize-your-3d-workflow-with-toolbags-bevel-shader/) · [Marmoset Baking Tips](https://docs.marmoset.co/docs/tips-tricks/) · [80.lv / Senechal](https://80.lv/articles/visual-weapon-design-tutorial) · [80.lv / Ishkov](https://80.lv/articles/003qxl-working-on-visual-weapon-design) · [80.lv / Sutton](https://80.lv/articles/weapon-art-tips-for-design-texturing-and-presentation)

Vật liệu: [80.lv / Sutton (production)](https://80.lv/articles/001agt-weapon-production-building-texturing-lighting) · [80.lv / Hiley](https://80.lv/articles/production-of-3d-weapons-for-video-games) · [80.lv / Fedorei](https://80.lv/articles/004adk-weapon-production-design-texturing-rendering)

Tín hiệu phát sáng: [ILM lightsaber breakdown](https://beforesandafters.com/2019/05/21/the-world-already-loved-lightsabers-but-then-the-phantom-menace-made-them-even-better/) · [Chaos emissive best practices](https://blog.chaos.com/best-practices-for-emissive-materials-in-sketchup) · [Blender Guru fireflies](https://www.blenderguru.com/articles/7-ways-get-rid-fireflies) · [Blender light linking](https://docs.blender.org/manual/en/latest/render/lights/light_linking.html) · [Blender color management / AgX](https://docs.blender.org/manual/en/4.0/render/color_management.html) · [Filmic-Blender False Color](https://sobotka.github.io/filmic-blender/) · [Froyok custom bloom](https://www.froyok.fr/blog/2021-12-ue4-custom-bloom/) · [ERCO color contrast](https://www.erco.com/en_us/designing-with-light/lighting-knowledge/colorimetry/color-contrast-7513/)

Ảnh hero & cửa duyệt: [Marmoset hard-surface lighting](https://marmoset.co/posts/how-to-light-hard-surface-assets-in-toolbag/) · [Marmoset lighting guns](https://marmoset.co/posts/lighting-and-rendering-guns-in-toolbag/) · [80.lv flare pistol](https://80.lv/articles/the-flare-pistol-texturing-and-lighting-a-3d-weapon) · [NN/g squint test](https://www.nngroup.com/videos/squint-test/) · [Game Developer — art direction roundtable](https://www.gamedeveloper.com/art/art-direction-bootcamp-an-expert-roundtable-q-a)

**UNCONFIRMED, ghi rõ để không tưởng là chuẩn:** không nguồn nào công bố bề rộng bevel theo mm tuyệt đối (cả nghề làm theo tỉ lệ); không có "số vùng mòn chuẩn"; hai bài GDC về art direction bị khoá, chỉ đọc được tóm tắt.
