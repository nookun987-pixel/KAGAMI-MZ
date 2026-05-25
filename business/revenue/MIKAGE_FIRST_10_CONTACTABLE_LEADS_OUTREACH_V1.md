# MIKAGE FIRST 10 CONTACTABLE LEADS + OUTREACH V1

RESULT = READY_FOR_MANUAL_CONTACT_REVIEW
STATUS = DO_NOT_SPAM
CREATED = 2026-05-26

## 1. Rule

Do not invent email addresses.
Do not DM without checking the creator's current preferred contact route.
Do not pitch large benchmark brands first.
Use this as a shortlist for manual verification and outreach.

## 2. Filter logic

Priority target = smaller creators / indie games / horror / cyberpunk / AI-video adjacent creators.
Reason = closer to Mikage signal identity and more likely to consider small 5-29 USD test offers.

Avoid first = major virtual idols, large companies, enterprise AI audio/video companies.
Reason = too large, low conversion, not suitable for first micro-offer.

## 3. First 10 lead shortlist

| # | Lead | Category | Priority | Contact route | Offer tier | Why |
|---:|---|---|---|---|---|---|
| 01 | Floombo / Garn47 | indie surreal game | HIGH | CONTACT_ROUTE_NEEDS_VERIFY | 19 USD | Surreal low-poly odd-world game; strong fit for dark signal identity. |
| 02 | Scythe Dev Team / Northbury Grove | indie horror | HIGH | CONTACT_ROUTE_NEEDS_VERIFY | 19 USD | VHS/analog horror lane; strong music/sound identity fit. |
| 03 | marisa0704 / Brother Hai's Pho Restaurant | indie horror | HIGH | CONTACT_ROUTE_NEEDS_VERIFY | 9 USD | Vietnamese indie horror creator; local/cultural fit and small-package entry fit. |
| 04 | Adam Pype / papercookies | indie horror/ARG | HIGH | CONTACT_ROUTE_NEEDS_VERIFY | 19 USD | No Players Online / ARG mood aligns with Mikage signal concept. |
| 05 | LWMedia / Nightmare Kart | indie retro/gothic | MEDIUM | CONTACT_ROUTE_NEEDS_VERIFY | 19 USD | Strong retro-goth visual identity; potential sound tag fit. |
| 06 | itch.io cyberpunk tag creators | creator pool | HIGH | SEARCH_POOL_FIRST | 9 USD | Better chance to find small creators needing identity assets. |
| 07 | itch.io horror tag creators | creator pool | HIGH | SEARCH_POOL_FIRST | 9 USD | Horror devs often need short trailer/sound/caption concepts. |
| 08 | Runway showcase creators | AI video creator pool | MEDIUM | SEARCH_POOL_FIRST | 9 USD | Source for smaller AI video creators; use only individual creators after checking contact route. |
| 09 | Kaiber creator pool | AI music/video pool | MEDIUM | SEARCH_POOL_FIRST | 9 USD | Relevant AI music-video lane; source for smaller contacts. |
| 10 | Instagram/TikTok cyberpunk edit pages | creator pool | HIGH | SEARCH_POOL_FIRST | 5 USD | Most likely to accept small low-cost caption/sound identity test. |

## 4. Outreach message rules

Keep message short.
Do not over-explain Mikage lore.
Do not mention guaranteed viral result.
Do not mention copyright guarantee.
Offer a tiny sample direction first.

## 5. Message template — indie game / horror dev

Hi, I am testing a small sound / visual identity pack for indie creators.

Your project has a strong dark atmosphere, so I wanted to ask if you would be open to a compact signal pack:
- short sonic identity direction
- 10-15s hook concept
- caption angle
- visual direction for a short trailer/reel

I am testing early cases at 9-19 USD.
I can send one small sample direction first if useful.

## 6. Message template — AI video / visual creator

Hi, I am testing a small sound + short-form identity pack for AI/video creators.

The idea is simple:
- one sonic mood direction
- one short hook concept
- 3 caption options
- one visual direction for reels/shorts

Early test price is 5-19 USD depending on scope.
I can send one small sample direction first if it fits your page.

## 7. Message template — TikTok / Instagram edit page

Hi, I am testing a small creator signal pack for short-form pages.

It gives you:
- one caption angle
- one sound/intro direction
- one visual mood direction

Early test price starts at 5-9 USD.
I can send one small sample direction first.

## 8. First sample offer to send

Offer the free sample only as text direction, not full production.

FREE SAMPLE LIMIT:
- 1 sonic mood line
- 1 caption line
- 1 visual direction line

Do not create full audio or video before payment unless operator explicitly approves it.

## 9. Manual process

Step 1: Open lead page.
Step 2: Check if active in last 30-90 days.
Step 3: Find official contact route.
Step 4: If contact route is unclear, skip and replace.
Step 5: Send one short message.
Step 6: Update `business/revenue/MIKAGE_REVENUE_TEST_TRACKER_V1.csv`.

## 10. Status values

Use only:
- TO_FIND_CONTACT
- READY_TO_MESSAGE
- MESSAGED
- REPLIED
- NOT_INTERESTED
- INTERESTED
- PAID
- SKIP_NO_CONTACT
- SKIP_BAD_FIT

## 11. Next safe task

NEXT_SAFE_TASK = MANUALLY_VERIFY_CONTACT_ROUTES_FOR_FIRST_10_AND_SEND_FIRST_5_MESSAGES
