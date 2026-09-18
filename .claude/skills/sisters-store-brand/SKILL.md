---
name: sisters-store-brand
description: "Brand, catalog, audience, funnel and sales data for Sisters Store (sistersstore.it). Use when designing pages, writing copy, doing CRO, or building UI for the store or Luigi's portfolio."
---

# Sisters Store — Brand, Data & Project Context

Load this whenever the work touches Sisters Store or Luigi's design projects.
Replaces the `.claude/product-marketing.md` file CLI marketing skills look for.

**Provenance**: Shopify Admin analytics + theme export + Instagram audience, 30 July 2026.
Sales/device windows are 1 May – 30 Jul 2026 (90d). Funnel window is 1 – 30 Jul 2026.

## READ THIS FIRST — the store is two months old

Sisters Store began producing meaningful orders in **June 2026**. As of 30 July 2026 it is
roughly two months into trading. Everything below is early-stage data from a store still
finding its footing, not steady-state performance.

**Monthly ramp**

| Month | Orders | Gross sales | AOV |
|---|---|---|---|
| Apr 2026 | 1 | €98.36 | €98.36 |
| May 2026 | 4 | €202.13 | €50.53 |
| Jun 2026 | 19 | €1,072.20 | €56.19 |
| **Jul 2026** | **31** | **€1,993.35** | **€64.10** |

June → July: orders **+63%**, revenue **+86%**, AOV **+14%**. Growth is compounding and
average order value is rising. This is a healthy ramp, not a struggling store.

**Two framing rules that follow from this:**

1. **Do not benchmark this store against the ~1.4% average Shopify conversion rate.** That
   average is dominated by mature stores with search traffic, accumulated reviews and returning
   customers. This store has two months of history and mostly cold social traffic, which
   converts far worse than search by nature. Compare it to its own previous month instead.
2. **Never draw a conclusion from a segment with fewer than ~30 conversions.** See the device
   section below for a worked example of why.

## The numbers

**Sales — 90 days (1 May – 30 Jul 2026)**

| Metric | Value |
|---|---|
| Orders | 54 |
| Gross sales | €3,267.68 |
| Discounts given | €10.84 (0.33% of gross) |
| Returns | €0 |
| Shipping charged | €201.80 |
| AOV, 90-day average | €60.31 — **diluted by near-empty pre-launch months** |
| **AOV, current (July)** | **€64.10 — use this one** |

**Sales channels — 90 days**

| Channel | Orders | Gross | AOV |
|---|---|---|---|
| Online Store | 35 | €2,131.14 | €60.58 |
| **TikTok** | **16** | €989.00 | €61.81 |
| Shop app | 3 | €147.54 | €49.18 |

**TikTok is roughly 30% of orders.** Those orders never touch the website, so they generate no
web sessions and are invisible in funnel data. Any statement about "the funnel" describes only
the Online Store channel.

**Revenue by category — 90 days, gross**

| Category | Revenue | Share |
|---|---|---|
| **Borse** | €2,236.80 | **68.4%** |
| *(product_type not set)* | €515.14 | 15.8% |
| Zaini | €296.07 | 9.1% |
| Costumi | €196.72 | 6.0% |
| Maglieria | €22.95 | 0.7% |

This is effectively a **handbag store**. Treat bags as the hero category, not as one of four
equals. Note the 15.8% sitting under a blank `product_type` — a catalog hygiene gap that breaks
reporting and smart collections.

**Funnel — July 2026, Online Store channel only**

| Step | Sessions | Pass rate | Lost |
|---|---|---|---|
| Sessions | 4,233 | — | — |
| Added to cart | 171 | **4.04%** | 4,062 |
| Reached checkout | 141 | 82.5% | 30 |
| Completed checkout | 15 | **10.6%** | 126 |

Overall conversion rate: **0.354%** — but see the tracking caveat below; the true figure is
probably somewhat higher.

**Devices — 90 days**

| Device | Sessions | Share | Conversions | Conversion rate |
|---|---|---|---|---|
| Mobile | 11,810 | **94.1%** | 21 | 0.178% (95% CI 0.10–0.25%) |
| Desktop | 622 | 5.0% | **2** | 0.322% (95% CI 0.00–0.77%) |
| Tablet | 110 | 0.9% | 1 | — |

**The only reliable fact here is that mobile is 94% of traffic.** The desktop rate rests on
*two* conversions and its confidence interval fully overlaps mobile's. There is **no
demonstrated difference** between mobile and desktop conversion. Do not claim there is, and do
not build revenue estimates on it — an earlier analysis did exactly that and was wrong.

Design for the phone because that is where essentially all traffic is, not because desktop
performs better.

**Session tracking caveat**

35 Online Store orders vs 24 completed checkouts recorded in session data — a gap of 11. Most
likely cause given this traffic mix: in-app browsers (TikTok, Instagram) and cookie-consent
refusals preventing session attribution. Implication: reported conversion rates understate
reality. Treat them as a floor, not a measurement.

## Priorities — in this order

**1. Add-to-cart rate, 4.04%.** Largest and most statistically solid finding: 4,233 sessions.
Four people in a hundred put anything in the basket. This lives on the product detail page —
imagery, sizing information, trust signals, price clarity, above-the-fold hierarchy on mobile.

**2. Checkout completion, 10.6%** (15 of 141). Smaller sample, so less certain, but the most
anomalous number in the store. Cart → checkout is healthy at 82.5%, so the problem is inside
checkout. Fastest diagnostic: place a real test order from a phone through to payment.

**3. Everything else.** Palette, typography and general polish come after the two above.

## Two settled facts — do not re-litigate

**PayPal** was removed deliberately in late June 2026 over fee percentage. It had never been
properly active (a `PAYEE_ACCOUNT_NOT_SUPPORTED` fault) and at most ~3 orders were lost to it.
**PayPal is therefore not an explanation for the July checkout drop-off** — it was already gone
for that entire period. Luigi has weighed the trade-off; do not reopen it unprompted.

**Discounts are effectively unused** — €10.84 across 90 days. The customer is *not* known to be
price-sensitive; that lever has simply never been pulled. Never describe the audience as
discount-driven, and never as discount-resistant. There is no evidence either way.

## Design system — AS BUILT (verified from theme export)

**Typography currently live**
- Headings: **Montserrat**, weight 400
- Body: **Poppins**, weight 300
- Heading scale 100, body scale 100

Fraunces + Inter were an unimplemented *direction*. Never describe them as live. If proposing a
move away from Montserrat/Poppins, state explicitly that it is a change.

**Colour schemes — all five are stock Dawn defaults, unmodified**

| Scheme | Background | Text | Button | Button label |
|---|---|---|---|---|
| scheme-1 (product cards) | `#ffffff` | `#000000` | `#000000` | `#ffffff` |
| scheme-2 | `#f3f3f3` | `#121212` | `#121212` | `#f3f3f3` |
| scheme-3 | `#242833` | `#ffffff` | `#ffffff` | `#000000` |
| scheme-4 | `#121212` | `#ffffff` | `#ffffff` | `#121212` |
| scheme-5 | `#334fb4` | `#ffffff` | `#ffffff` | `#334fb4` |

`#334fb4` is Dawn's factory blue, still present. **There is no custom brand palette.**
"Editorial Neutral" and "Dark Cinematic" are unimplemented directions, not the brand.

**Layout currently live**
- Platform: Shopify, **Dawn 15.4.1**
- Page width 1200px, button radius 0 (square)
- Cards: standard style, centred text, scheme-1
- Cart drawer, predictive search on, reveal-on-scroll on
- Logo width 130px, currency code shown, vendor hidden
- Custom: "ESAURITO" sold-out badge in `snippets/card-product.liquid` + `assets/base.css`

**Rules**
- Design tokens first; never hardcode raw hex in markup
- **Review every change at 375px width before considering desktop** — 94% of traffic
- Touch targets minimum 44x44px
- The ESAURITO badge must not regress when touching cards

## Audience

Source: **Instagram follower demographics**, July 2026. Followers, not verified buyers —
directional only.

- **90% women**, 10% men
- **35–54 is the core: 59%** (45–54: 29.7%, 35–44: 29.3%). 25–34: 16.7%. 18–24: 11.8%.
  55–64: 9.7%. 65+: 2.8%
- **Heavily Campania**: Napoli 11.0%, Casoria 4.7%, Camerota 2.7%. Outside: Roma 2.3%, Bari 1.7%

Design for a woman aged 35–54 in Campania, shopping on a phone, spending around €64.
Legibility, generous tap targets and obvious affordances beat trend-driven minimalism.

## Voice

Direct and concrete. No inflated marketing adjectives, no "scopri il fantastico mondo di".
Short sentences. Benefits before features. Italian.

## Open items

- Blank `product_type` on 15.8% of revenue — needs fixing in the admin
- Competitors: not identified
- Whether a custom palette should be implemented at all
- Why 11 Online Store orders have no matching tracked session

## Portfolio projects

Luigi maintains an offline interactive HTML portfolio for Marketing and Graphic Design
interviews. Case studies: **Madame Media**, **N'Idea**, **Tyler, the Creator Meta Ads**.
Must be fully responsive.

## How to use this data

1. Two-month-old store. Compare it to its own last month, never to industry averages.
2. Priority order: add-to-cart rate, then checkout completion, then everything else.
3. Bags are 68% of revenue. Weight decisions accordingly.
4. TikTok is ~30% of orders and invisible in funnel data. Say so when discussing the funnel.
5. Never conclude anything from a segment with under ~30 conversions. State the sample size
   alongside any rate you quote.
6. Never present a palette as "the brand palette" — none exists. Present it as a decision.
7. Quote the real figures above rather than generic e-commerce benchmarks.
