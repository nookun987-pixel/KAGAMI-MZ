# Demo showroom — ngrok (link `https` cho gara)

Gara **chỉ mở URL `https://…`** từ ngrok — **không** gửi `localhost` / `127.0.0.1`.

## Ngrok trong repo (không cần PATH)

Binary đặt sẵn:

`AKI\tools\ngrok\ngrok.exe`

## 1) Lưu authtoken (một lần)

Token: https://dashboard.ngrok.com/get-started/your-authtoken  

**Cách A — file (một dòng):** tạo `AKI\tools\ngrok\.authtoken` chứa đúng token, rồi:

```powershell
cd AKI
.\tools\ngrok\configure_authtoken.ps1
```

**Cách B — biến môi trường rồi chạy cùng script:**

```powershell
$env:NGROK_AUTHTOKEN = "PASTE_TOKEN_HERE"
.\tools\ngrok\configure_authtoken.ps1
```

**Cách C — lệnh trực tiếp (một chỗ dán token):**

```powershell
& ".\tools\ngrok\ngrok.exe" config add-authtoken PASTE_TOKEN_HERE
```

Cấu hình lưu tại: `%LOCALAPPDATA%\ngrok\ngrok.yml`.

## 2) Chạy demo và lấy link `https`

**Tự động (khuyến nghị):** sau khi đã bước (1), từ thư mục `AKI`:

```powershell
.\scripts\demo_autostart_print_https_url.ps1
```

Script sẽ in dòng **LINK HTTPS GUI GARA** — đó là URL gửi gara. Giữ cửa sổ mở; `Ctrl+C` để tắt showroom + ngrok.

**Hoặc hai cửa sổ thủ công:**

```powershell
.\scripts\run_showroom_public_demo.ps1
```

Rồi ở cửa sổ khác (hoặc sau vài giây):

```powershell
.\scripts\print_public_demo_url.ps1
```

## 3) Tunnel thủ công (đúng port 8766)

```powershell
.\scripts\ngrok_tunnel_8766.ps1
```

Hoặc:

```powershell
& ".\tools\ngrok\ngrok.exe" http 8766
```

Trong output ngrok, dòng **Forwarding** dạng: `https://… -> http://localhost:8766` (hoặc `127.0.0.1`).

## 4) Showroom local (trước khi mở tunnel)

```powershell
.\scripts\showroom_serve_8766.ps1
```

URL nội bộ: `http://127.0.0.1:8766/` — **chỉ để bạn test**, không gửi gara.
