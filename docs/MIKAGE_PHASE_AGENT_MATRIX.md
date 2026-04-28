# MIKAGE PHASE AGENT MATRIX

## 1. Mục đích

Mikage hiện là hệ thống AI nhiều lane, không còn là vài script lẻ.

File này là bảng luật để quy định:

- Mỗi phase cần mấy agent.
- Agent nào được làm gì.
- User cần cung cấp file nào trước khi làm.
- Agent phải đọc file nào trước.
- File nào được sửa.
- Lệnh nào bị cấm.
- Khi nào phải dừng.
- Khi nào được commit.
- Khi nào được chạy production.

Không agent nào được làm việc nếu chưa có phase contract rõ.

Phase contract nghĩa là bản giao việc có đủ:

- tên task
- thời gian tối đa
- mục tiêu
- agent role
- file được sửa
- file bị cấm sửa
- lệnh được chạy
- lệnh bị cấm
- cách kiểm tra
- output bắt buộc
- điều kiện phải dừng

---

## 2. File agent phải đọc trước khi làm

Trước mọi task, agent phải đọc:

- AGENTS.md
- docs/MIKAGE_AGENT_SKILL.md
- docs/MIKAGE_MASTER_STATUS.md
- docs/MIKAGE_PHASE_AGENT_MATRIX.md

Nếu task có liên quan Git, agent chỉ được chạy lệnh đọc trước:

- git log -6 --oneline
- git diff --name-status
- git diff --cached --name-status
- git status --short --untracked-files=all

Không được tự commit, push, clean, reset, restore nếu user chưa cho phép rõ.

---

## 3. Trạng thái Mikage hiện tại

- GARA: READY_FOR_OPERATOR_APPROVAL
- RENT: PARTIAL_READY_LOCAL_ONLY
- CALL: PARKED_NOT_ACTIVE
- IMAGE: HOLD_UNTIL_RENT_GARA_STABLE
- FANPAGE_WINNING_CONTENT: PLANNED_AFTER_IMAGE
- SHORT_FINANCE_DISCIPLINE: PLANNED_REVENUE_SUPPORT_LANE
- DESKTOP_UI: NEXT_AFTER_GIT_AND_LANE_STABILITY
- GIT: LOCAL_COMMITS_DONE_PUSH_HOLD
- AGENT_SKILL: COMMITTED

CALL lane hiện không cần làm. Không mở CALL nếu user không yêu cầu lại.

---

## 4. Thứ tự ưu tiên hiện tại

1. GIT_GOVERNANCE_AND_PUSH_SAFETY
2. RENT_STABILIZATION
3. GARA_STABILIZATION
4. IMAGE_LANE_REACTIVATION
5. FANPAGE_WINNING_CONTENT_LANE
6. SHORT_FINANCE_DISCIPLINE_LANE
7. DESKTOP_UI_FRAME
8. AGENT_ORCHESTRATOR_MVP_SPEC

Không được nhảy sang phase sau khi phase trước chưa ổn.

---

## 5. Các commit local đang có

Các commit local hiện đã có:

- c66d6e9 lock gara rent ops safety gates
- 81e73b5 fix gara bonbanh showroom ingestion
- 9bb7c67 fix rent export supply demand schema
- 9a37f95 docs: add mikage agent skill v1

Không push cho tới khi:

- git diff --name-status rỗng
- git diff --cached --name-status rỗng
- không stage file runtime/temp
- user duyệt push rõ ràng

---

## 6. Vai trò agent

| Agent | Nhiệm vụ | Được sửa file? | Được chạy lane? | Được commit? |
|---|---|---:|---:|---:|
| GPT Coordinator | Chia phase, viết task, kiểm tra report | Không | Không | Không |
| Audit Agent | Chỉ đọc và báo cáo | Chỉ file report nếu được phép | Không | Không |
| Dev Agent | Sửa đúng file được giao | Có, theo allowlist | Không, trừ dry-run được duyệt | Không, trừ khi user yêu cầu |
| Git Agent | Stage/commit đúng file được duyệt | Không sửa code | Không | Có, nhưng chỉ file allowlist |
| Lane Validator | Kiểm tra output/dry-run | Không | Chỉ dry-run nếu được duyệt | Không |
| Operator Agent | Tóm tắt cho user quyết định | Không | Không | Không |
| UI Agent | Làm giao diện desktop | Chỉ UI files | Không chạy production | Không |
| Sync Agent | Làm GSheet/Telegram sync | Chỉ sync files được giao | Dry-run trước | Không |
| Content Intelligence Agent | Phân tích post/video fanpage | Chỉ lane content | Không spam Telegram | Không |
| Finance Discipline Agent | Làm watchlist/risk/journal | Chỉ docs/sheet output | Không trading | Không |

---

## 7. Bảng phase chính

| Phase | Số agent | Agent chính | Agent phụ | User cần cung cấp | Scope được làm | Cấm làm | Pass khi |
|---|---:|---|---|---|---|---|---|
| GIT_CLEANUP | 1-2 | Git Agent | Audit Agent | git status/log/diff | Git report, selected commit | clean/reset/restore all/push bừa | tracked diff sạch |
| AGENT_SKILL_AND_GOVERNANCE | 1 | Docs Agent | GPT Coordinator | luật cần thêm | docs only | sửa code, chạy lane | docs tạo xong |
| RENT_FIX | 2 | Dev Agent | Lane Validator | Sheet, output, lỗi | RENT files được giao | GARA/IMAGE/START | dry-run pass |
| RENT_VCP_DEMAND_SYNC | 3 | Sync Agent | Audit + Validator | CSV, Sheet link, tab | VCP sync files | Telegram trước khi Sheet pass | Sheet có dòng thật |
| RENT_PRODUCTION_CHECK | 2 | Lane Validator | Operator Agent | approval rõ | dry-run rồi production nếu duyệt | chạy lặp/spam | output đúng, không spam |
| GARA_FIX | 2 | Dev Agent | Validator | Sheet, Telegram proof, source | GARA files được giao | RENT/IMAGE/START | output contract pass |
| GARA_PRODUCTION_CHECK | 2 | Validator | Operator Agent | approval rõ | dry-run rồi production nếu duyệt | chạy lặp/spam | Sheet/Telegram đúng |
| IMAGE_LANE_REACTIVATION | 2 | Validator | UI/Dev Agent | model, prompt, tiêu chí | image lane | RENT/GARA/CALL | dry-run/status pass |
| FANPAGE_WINNING_CONTENT_LANE | 3 | Content Agent | Sync + Validator | fanpage URL, Sheet, time range | fanpage lane | Telegram spam | có post/video thắng |
| SHORT_FINANCE_DISCIPLINE_LANE | 2 | Finance Agent | Audit Agent | market, timeframe, risk | read-only plan/journal | auto trade, xúi liều | có checklist kỷ luật |
| DESKTOP_UI | 2 | UI Agent | Safety Agent | screenshot, nút cần có | UI frame | production command | frame chạy, không side-effect |
| NEW_LANE | 3 | Architect | Dev + Validator | goal, source, output | folder lane mới | sửa lane ổn định | contract + dry-run pass |
| DOCS_ONLY | 1 | Docs Agent | GPT Coordinator | nội dung cần ghi | docs only | code/lane/git write | doc xong |

---

## 8. User cần cung cấp gì trước mỗi phase

### RENT

User cần cung cấp:

- link Google Sheet RENT
- ảnh tab Sheet nếu cần
- output path mới nhất
- có cho gửi Telegram không
- có cho chạy production không
- có yêu cầu data phải NEW hôm nay không

File cần kiểm tra:

- lanes/rent/vcp_demand_scout/output_vcp_demand_sale_ready.csv
- lanes/rent/vcp_demand_scout/DEMAND_SALE_HANDOFF.md
- lanes/rent/vcp_demand_scout/REAL_DEMAND_HANDOFF.md

### GARA

User cần cung cấp:

- link Google Sheet GARA
- ảnh Telegram Gara nếu cần
- nguồn đang ưu tiên: Bonbanh, Chotot, hoặc nguồn khác
- rule lọc xe:
  - chỉ xe cá nhân
  - miền Nam
  - xe dưới 6 năm
  - odo dưới 80,000 km

### IMAGE

User cần cung cấp:

- mục tiêu ảnh
- ảnh tham chiếu hoặc prompt
- model/backend muốn dùng
- tiêu chí pass/fail
- có cho chạy image backend không

### FANPAGE WINNING CONTENT

User cần cung cấp:

- fanpage URL
- Google Sheet target
- khoảng thời gian muốn quét
- metrics cần lấy:
  - reaction
  - comment
  - share
  - view
  - ngày đăng
  - link bài
  - link video nếu có
- yêu cầu output:
  - bài nào thắng
  - video nào thắng
  - vì sao thắng

Không gửi Telegram mặc định.

### SHORT FINANCE DISCIPLINE

User cần cung cấp:

- thị trường: BTC, crypto, stock, forex
- timeframe
- vốn tối đa
- mức lỗ tối đa mỗi lệnh
- điều kiện không vào lệnh
- rule:
  - ăn ít
  - không tham
  - không gồng bậy
  - không revenge trade
  - không overleverage
  - không all-in

Lane này không được tự đặt lệnh.

### DESKTOP UI

User cần cung cấp:

- ảnh giao diện hiện tại
- nút muốn có
- lane nào được hiển thị
- lệnh dry-run được phép
- lệnh production cần xác nhận

---

## 9. Kill-Switch Policy

Agent phải dừng ngay nếu gặp một trong các điều kiện sau:

- Git đang dirty nhưng task không phải Git audit.
- git status và git diff mâu thuẫn.
- Số file thay đổi vượt quá ALLOWED FILES.
- Runtime/temp file bị staged.
- Task có nguy cơ đụng production:
  - GSheet append
  - Telegram send
  - live scrape/fetch
  - trading/order execution
  - image backend tốn tài nguyên
- Agent không chứng minh được output là thật, mới, có nguồn.
- User chưa duyệt production.
- Task lan sang lane khác.
- Agent không verify được kết quả.
- File bắt buộc bị thiếu.

Khi dừng, agent phải báo:

- STOPPED_BY_KILL_SWITCH
- reason
- evidence
- next_safe_action

---

## 10. RENT Data Origin Policy

RENT VCP demand phải có cột:

- data_origin_type

Giá trị hợp lệ:

- REAL_SOURCE
- SAMPLE
- LOCAL_TRANSFORM
- UNKNOWN

Rule:

- Chỉ data_origin_type = REAL_SOURCE mới được sync Google Sheet.
- SAMPLE không sync.
- LOCAL_TRANSFORM không sync.
- UNKNOWN không sync.

4 dòng RENT hiện tại được xem là:

- TECHNICAL_SAMPLE_UNTIL_PROVEN_REAL

Lý do:

- sync_key trống
- source_title trống
- source_note_short trống
- thiếu metadata nguồn

Trước khi sync Sheet, mỗi dòng phải có:

- sync_key
- data_origin_type
- collected_at_vn
- source_url hoặc source_title
- source_time nếu có
- content_hash
- business_ready

Gate sync:

- Không sync_key = không sync.
- Không source metadata = không sync.
- data_origin_type khác REAL_SOURCE = không sync.

---

## 11. Production Safety Policy

Không chạy production nếu user chưa duyệt rõ.

Production gồm:

- append Google Sheet
- gửi Telegram
- scrape/live fetch
- sync/export tới target thật
- trading/order execution
- chạy image backend tốn tài nguyên

Dry-run chỉ được chạy nếu task ghi rõ dry-run.

Không chạy:

- run_all_lanes.bat

trừ khi user nói rõ muốn chạy tất cả lane.

---

## 12. Finance Discipline Policy

SHORT_FINANCE_DISCIPLINE_LANE là read-only trong 30 ngày đầu.

Rule:

- READ_ONLY_FIRST_30_DAYS
- NO_AUTO_TRADE
- NO_LEVERAGE_ESCALATION
- NO_REVENGE_TRADE
- NO_ALL_IN
- MAX_LOSS_RULE_REQUIRED
- NO_SIGNAL_CERTAINTY_CLAIMS

Output được phép:

- watchlist
- risk checklist
- trade journal
- entry condition plan
- stop-loss rule
- no-trade warning
- daily discipline report

Output bị cấm:

- auto order
- guaranteed win signal
- x50/x100 encouragement
- revenge trade suggestion
- all-in recommendation

---

## 13. Desktop UI Frame-Only Policy

Phase Desktop UI đầu tiên chỉ làm frame.

Được phép:

- Home screen
- Lane cards
- Status labels
- Dry-run buttons
- Production buttons disabled
- Open folder buttons
- Open Sheet buttons
- Open Telegram buttons
- Latest result panel

Bị cấm trong phase đầu:

- gắn production run trực tiếp
- gọi run_all_lanes.bat
- append GSheet
- gửi Telegram
- chạy ComfyUI/image
- finance/trading action

Production buttons phải disabled cho tới khi có operator confirmation modal.

---

## 14. Handoff format từ GPT Coordinator sang agent

Mỗi task gửi agent phải có đủ:

- TASK TITLE
- TIME LIMIT
- CONTEXT
- PHASE
- AGENT ROLE
- ALLOWED FILES
- FORBIDDEN FILES
- COMMANDS ALLOWED
- COMMANDS FORBIDDEN
- TASK
- VERIFY
- OUTPUT REQUIRED
- STOP IF

Nếu thiếu field, agent phải report-only và dừng.

---

## 15. Commit Policy

Rule:

- Audit/report commit riêng.
- Code commit riêng theo từng lane.
- Docs commit riêng.
- Không mixed commit.
- Không commit runtime/temp files.
- Không push khi tracked diff chưa sạch.
- Không push nếu user chưa duyệt.

Trước commit phải kiểm tra:

- git diff --name-status
- git diff --cached --name-status
- git status --short --untracked-files=all

Khi commit selected files:

- git add từng file cụ thể
- git diff --cached --name-status
- nếu staged file ngoài allowlist thì unstage toàn bộ và dừng

---

## 16. Runtime / Temp Files Never Commit

Không bao giờ commit:

- queue/jobs.json
- tmp_*.txt
- *_out.txt
- *_log.txt
- _LEGACY_ARCHIVE_/control_plane/commander_bridge/state/action_previews/*
- .venv*
- node_modules
- __pycache__
- *.pyc

---

## 17. Stop Policy

Dừng nếu:

- Git state inconsistent
- File thay đổi vượt allowlist
- Task có nguy cơ chạy production khi chưa duyệt
- Sheet/Telegram sẽ bị đụng khi chưa duyệt
- runtime/temp file bị staged
- agent không verify được
- finance lane xúi overleverage / revenge trade / gambling
- agent cố kích hoạt CALL lane

---

## 18. Next Steps

Thứ tự tiếp theo:

1. Tạo Phase Agent Matrix.
2. Git closeout / push safety.
3. RENT VCP demand real-source audit.
4. RENT VCP output contract lock.
5. RENT VCP Google Sheet sync.
6. GARA monitor / approval.
7. Image lane reactivation.
8. Fanpage winning content lane.
9. Short finance discipline lane.
10. Desktop UI frame.
11. Agent Orchestrator MVP spec.

Không build Agent Orchestrator trước khi:

- Agent Skill tồn tại.
- Phase Matrix tồn tại.
- Git ổn.
- RENT/GARA đủ ổn.