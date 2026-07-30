# LANE A — CODEX TASK: ZENITH_BLADE_FORM_A1_DIRECTIONAL_SILHOUETTE

**Soạn 2026-07-30 · vá lần 1 sau review của BOOS · Lane B (Cowork).**
Chuẩn áp dụng: `production/character/build_log/MZ_BLADE_HERO_LOOK_GATE_V2.md` (**V2.2**).

```text
FORM_A1_TASK_DIRECTION: APPROVED IN PRINCIPLE
FORM_A1_DISPATCH:       BLOCKED — 1 blocker con lai
SCOPE_PATCH:            DONE (2026-07-30)
REVIEW_OUTPUT_PATCH:    DONE (2026-07-30)
SCALE_LOCK:             DONE (2026-07-30) — relative: blade = 0.684 x actor height (+/-2%)
V0.89_TECHNICAL_GATES:  PASS (verified by Lane B against report.json)
REMAINING_BLOCKER:      operator PASS ruling on V0.89
```

**Vá lần 1 sửa 5 lỗi do BOOS bắt:** (1) phiếu tự dời việc chốt scale sang sau — nay scale chặn ngay task này theo V2.2; (2) phiếu tự làm nhẹ định nghĩa cửa 2 — nay trả về nguyên văn chuẩn; (3) thiếu ảnh so sánh theo camera hero khoá — nay bắt buộc; (4) thiếu danh sách object được sửa — nay có; (5) marker dịch = 0 không bảo vệ được hình học quanh marker — nay đóng băng cả vùng.

---

## 0. ĐẶT TÊN — ĐỌC TRƯỚC

Repo đang có **ba dãy số cùng tên "Zenith Blade"**, đã gây nhầm ít nhất một lần:

| Dãy | Nội dung | Trạng thái |
|---|---|---|
| `3PHASE_REBUILD_V0_1 … V0_9` | màu lõi + cơ chế 3 pha | đóng |
| `FINALIZATION_V0_17 → CANON_BUILD_V0_18 → DEVELOPMENT_FILM_V0_19` | phim/dựng | xong 23/07 |
| `V0_80 … V0_89` | cơ khí: cầm nắm, va chạm, giao diện tay | **đang chạy, next = V0.89** |

Task này **KHÔNG** nối vào dãy nào ở trên. Nó mở dãy mới, đặt tên bằng **chữ + số** để không bao giờ lẫn với `V0.x`:

> **`FORM_A1`** — A = chặng hình (form), 1 = vòng 1.
> Các vòng sau: `FORM_A2`, `FORM_A3`. Chặng bevel sau này là `EDGE_B1…`, vật liệu `MAT_C1…`, ánh sáng `LIGHT_D1…`.

---

## 1. CHẠY KHI NÀO

**Sau khi `V0.89` (sửa mitten) đậu.** Không chạy song song — V0.89 đụng vào khối tay, task này đụng vào khối dao; chạy chồng nhau sẽ không biết vết va chạm mới đến từ đâu.

- **Base file:** blend đầu ra của V0.89, **và phải là bản đã được BOOS chấm PASS**.
- Nếu V0.89 chưa chạy hoặc chưa PASS: **DỪNG, không tự chọn base khác.** Không lấy V0.87, V0.88 hay bất kỳ derivative nào khác để "chạy tạm".

```text
FORM_A1_BASE_READY: có file — MIKAGE_ZENITH_BLADE_MITTEN_INTERFACE_CORRECTION_V0_89.blend
V0.89_TECH_GATES:   PASS (0 phase records · 0 overlaps · 0 novel pairs ·
                    marker delta 0.000000024 m · chỉ mesh mitten bị sửa)
V0.89_OPERATOR_PASS: CHƯA — chờ BOOS
DISPATCH_ALLOWED:   NO cho tới khi có dòng trên
```

---

## 2. VẤN ĐỀ CẦN GIẢI

Bản hiện tại đọc ra **một khối chữ nhật bo tròn**, đối xứng cả hai trục. Hệ quả đo được:

- Không phân biệt được đầu và chuôi — không có hướng tấn công.
- Đầu và đuôi nặng ngang nhau, không có phân bậc khối chính/phụ.
- Không có điểm mốc nào trên đường bao để mắt bám.
- Các mặt song song nhau làm dải phản sáng chạy thành một vệt phẳng.
- Người xem phải nhờ vạch tím mới hiểu đó là vũ khí — tức **hình đang được đường sáng cứu, thay vì đường sáng tôn hình lên**.

Texture, vật liệu và ánh sáng **không sửa được** những điểm trên. Phải sửa ở khối.

---

## 3. PHẠM VI — CHỈ ĐƯỢC LÀM NHỮNG VIỆC NÀY

1. **Tạo hướng.** Cho khối thon dần hoặc chuyển tiết diện rõ rệt để phân biệt được đầu tấn công và chuôi.
2. **Phân bậc khối.** Chia rõ khối chính (primary) — khối phụ (secondary) — chi tiết (tertiary). **Cấm để các phần có kích thước đều nhau** (mất phân bậc).
3. **1–2 điểm nhô trên đường bao.** Đúng một hoặc hai, đặt có chủ ý (chỗ chuôi giao thân, hoặc chỗ hốc năng lượng). **Không rắc đều khắp nơi** — thành nhiễu.
4. **Đổi hướng mặt phẳng + cắt lõm.** Mảng phẳng lớn phải có chỗ đổi hướng hoặc lõm xuống, nhưng **không phủ chi tiết vụn toàn bộ**.
5. **Khe ghép và logic lắp ráp.** Cho thấy vật này được ráp từ các phần, không phải đùn ra từ một khối.
6. **Phân bố chi tiết bất đối xứng** theo một hoặc hai trục (kiểu zig-zag), chừa **vùng nghỉ** xen kẽ vùng chi tiết.

---

## 3b. PHẠM VI OBJECT — KHOÁ CỨNG

```text
ALLOWED:
- Chỉ các mesh tạo primary/secondary form của THÂN blade.
- Danh sách object cụ thể phải được đọc ra từ base V0.89 và ghi
  nguyên văn vào REPORT.json trước khi sửa bất cứ gì.

FROZEN:
- Grip.
- Docking interface.
- Auxiliary grip architecture.
- Registration geometry.
- Mitten và toàn bộ character mesh.
- Rig, armature, driver và P1/P2/P3 control.
- Signal-slot endpoint và signal carrier — trừ khi được liệt kê rõ trong ALLOWED.

Không chắc một object thuộc nhóm nào:
STOP_AND_REPORT — không sửa.
```

```text
FROZEN_INTERFACE_ZONE:
Toàn bộ hình học từ điểm registration về phía chuôi — gồm bề mặt tiếp xúc
tay, docking và grip phụ — phải giữ nguyên vertex position, kích thước và
transform.

KHÔNG chỉ kiểm marker. Marker dịch = 0 KHÔNG chứng minh hình học quanh nó
không đổi: vẫn có thể làm dày thân quanh tay, khoét lõm vào docking zone,
thêm điểm nhô đâm vào mitten, hoặc đổi tiết diện mà marker vẫn đứng yên.
Phải kiểm bằng so sánh vertex của cả vùng đóng băng.
```

```text
SIGNAL_SLOT_LOCK:
- Khe phải tiếp tục chạy liên tục từ điểm đầu đến điểm cuối HIỆN TẠI.
- Hai endpoint KHÔNG được dịch.
- Không xoá, không làm đứt, không che khuất.
- ĐƯỢC chỉnh đường bao vỏ xung quanh khe cho hợp với đoạn thon.
- KHÔNG sửa material, emission hay signal driver.
- Độ sâu hốc: giữ nguyên trừ khi ALLOWED ghi rõ.
```

---

## 4. CẤM TUYỆT ĐỐI

- ❌ Đụng **vật liệu, màu, emission, cường độ phát sáng** — đó là chặng MAT_C và chặng tín hiệu, không phải task này.
- ❌ Đụng **ánh sáng, camera, pose**.
- ❌ Đụng **xương rig, cơ chế P1/P2/P3, driver hiển thị**.
- ❌ Đụng **khối tay (mitten)** hoặc kiến trúc gắn kết — vừa sửa xong ở V0.89.
- ❌ **Bevel/chamfer pass** — để chặng `EDGE_B1`. Task này chỉ lo khối lớn.
- ❌ **Retopo, UV, bake** — đã khoá vĩnh viễn theo quyết định render-only ngày 30/07.
- ❌ Texture, dirt, wear.

### 📏 Tỉ lệ đã khoá (30/07)
- **Dao = 68,4% chiều cao actor.** Được thon, được đổi tiết diện, được thêm điểm nhô — **nhưng chiều dài tổng phải giữ trong 0,670–0,698 lần chiều cao actor.**
- **KHÔNG dùng bàn tay làm mốc tỉ lệ.** Hai số đo tay trong report V0.89 đã bị loại (xem chuẩn V2.3, mục 0).
- **KHÔNG đổi scene scale, KHÔNG scale object.** Chuẩn hoá mét thật là task riêng, chặng EDGE_B1.

### 🔒 Canon phải giữ
- **Dao là khối thẳng (slab), KHÔNG phải katana.** Được thon, được có mũi — **không được cong lưỡi**.
- Vị trí cán và điểm đăng ký (registration) giữ nguyên.
- Kiến trúc docking + grip phụ giữ nguyên.
- Khe chứa đường tín hiệu vẫn phải tồn tại và chạy suốt chiều dài.

---

## 5. GIAO NỘP

```
production/character/production_actor/rig_derivatives/
    MIKAGE_ZENITH_BLADE_FORM_A1.blend
production/character/reviews/
    MIKAGE_ZENITH_BLADE_FORM_A1_CONTACT_SHEET.png
    MIKAGE_ZENITH_BLADE_FORM_A1_SILHOUETTE_TEST.png
    MIKAGE_ZENITH_BLADE_FORM_A1_HERO_COMPARE.png
    MIKAGE_ZENITH_BLADE_FORM_A1_REPORT.json
    MIKAGE_ZENITH_BLADE_FORM_A1_PROOF.md
```

**HERO_COMPARE** — bắt buộc, 3 cột `PREVIOUS | FORM_A1 | REFERENCE`, **cùng một camera hero đã khoá** ở mục 5 chuẩn V2.2 (3/4 hơi thấp · 85 mm · dao chiếm 75–85% chiều dài khung · trục chéo nhẹ · nền tối không đen tuyệt đối). **Cấm đổi camera giữa các vòng** — đổi góc làm bản mới trông đẹp giả.

**CONTACT_SHEET** — 6 ô: 3/4 hơi thấp · chính diện · cạnh bên · chuôi cận · mũi cận · so sánh cạnh bản trước.
**SILHOUETTE_TEST** — bắt buộc, 3 ô: dao tô **đen đặc** trên nền trắng ở **1024 px**, **256 px**, **128 px** chiều dài.

---

## 6. CỬA KIỂM

Ba cửa hình của chuẩn HERO LOOK V2.2 — chấm bằng mắt, chỉ PASS/FAIL:

| Cửa | PASS khi |
|---|---|
| **1 · Silhouette đen** | ở **128 px**, vẫn phân biệt được đầu / chuôi / hướng tấn công |
| **2 · Đọc trong 1 giây** | nhìn ảnh hero 1 giây, gọi được đủ **ba**: "đây là vũ khí" · "đây là đầu tấn công" · "đây là vùng năng lượng". FORM_A1 không sửa vật liệu/emission — cửa này chỉ kiểm **vùng năng lượng đã được hình khối và khe thật đỡ hay chưa**, không chấm chất lượng glow |
| **3 · Hình có hướng** | có thon hoặc chuyển khối rõ + **1–2 điểm nhô**; hết đối xứng hai trục |

Kiểm giữ nguyên (máy đo, ghi vào REPORT.json):

| Kiểm | Ngưỡng |
|---|---|
| Marker cán + điểm đăng ký dịch chuyển | **≤ 0.00001 m** |
| **Vertex trong FROZEN_INTERFACE_ZONE dịch chuyển** | **≤ 0.00001 m — kiểm từng vertex, không chỉ marker** |
| Khối tay ↔ dao chồng nhau | **= 0** ở cả P1/P2/P3 (không được tái phát sinh sau V0.89) |
| Cơ chế P1/P2/P3 | vẫn đổi trạng thái đúng |
| Khe tín hiệu | còn nguyên, chạy suốt chiều dài |
| Lưỡi cong | **KHÔNG** — kiểm bằng độ lệch trục sống dao |
| **Tỉ lệ dao / chiều cao actor** | **0,684 ± 2% (0,670–0,698)** — đo lại sau khi sửa hình, cùng phương pháp với V0.89 (actor = union Z của mesh actor có render, loại hết `ZB*` và proxy ẩn) |

---

## 7. LUẬT DỪNG

- Chạy xong → **xuất bằng chứng → DỪNG**. Không tự tuyên bố đậu, không canon-lock, không asset-lock, không gọi là production-ready.
- Không push, không deploy.
- Cửa 1–3 **chỉ BOOS chấm**, bằng mắt, trên SILHOUETTE_TEST và CONTACT_SHEET.
- **Trần 3 vòng** (`FORM_A1` → `A2` → `A3`). Quá 3 vòng mà chưa đậu thì **dừng hẳn và báo cáo**, không tự chạy vòng 4 — bài học từ 8 vòng chỉnh màu khi công tắc pha đã hỏng từ đầu.
- Nếu phát hiện vấn đề nằm ngoài phạm vi (rig, cơ chế, tay), **báo blocker và DỪNG**, không tự mở rộng phạm vi.

---

## 8. NẾU FAIL — ĐI ĐÂU

| Tình huống | Xử lý |
|---|---|
| V0.89 chưa PASS | `FORM_A1_STATUS: BLOCKED` → quay lại V0.89. **Không chọn base khác.** |
| Không giữ được va chạm = 0 | `FORM_A1_INTEGRATION: FAIL` → revert candidate, xuất blocker report, dừng vòng. **Không sửa tay hoặc docking để cứu hình.** |
| Silhouette đẹp nhưng phải đổi interface | `DESIGN_CONFLICT_WITH_CANON: TRUE` → dừng, trình BOOS quyết. **Không tự ưu tiên thẩm mỹ hơn canon.** |
| Ba vòng vẫn fail cửa 1–3 | `FORM_A_SERIES: EXHAUSTED`, `FORM_A4: FORBIDDEN` → xét lại: brief hình sai? canon slab quá chật? grip/docking khoá sai tỉ lệ? reference chưa đủ rõ? |

---

## 9. CHECKLIST TRƯỚC KHI DISPATCH

- [ ] BOOS duyệt chuẩn `MZ_BLADE_HERO_LOOK_GATE_V2.md` (V2.2)
- [ ] `V0.89` chạy xong và **được BOOS chấm PASS**
- [ ] Xác nhận đúng file derivative đầu ra của V0.89
- [ ] Đồng bộ `docs/handoff/00_LATEST_CODEX_HANDOFF.md`
- [ ] Đồng bộ `.mikage/tasks/active_task.yaml`
- [ ] **Chốt chiều dài thật của dao + scene scale** (quyết định #4 — chặn task này)
- [ ] Khoá danh sách object được phép sửa (đọc từ base, ghi vào REPORT)
- [ ] Khoá vùng interface quanh grip/docking
- [ ] Chốt **reference silhouette** dùng để so sánh ở cột thứ 3 của HERO_COMPARE
