# Caldera.xyz — Design System Extraction

## Fonts
- **Primary**: "PP Neue Corp Compact Ultrabold" — custom commercial font
- **Open-source alternative**: Sora, Cabinet Grotesk, or Geist (closest to the wide, clean aesthetic)
- **Fallback**: system sans-serif

## Colors
| Role | Value | Usage |
|------|-------|-------|
| Background | `rgb(226, 226, 223)` (#E2E2DF) | Page background |
| Surface | `rgb(247, 246, 242)` (#F7F6F2) | Cards, elevated surfaces |
| Text primary | `rgb(7, 6, 7)` (#070607) | All text |
| Accent | `rgb(252, 80, 0)` (#FC5000) | CTAs, links, highlights |
| Border | transparent → `rgba(0,0,0,0.08)` on hover | Subtle dividers |

## Typography Scale
- **Hero heading**: 80px, line-height: 88px, weight: 400 (ultrabold font compensates)
- **Section heading**: 80px, line-height: 96px
- **Subheading**: 48px, line-height: 48px
- **Card heading**: ~24px
- **Body**: ~18px
- **Labels**: ~14-16px

## Page Sections (top to bottom)
1. **Header/Nav** — transparent bg, blurs on scroll, logo + 5 links + social + CTA
2. **Hero** — massive typography with word-by-word animation, 2 CTAs
3. **Stats Bar** — 4 metrics in a row: TVL, Transactions, Wallets, Chains
4. **Features** — "More Is More. Go Horizontal." + 2 side-by-side cards
5. **Ecosystem Tabs** — tabbed content: Gaming / AI / DeFi with project logos
6. **News Carousel** — horizontal scroll blog cards with prev/next
7. **Community** — social stats + email signup
8. **Investors** — logo grid "Backed By The Best"
9. **Footer** — CTA, social links, link columns, copyright

## Interaction Patterns
- Word-by-word letter spacing animation on hero headings (each letter wrapped in span)
- Horizontal scroll carousel for news
- Tab switching for ecosystem (Gaming/AI/DeFi)
- Transparent nav → solid on scroll
- Subtle hover states on links and cards
- Newsletter email input with animated border
