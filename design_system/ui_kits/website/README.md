# Mikage Zenith — Website UI Kit

A high-fidelity, interactive recreation of the public **mikagezenith.com** surface and its
adjacent pages. Built on the studio's real catalog and live copy.

Open **`index.html`** — it's a click-through prototype. Use the header nav:

- **Home** — hero ("Fifth transmission is live now"), sigil, signal line, and the
  **Current Transmission** card (PORCELAIN ASCENSION). The wordmark is a **draft** direction;
  the hero notes the logo is **UNCONFIRMED**.
- **Transmissions** — the **Launch Arc** archive list. Status drives the CTA safely:
  live → `Listen now` (+ glowing violet dot), future → `Pre-save`, uncertain/pending →
  `Link`. Click any row → track overlay.
- **Character** — the canon-locked porcelain helmet, 鏡 wordmark, trait grid.
- **Music Visual** — a silent looping visual field (void · helmet · one violet signal),
  sized for streaming canvas / short-form.
- **Canon** — the protected doctrine page.

## Files
- `data.js` — `window.MZ_DATA`: a subset of the real transmission catalog (titles, dates,
  languages, live/pre-save status, links). See the note in-file about tagline copy.
- `primitives.jsx` — `Grain`, `Sigil`, `SignalLine`, `Helmet`, `Btn`, `Label`, `Cover`.
- `components.jsx` — `SiteHeader`, `Hero`, `CurrentTransmission`, `ArchivePage`,
  `CharacterPage`, `MusicVisualPage`, `SiteFooter`.
- `App.jsx` — view router, `CanonPage`, `TrackOverlay`.
- `index.html` — loads `../../colors_and_type.css` + React/Babel + the scripts above.

## Notes & fidelity
- Hero copy and CTA grammar are taken from the studio's live-site update specs. The safe
  status→CTA map (`Listen now` / `Pre-save` / `Link`, never mixed) lives in `window.MZ_CTA`.
- **Taglines are never invented.** Only T05 PORCELAIN ASCENSION carries canon-confirmed copy
  ("A white shell rises from the void."). Every other release renders **`Tagline —
  UNCONFIRMED`** until the studio supplies approved copy. Wire real taglines into `data.js`.
- The wordmark is a draft direction; no approved logo file exists (`logoStatus: UNCONFIRMED`).
- Release covers are **generative void tiles** (number + title + grain + halo) rather than
  remote artwork, to keep the kit self-contained. Swap `Cover` for an `<img>` to use the
  catalog's S3 artwork URLs.
- Components are cosmetic recreations — not production data wiring.
