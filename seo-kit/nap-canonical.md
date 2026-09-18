# Canonical NAP — Avenix Studio

**This file is the single source of truth.** Every directory listing, social profile,
invoice and email signature must match it exactly. If you change something here,
change it everywhere — inconsistent NAP is the most common reason a local listing
underperforms, because search engines cross-reference these strings across sources
and lose confidence when they disagree.

Generated from `src/config/client.config.js` and `.env.local`. No value on this page
was invented.

---

## THE NAP BLOCK — copy this verbatim

```
Avenix Studio
Lahore, Punjab, Pakistan
+92 302 6234429
```

That is the canonical form. Not "Avenix Studios". Not "Avenix Studio Pvt Ltd". Not
"+92 3026234429" or "03026234429". **Byte-identical, every time.**

---

## Field by field

| Field | Canonical value | Source |
|---|---|---|
| Business name | `Avenix Studio` | `identity.brandName` / `identity.legalName` |
| Street address | `[USER TO FILL]` | **Not in config — see below** |
| City | `Lahore` | `contact.address.locality` |
| Region / Province | `Punjab` | `contact.address.region` |
| Country | `Pakistan` | `contact.address.country` (stored as ISO `PK`) |
| Postal code | `[USER TO FILL]` | Not in config |
| Phone | `+92 302 6234429` | `NEXT_PUBLIC_CONTACT_PHONE` |
| WhatsApp | `+92 302 6234429` | `NEXT_PUBLIC_WHATSAPP_NUMBER` (`923026234429` — same number) |
| Website | `https://www.avenixstudios.com` | `urls.website` |
| Email | `abdullahqayyum1041@gmail.com` | `NEXT_PUBLIC_CONTACT_EMAIL` — **read the warning below** |
| Founded | `2023` | `identity.foundingYear` |
| Founder | `Abdullah Khan` | `identity.founder` |
| Hours | `[USER TO FILL]` | Not in config. `contact.timezone` is `PKT (GMT+5)` |

---

## Three things to decide before you submit anywhere

### 1. Street address — `[USER TO FILL]`

There is no street address anywhere in the codebase, so none is written here. This is
a real decision, not an oversight, and it affects which listings you can even create:

- **If you have a commercial premises in Lahore:** use it. A verified street address is
  what makes you eligible for map results, and it is the strongest local signal available.
  Fill it in below, then update every asset in this kit.
- **If you work from home:** Google allows this. Create the profile as a
  **service-area business**, enter the address during verification, and then **hide it**
  so it is not shown publicly. You still get map eligibility without publishing your
  home address.
- **Do not** use a virtual office, a mailbox, or a co-working address you do not
  actually operate from. This is the most common cause of profile suspension, and a
  suspended profile is far worse than a late one.

Once decided, write it here and propagate:

```
Street address: [USER TO FILL]
Postal code:    [USER TO FILL]
Publicly shown? [USER TO FILL — yes / no, hidden service-area business]
```

### 2. Business name — do not add keywords

The canonical name is `Avenix Studio`. Adding descriptors — "Avenix Studio | Software
Development Company Lahore" — is against Google's guidelines and is a common cause of
suspension or a forced rename. The categories field is where you say what you do.

Note the domain is `avenixstudios.com` (plural) while the business name is
`Avenix Studio` (singular). That mismatch is fine and does not need fixing — but it
means you must be deliberate: submit the **name** as singular everywhere, even though
the URL reads plural.

### 3. Email — strongly recommend changing before you submit

The configured contact email is a personal Gmail address. It works, and it is already
public on the site, but on an agency directory profile it reads as a freelancer rather
than a studio — and it is the one field here that is trivially cheap to improve.

**Recommendation:** set up `hello@avenixstudios.com` (or similar) on the domain you
already own, and use that everywhere in this kit instead. Do it *before* submitting,
because changing an email across a dozen live listings later is genuinely tedious.

```
Email to submit: [USER TO FILL — recommended: hello@avenixstudios.com]
Fallback if not set up yet: abdullahqayyum1041@gmail.com
```

---

## Categories

Directories vary in wording, so pick the closest available option rather than forcing
an exact string. In order of preference:

**Primary category (pick the first one the platform offers):**
1. Software Company
2. Software Development Company
3. Website Designer / Web Designer
4. Information Technology Company

Pick the most specific option available. Specificity is what matches you to intent —
"Software Company" beats "Business Service" every time.

**Secondary categories (add as many as the platform allows):**
- Mobile App Development Company / Software Developer
- Website Designer / Web Design Agency
- Internet Marketing Service / SEO Agency
- Marketing Agency
- Graphic Designer
- Advertising Agency

These map to the four dedicated service pages plus the wider catalogue in
`src/data/services.js`. Do not add a category for something you do not sell.

---

## Website URLs to submit

Always submit the `https://` form with `www`:

| Purpose | URL |
|---|---|
| Homepage (default) | `https://www.avenixstudios.com` |
| Software development | `https://www.avenixstudios.com/services/software-development` |
| AI automation | `https://www.avenixstudios.com/services/ai-automation` |
| Mobile app development | `https://www.avenixstudios.com/services/mobile-app-development` |
| SEO | `https://www.avenixstudios.com/services/seo` |
| Contact | `https://www.avenixstudios.com/contact` |

Where a directory allows multiple service links, use the four service URLs rather than
pointing everything at the homepage — it tells the directory (and anyone reading) what
you actually do.

> **One thing to verify first:** `NEXT_PUBLIC_SITE_URL` in the deploy environment is
> currently set with `http://`. The site code force-upgrades this to `https://` so the
> rendered pages are correct, but confirm `https://www.avenixstudios.com` loads
> properly in a browser before you paste it into a dozen directories.

---

## Social profiles (real, from config)

| Platform | URL / handle |
|---|---|
| LinkedIn | `https://www.linkedin.com/company/avenix-studio/` |
| Instagram | `https://www.instagram.com/avenix_studios/` |
| Facebook | `https://www.facebook.com/profile.php?id=61591556996767` |
| GitHub | `https://github.com/AbdullahKhan7554` |
| X (Twitter) | Handle `@avenixstudio` — **profile URL `[verify]`**, config stores the handle only |

Two notes:

- The **Facebook** URL is a numeric profile link. Claim a vanity URL
  (`facebook.com/avenixstudio`) if you can — it is more credible on a listing and
  easier to keep consistent.
- The **GitHub** link is a personal account, not an organisation. Fine for a developer
  profile; consider creating a `avenix-studio` organisation for agency listings.
