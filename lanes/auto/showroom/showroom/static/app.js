function fmtPrice(n) {
  if (!n) return "—";
  return new Intl.NumberFormat("vi-VN").format(n) + " đ";
}

function flagPills(flags) {
  const map = [
    ["MOI_LEN_SAN", "MỚI LÊN SÀN"],
    ["GIA_TOT", "GIÁ TỐT"],
    ["GIA_BINH_THUONG", "GIÁ BÌNH THƯỜNG"],
    ["GIA_CAO", "GIÁ CAO"],
    ["TIN_RO_RANG", "TIN RÕ"],
    ["ANH_ON", "ẢNH ỔN"],
    ["CHU_DANG", "CHỦ ĐĂNG"],
    ["SALON", "SALON"],
    ["HAS_PHONE_REAL", "CÓ SỐ TRÊN TIN"],
    ["HAS_PHONE_MASKED", "XEM SỐ TRÊN TIN"],
    ["NEN_GOI_NGAY", "NÊN GỌI NGAY"],
    ["THEO_DOI", "THEO DÕI"],
    ["UU_TIEN_SALE", "ƯU TIÊN SALE"],
    ["XE_MOI", "XE MỚI"],
    ["KM_THAP", "KM THẤP"],
  ];
  return map
    .filter(([k]) => flags && flags[k])
    .map(
      ([_k, lab]) =>
        `<span class="flag on">${lab}</span>`
    )
    .join("");
}

function geoBadge(gp) {
  const g = String(gp || "UNKNOWN").toUpperCase();
  const map = {
    CORE: { cls: "geo-core", lab: "KHU VỰC LÕI" },
    NEAR: { cls: "geo-near", lab: "GẦN" },
    EXTENDED: { cls: "geo-ext", lab: "MỞ RỘNG" },
    UNKNOWN: { cls: "geo-unknown", lab: "KHU VỰC CHƯA RÕ" },
  };
  const m = map[g] || map.UNKNOWN;
  return `<span class="geo-badge ${m.cls}" title="Ưu tiên khu vực">${m.lab}</span>`;
}

function phoneLine(x) {
  const pt = String(x.phone_type || "").toUpperCase();
  let contact = "Liên hệ: xem trên tin đăng";
  if (pt === "REAL") contact = "Liên hệ: có số trên tin";
  else if (pt === "MASKED") contact = "Liên hệ: xem số trên tin đăng";
  const iv = x.image_valid ? "Ảnh ổn" : "Cần xem ảnh trên tin";
  return `${contact} · ${iv}`;
}

/** Chỉ xe đủ điều kiện sàn chính (DISPLAY_READY) — lọc phòng thủ nếu API lệch. */
function isDisplayReadyCard(x) {
  return String(x.display_status || "").toUpperCase() === "DISPLAY_READY";
}

/** Phòng thủ: đồng bộ ngưỡng tuổi/km với server (không classify geo ở client). */
function passesMainFloorRules(x) {
  if (!isDisplayReadyCard(x)) return false;
  const cy = new Date().getFullYear();
  const maxAgeYears = 6;
  const maxKm = 80000;
  const y = Number(x.year) || 0;
  if (y > 0 && y < cy - maxAgeYears) return false;
  const km = x.mileage_km;
  if (km != null && km !== "" && Number(km) > maxKm) return false;
  return true;
}

function cardHTML(x, showReasons) {
  const img = x.image_url || "";
  const flags = flagPills(x.flags || {});
  const reasons = showReasons
    ? `<div class="reasons">⚠ Nên đối chiếu tin gốc trước khi báo khách.</div>`
    : "";
  const statusReason =
    x.status_label && String(x.status_label).trim()
      ? `<div class="card-status-reason">${escapeHtml(String(x.status_label))}</div>`
      : "";
  const reasonCodes =
    Array.isArray(x.reason_codes) && x.reason_codes.length
      ? `<div class="card-reason-codes" aria-label="Lý do ngoài sàn chính">${x.reason_codes
          .map(
            (c) =>
              `<span class="flag code-badge">${escapeHtml(String(c))}</span>`
          )
          .join("")}</div>`
      : "";
  const expBadges =
    Array.isArray(x.expanded_badges) && x.expanded_badges.length
      ? `<div class="card-expanded-tier">${x.expanded_badges
          .map((b) => `<span class="flag expanded-badge">${escapeHtml(b)}</span>`)
          .join("")}</div>`
      : "";
  const cardMod = x.inventory_tier === "expanded" ? " card-expanded" : "";
  const vid = String(x.vehicle_id || "");
  const src = (x.source_url || "").trim();
  const srcHref = src ? x.source_url : "#";
  const srcDisabled = !src ? " is-disabled" : "";
  return `
  <article class="card${cardMod}" data-vehicle-id="${escapeHtml(vid)}">
    ${statusReason}
    ${reasonCodes}
    ${expBadges}
    <img class="card-img" alt="" src="${img}" onerror="this.style.display='none'" />
    <div class="card-body">
      <div class="card-geo">${geoBadge(x.geo_priority)}</div>
      <div class="price">${fmtPrice(x.price)}</div>
      <div class="title">${escapeHtml(x.title || "")}</div>
      <div class="meta">${escapeHtml(x.location || "")}<br/>Năm: ${x.year || "—"} · KM: ${escapeHtml(x.mileage || "—")}<br/>${escapeHtml(phoneLine(x))}</div>
      ${reasons}
      <div class="flags">${flags}</div>
      <div class="actions">
        <a class="card-act-src${srcDisabled}" href="${escapeHtml(srcHref)}" target="_blank" rel="noopener">Mở tin gốc</a>
        <div class="card-act-row">
          <button type="button" class="card-act" data-act="detail" data-id="${vid}">Chi tiết</button>
          <button type="button" class="card-act" data-act="save_sale" data-id="${vid}">Lưu sale</button>
        </div>
        <details class="card-act-more">
          <summary class="card-act-more-btn" title="Thêm hành động">⋯</summary>
          <div class="card-act-more-menu">
            <button type="button" data-act="priority" data-id="${vid}">Ưu tiên</button>
            <button type="button" data-act="watch" data-id="${vid}">Theo dõi</button>
            <button type="button" data-act="contacted" data-id="${vid}">Đã liên hệ</button>
          </div>
        </details>
      </div>
    </div>
  </article>`;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function emptyState(msg) {
  return `<p class="muted empty-state" role="status">${escapeHtml(msg)}</p>`;
}

/** Kho xe = 0 — giải thích nhẹ, tránh hiểu nhầm lỗi (chỉ UI). */
function warehouseEmptyState() {
  const msg =
    "Hiện chưa còn xe nào ngoài các mẫu đang được ưu tiên hiển thị ở trên.";
  return `<p class="empty-state empty-state--inventory" role="status">${escapeHtml(
    msg
  )}</p>`;
}

/** Đồng bộ với select#filterSel — dùng khi tải lại / lọc. */
let currentFilter = "all";

/** vehicle_id đã dùng ở 3 strip trên (mới / nổi bật / gọi ngay) — kho không lặp lại. */
let stripVehicleIds = [];

function syncFilterFromDom() {
  const el = document.getElementById("filterSel");
  if (el && el.value) currentFilter = el.value;
}

const EMPTY_NEW =
  "Hiện chưa có xe mới phù hợp. Bạn có thể xem mục nổi bật hoặc xe mở rộng.";
const EMPTY_HI =
  "Chưa có xe nổi bật hôm nay. Thử xem các mục khác để tìm lựa chọn phù hợp.";
const EMPTY_URGENT =
  "Chưa có xe phù hợp trong nhóm này. Thử xem các mục khác.";
const EMPTY_EXPANDED =
  "Hiện chưa có thêm lựa chọn. Vui lòng quay lại sau hoặc thử bộ lọc khác.";
const EMPTY_REVIEW = "Chưa có tin trong mục này. Bạn có thể tải lại sau.";

async function loadSections() {
  const res = await fetch("/api/showroom/sections");
  const data = await res.json();
  stripVehicleIds = Array.isArray(data.strip_vehicle_ids)
    ? data.strip_vehicle_ids
    : [];
  const nw = (data.new_on_floor || []).filter(passesMainFloorRules);
  const hi = (data.highlight_today || []).filter(passesMainFloorRules);
  const ur = (data.call_now || []).filter(passesMainFloorRules);
  document.getElementById("secNew").innerHTML = nw.length
    ? nw.map((x) => cardHTML(x, false)).join("")
    : emptyState(EMPTY_NEW);
  document.getElementById("secHi").innerHTML = hi.length
    ? hi.map((x) => cardHTML(x, false)).join("")
    : emptyState(EMPTY_HI);
  document.getElementById("secUrgent").innerHTML = ur.length
    ? ur.map((x) => cardHTML(x, false)).join("")
    : emptyState(EMPTY_URGENT);
}

/** Kiểm tra mỗi vehicle_id chỉ một lần trong #panel-main (dev). */
function assertUniqueCardsOnMainPanel() {
  const ids = [];
  document.querySelectorAll("#panel-main article.card[data-vehicle-id]").forEach((el) => {
    const id = el.getAttribute("data-vehicle-id");
    if (id) ids.push(id);
  });
  const seen = new Set();
  const dup = [];
  for (const id of ids) {
    if (seen.has(id)) dup.push(id);
    seen.add(id);
  }
  if (dup.length) {
    console.warn("[showroom] trùng vehicle_id trên sàn chính:", dup);
  }
}

async function loadWarehouse() {
  syncFilterFromDom();
  let q = "/api/showroom/list?filter=" + encodeURIComponent(currentFilter);
  if (stripVehicleIds.length) {
    q += "&exclude=" + stripVehicleIds.map(encodeURIComponent).join(",");
  }
  const res = await fetch(q);
  const data = await res.json();
  const items = (data.items || []).filter(passesMainFloorRules);
  const boxNear = document.getElementById("secWhNear");
  const boxFar = document.getElementById("secWhFar");
  if (!boxNear || !boxFar) return;
  if (!items.length) {
    boxNear.innerHTML = warehouseEmptyState();
    boxFar.innerHTML = "";
    return;
  }
  const near = [];
  const far = [];
  for (const x of items) {
    const g = String(x.geo_priority || "UNKNOWN").toUpperCase();
    if (g === "CORE" || g === "NEAR") near.push(x);
    else far.push(x);
  }
  const emptyNear = emptyState("Chưa có xe gần gara với bộ lọc hiện tại.");
  const emptyFar = emptyState("Chưa có xe vùng mở rộng với bộ lọc hiện tại.");
  boxNear.innerHTML = near.length ? near.map((x) => cardHTML(x, false)).join("") : emptyNear;
  boxFar.innerHTML = far.length ? far.map((x) => cardHTML(x, false)).join("") : emptyFar;
}

async function loadExpanded() {
  syncFilterFromDom();
  const res = await fetch("/api/showroom/expanded?filter=" + encodeURIComponent(currentFilter));
  const data = await res.json();
  const box = document.getElementById("secExpanded");
  if (!box) return;
  const items = data.items || [];
  box.innerHTML = items.length ? items.map((x) => cardHTML(x, false)).join("") : emptyState(EMPTY_EXPANDED);
}

async function loadReview() {
  const res = await fetch("/api/showroom/review");
  const data = await res.json();
  const items = data.items || [];
  document.getElementById("secReview").innerHTML = items.length
    ? items.map((x) => cardHTML(x, true)).join("")
    : emptyState(EMPTY_REVIEW);
}

async function postAction(id, type) {
  const res = await fetch(`/api/vehicle/${id}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type }),
  });
  const j = await res.json();
  if (!j.ok) throw new Error("fail");
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 1600);
}

/** Lưu ý — chỉ ngôn ngữ người dùng (mapping nội bộ theo trạng thái, không hiển thị mã). */
function detailLuuyLines(j) {
  const st = (j.display_status || "").toUpperCase();
  if (st === "DISPLAY_READY") {
    return ["Xe đang hiển thị trong showroom, có thể xem chi tiết và tiếp cận ngay."];
  }
  if (st === "REVIEW") {
    return ["Xe này cần xem thêm một vài thông tin trước khi quyết định."];
  }
  if (st === "HOLD") {
    return ["Xe này chưa thuộc nhóm ưu tiên hiện tại, nhưng vẫn có thể tham khảo."];
  }
  return ["Luôn kiểm tra tin gốc trước khi chốt với khách."];
}

function openDetailModal(j) {
  document.getElementById("dmTitle").textContent = j.title || "—";
  document.getElementById("dmPrice").textContent = fmtPrice(j.price);
  const y = j.year != null && j.year !== 0 ? j.year : "—";
  const km = j.mileage || "—";
  const loc = j.location || "—";
  document.getElementById("dmMeta").textContent = `Năm: ${y} · KM: ${km} · Khu vực: ${loc}`;
  const gp = String(j.geo_priority || "UNKNOWN").toUpperCase();
  const geoLabels = {
    CORE: "KHU VỰC LÕI",
    NEAR: "GẦN (ven TP)",
    EXTENDED: "MỞ RỘNG",
    UNKNOWN: "Chưa xếp lớp / ngoài lõi",
  };
  const gEl = document.getElementById("dmGeo");
  if (gEl) gEl.textContent = `Ưu tiên khu vực: ${geoLabels[gp] || geoLabels.UNKNOWN}`;
  const lines = detailLuuyLines(j).slice(0, 2);
  document.getElementById("dmNote").innerHTML = lines.map((t) => `<p>${escapeHtml(t)}</p>`).join("");
  const a = document.getElementById("dmLink");
  const url = (j.source_url || "").trim();
  if (url) {
    a.href = url;
    a.classList.remove("dm-link-disabled");
  } else {
    a.href = "#";
    a.classList.add("dm-link-disabled");
  }
  const vid = j.vehicle_id || "";
  document.getElementById("dmSale").setAttribute("data-id", vid);
  document.getElementById("dmPri").setAttribute("data-id", vid);
  const m = document.getElementById("detailModal");
  m.classList.remove("hidden");
  m.setAttribute("aria-hidden", "false");
}

function closeDetailModal() {
  const m = document.getElementById("detailModal");
  m.classList.add("hidden");
  m.setAttribute("aria-hidden", "true");
}

async function openVehicleDetail(id) {
  const res = await fetch(`/api/vehicle/${id}`);
  if (!res.ok) {
    toast("Không tải được tin");
    return;
  }
  const j = await res.json();
  if (j.error) {
    toast("Không tải được tin");
    return;
  }
  openDetailModal(j);
}

document.getElementById("dmLink").addEventListener("click", (e) => {
  if (e.currentTarget.classList.contains("dm-link-disabled")) e.preventDefault();
});

document.getElementById("detailModal").addEventListener("click", async (e) => {
  if (e.target.closest("[data-close-modal]")) {
    closeDetailModal();
    return;
  }
  const btn = e.target.closest("button[data-act]");
  if (!btn || !btn.getAttribute("data-id")) return;
  const act = btn.getAttribute("data-act");
  if (act !== "save_sale" && act !== "priority") return;
  e.preventDefault();
  e.stopPropagation();
  const vid = btn.getAttribute("data-id");
  try {
    await postAction(vid, act);
    toast("Đã ghi nhận");
    closeDetailModal();
  } catch {
    toast("Lỗi ghi nhận");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const m = document.getElementById("detailModal");
  if (m && !m.classList.contains("hidden")) closeDetailModal();
});

document.getElementById("btnReload").addEventListener("click", async () => {
  syncFilterFromDom();
  await loadSections();
  await loadWarehouse();
  await loadExpanded();
  assertUniqueCardsOnMainPanel();
  const tab = document.querySelector(".tab.active")?.getAttribute("data-tab");
  if (tab === "review") await loadReview();
  toast("Đã tải lại");
});

document.getElementById("filterSel").addEventListener("change", async () => {
  syncFilterFromDom();
  await loadWarehouse();
  await loadExpanded();
  assertUniqueCardsOnMainPanel();
});

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.getAttribute("data-tab");
    document.getElementById("panel-main").classList.toggle("hidden", tab !== "main");
    document.getElementById("panel-review").classList.toggle("hidden", tab !== "review");
    if (tab === "review") loadReview();
  });
});

function closeCardMoreMenu(btn) {
  const det = btn && btn.closest("details.card-act-more");
  if (det) det.removeAttribute("open");
}

document.getElementById("app").addEventListener("click", async (e) => {
  const badSrc = e.target.closest("a.card-act-src.is-disabled");
  if (badSrc) {
    e.preventDefault();
    return;
  }
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const act = btn.getAttribute("data-act");
  if (act === "detail") {
    await openVehicleDetail(id);
    return;
  }
  try {
    await postAction(id, act);
    toast("Đã ghi nhận");
    closeCardMoreMenu(btn);
  } catch {
    toast("Lỗi ghi nhận");
  }
});

document.getElementById("panel-review").addEventListener("click", async (e) => {
  const badSrc = e.target.closest("a.card-act-src.is-disabled");
  if (badSrc) {
    e.preventDefault();
    return;
  }
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.getAttribute("data-id");
  const act = btn.getAttribute("data-act");
  if (act === "detail") {
    await openVehicleDetail(id);
    return;
  }
  try {
    await postAction(id, act);
    toast("Đã ghi nhận");
    closeCardMoreMenu(btn);
  } catch {
    toast("Lỗi ghi nhận");
  }
});

(async () => {
  syncFilterFromDom();
  await loadSections();
  await loadWarehouse();
  await loadExpanded();
  assertUniqueCardsOnMainPanel();
  await loadReview();
})();
