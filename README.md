# Brand Universe · Grupo Linex

This is where the Linex brand lives. If you need a logo, an exact colour, the
typeface, the tone of voice, or how a specific piece is built — a post, an
email, a business card, a web page — it's here. No access request, no asking
anyone first.

**Clone the repo and double-click `index.html`.** That's the map of the whole
constellation, and every manual hangs off it. No server, no install, no
internet needed.

The manuals themselves are in Spanish, the working language of the brand.

---

## The one rule

**Nothing is invented.** If a brand has no logo, no colour or no documented
voice, it shows up as *pending*. It is never approximated, never filled in with
something plausible.

This is the whole point of the system. A plausible palette for a brand that has
no palette is the worst possible outcome: it looks right, nobody questions it,
and in six months it *is* the palette.

> A pending item that's labelled gets resolved. One that's disguised gets
> inherited.

---

## Where the truth lives

Everything comes from one file: **`brand-tokens.json`**. Eight brands, their
colours with every hard rule attached, their voice, their logos, their legal
status, and what each one is still missing.

The site, the manuals and the AI agent all read from it. If you change a colour
there and regenerate, it changes everywhere. If you change it anywhere else,
you've created a second truth.

**`null` means pending.** It does not mean "fill this in".

---

## Status right now

| Brand | Tier | Manual | Palette | Voice | Genie |
|---|---|---|---|---|---|
| Linex Capital | 1 · The fund | — | — | — | — |
| **Linex Loyalty** | 2 · Space port | — | 1 accent | — | **Ixar** |
| **Linex Travel** | 3 · Star | ✅ 16 pages | ✅ 6 colours | ✅ | *unnamed* |
| **Linex Go** | 3 · B2B sub-brand | ✅ 16 pages | ✅ 6 colours | ✅ | — |
| **Linex Trip** | 3 · B2C sub-brand | ✅ 16 pages | ✅ 7 colours | ✅ | — |
| Linex Marketplace | 3 · Star | — | — | — | *unnamed* |
| Linex Rewards | 3 · Star | — | — | — | **Milton** |
| Linex School | 3 · Expanding | — | — | — | — |

**Three manuals out of eight brands. 62 open items, none of them blocking.**

The honest read: four brands have no brand yet. Writing a manual for Linex
Marketplace today would produce fifteen sections that all say *pending* — what's
missing there is a branding session, not a website.

---

## What's in here

| | |
|---|---|
| `index.html` | The constellation map. **Generated — never edit by hand** |
| `brand-tokens.json` | Single source of truth: eight brands |
| `manual-linex-trip/` | Linex Trip manual · 16 pages · self-contained |
| `manual-linex-go/` | Linex Go manual · 16 pages · self-contained |
| `manual-linex-travel/` | Linex Travel manual · 16 pages · self-contained |
| `Logos/` | Official logos, and the partner brands we represent |
| `contexto-linex-*.md` | Full brand briefing, loadable in one go |
| `tools/` | Contrast calculator, token verifier, site generator |
| `.claude/` | The `/linex-brand` skill, `/manual-marca-linex-travel` skill, and the `brand-designer` agent |
| `docs/superpowers/` | Design specs, implementation plan, test records |
| `manual-marca-linex-travel.skill` | Packaged download of the Travel/Go/Trip design-system skill — source of truth is `.claude/skills/manual-marca-linex-travel/` |

Each manual is a self-contained folder. You can send `manual-linex-go/` to an
external agency on its own and it works — no missing stylesheet, no broken
path.

---

## Using it

**Need a colour?** Open the brand's manual, section 03. Every colour comes with
its role, its usage share, and the rule that constrains it. A colour without its
constraint is an invitation to misuse it.

**Need a logo?** `Logos/logos-oficiales/<brand>/`. If the file isn't there, that
version doesn't exist yet — don't recreate it.

**Need to check a piece?** Ask Claude Code in this folder. The `/linex-brand`
skill knows the rules and will cite the file each finding comes from.

**Need a contrast ratio?** Never estimate one, and never copy one from a manual:

```bash
node -e "const{contraste}=require('./tools/contraste.js');console.log(contraste('#FF725E','#FFFFFF').toFixed(2))"
```

This isn't paranoia. When Linex Trip changed its dark colour in September 2026,
six contrast ratios in its manual were left measured against the old one. They
had two decimal places, so they looked like facts, and nobody recalculated them
for three days. The verifier below now catches that class of error.

---

## Changing something

Edit `brand-tokens.json`, then:

```bash
node tools/verificar-tokens.js      # checks the data doesn't lie
node tools/sync-constelacion.js     # regenerates index.html
node --test tools/*.test.js         # 49 tests
```

**The verifier doesn't trust the file.** It recomputes every contrast ratio the
JSON claims and checks every path against disk. A colour that carries a hard
rule but no measurement is an error, not a warning — that's exactly how a rule
turns into a superstition.

---

## Adding a manual

A new manual designs nothing. It inherits the 82 CSS components Trip and Go
already share, and the fifteen sections in three blocks that are a written
decision of the brand administrator: same sections, same order, in every manual
of the group, so that knowing one means knowing them all.

The full contract is in
`.claude/skills/linex-brand/references/construir-manual.md`.

Navigation is never hand-edited. It's declared once in `tools/sync-nav.js`,
which fills three markers on every page. Sections that don't exist yet show up
greyed out instead of 404ing — so whoever arrives sees the full map and knows
what's missing.

---

## What the AI agent will and won't do

The `brand-designer` agent is judged by what it **refuses** to produce.

Ask it for a yellow button colour for Linex Trip and it will decline, quote the
1.36:1 ratio on white, and point you to the colour that *is* for actions. Ask it
for a logo file that doesn't exist and it will tell you it's pending. Ask it to
write an Instagram post for Linex Marketplace and it will tell you that brand
has no documented voice yet, and what's needed to give it one.

All of that is verified — the test records are in `docs/superpowers/pruebas/`,
with the literal responses.

*The agent registers when Claude Code starts in this folder. If you just cloned
the repo, restart it.*

---

## A couple of things worth knowing

**`main-anterior` is a superseded snapshot.** It holds what this repository
contained before 17 September 2026. It was retired by decision of the brand
owner and **nothing from it carries over** — don't use it as a source. It stays
on the remote as a backup, not as a reference.

**Design-source files (`.ai`, `.psd`) are deliberately not here.** This
repository distributes what you use — SVG, PNG, HTML — not what you edit. Ask
for the editable separately.
