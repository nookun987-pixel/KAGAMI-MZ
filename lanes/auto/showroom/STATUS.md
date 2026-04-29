# Gara — WIP SHELL

Status: UI shell chạy, pipeline chưa wire vào API.

## Evidence (2026-04-20)
- showroom_api.py không import pipeline.ingest_run / score_run
- pipeline.py thuần HTTP fetch + in-memory, không persist
- input.json.payload = {} — không có keyword/URL crawl
- output.json chỉ là receipt "Auto showroom launch requested"
- API endpoints trả 200 + body rỗng → UI "No listings" đúng trạng thái

## Cần làm khi resume
1. Define input schema: payload cần gì
2. Wire pipeline.ingest_run → cache → API endpoints
3. Thêm trigger POST /api/showroom/ingest + nút Refresh UI
4. Test input thật chotot + oto_com

## Không bị ảnh hưởng
- Launcher + port binding đã stable
- UI render đúng khi có data
- Import chain mikage_auto_scout đã fix (commit 3d00995)
