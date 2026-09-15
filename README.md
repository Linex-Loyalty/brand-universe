# Brand Universe · Grupo Linex

**Go here → https://linex-loyalty.github.io/brand-universe/**

This is where the Grupo Linex brand lives. If you need the logo, the exact colors,
the typeface, the tone of voice, or how a specific piece is built —a post, an email,
a business card, a web page— open that URL and take it. No access request, no asking
anyone first.

The site itself is in Spanish, the working language of the brand.

## What you'll find

**The hub.** The landing page shows the nine brands of the constellation grouped by
tier, and tells the truth about each one: which has an accent color defined, which has
a published manual, and which is still undecided. A card that looks dimmed means that
brand is missing a decision — not that the page is missing.

**Grupo Linex manual.** The shared system every brand inherits: constellation
architecture, Group Bar, foundational palette, typography, accessibility, and the
profile of each star.

**Linex Trip manual.** The first brand with a complete manual: logo, palette,
typography, iconography, photography, audiences, voice and tone, vocabulary, and the
pieces resolved channel by channel — web, WhatsApp, email, stationery, and social.

Each brand is a folder. When another one closes its manual, we add it and its hub card
turns into a link on its own.

## How to use it

Open the URL, find your brand, and copy the value or download the file you need. What
you see there —the HEX, the font name, the usage rule— is official. If something you
need isn't there, it's because it hasn't been decided yet: the manual says *pending*
instead of making it up, which tells you it needs to be escalated.

Missing something for your brand, spotted an outdated value, or need a piece that
hasn't been resolved? Write to the brand administrator.

---

## For whoever maintains the site

This repository is an **export**, not the source. The editable source lives in the
internal brand-system project. **Don't edit anything here by hand:** the next deploy
overwrites it.

To publish an update, from the internal project:

```
node tools/publicar-universo.js     # copies what's publishable and stitches the nav
node tools/generar-hub.js           # regenerates the hub from brand-tokens.json
cd brand-universe-publish
git add -A && git commit -m "..." && git push
```

The script copies by **allowlist**: only what is named in it goes out. If someone drops
a confidential PDF into an already-published folder tomorrow, it doesn't leak, because
it isn't on the list. It also aborts if it detects a forbidden path, and verifies there
are no broken links before finishing.

Anything written for this repository — README, commit messages, issues — is in English.
The brand content itself stays in Spanish.

### What's deliberately not here

- The brand strategy PDFs marked CONFIDENTIAL.
- `brand-tokens.json` — an internal artifact of the brand skill and agent.
- The open color studies, which compare one star against another.
- Briefs and packages addressed to a specific recipient.
- **The Linex Trip logo proposals.** Seven undecided options; on an open URL someone
  would take one believing it was approved. It ships once one is chosen.
- **Governance and open decisions from the group manual.** Who controls what, and which
  calls are still open, is working material for the brand team — not a reference manual.

The rule is: nothing undecided gets published. Adding something later is one command;
pulling it off an already-indexed site is not.
