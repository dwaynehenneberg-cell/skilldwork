# Reddit Ads Playbook

How Skilldwork runs paid traffic from Reddit to skilldwork.com. The site's only
conversion is a booked workflow fit call, so everything here is built around that
one event.

The ads are written in English because the landing page is English. A German
campaign needs a German landing page first — an English page behind a German ad
loses most of the click.

## 1. What the site already does

| Piece | Where | Notes |
| --- | --- | --- |
| Reddit Pixel | `app/reddit-pixel.tsx` | Loads only after the visitor allows measurement (one shared banner covers Reddit and Meta). `NEXT_PUBLIC_REDDIT_PIXEL_ID` must be set in Vercel. |
| `PageVisit` | on pixel init | Fires on every consented page view. |
| `ViewContent` | `app/booking-widget.tsx` | Fires once when the scheduler is opened — the mid-funnel signal. |
| `Lead` | `app/booking-widget.tsx` | Fires when Calendly confirms a scheduled event. **This is the conversion to optimise for.** |
| Campaign capture | `app/campaign.ts` | Stores `utm_*` and the click ids (`rdt_cid`, `fbclid`) from the landing URL for the session. |
| Calendly passthrough | `app/booking-widget.tsx` | The stored `utm_*` values ride along into the booking, so every booking in Calendly names the campaign that paid for it. |

Consequence of the consent gate: pixel-reported conversions undercount visitors
who decline. Calendly's UTM record does not depend on consent, so treat Calendly
as the source of truth for booking counts and Reddit as the source of truth for
which ad delivered them.

## 2. Before spending anything

1. Set `NEXT_PUBLIC_REDDIT_PIXEL_ID` in the Vercel project and redeploy — the
   value is baked in at build time.
2. Install the Reddit Pixel Helper extension, open skilldwork.com, allow
   measurement, and confirm `PageVisit`.
3. Click "Build your workflow" → confirm `ViewContent`.
4. Book a real test slot → confirm `Lead`, then cancel the slot.
5. In Reddit Ads Manager → Events, confirm all three events show as received.
6. Open `https://skilldwork.com/?utm_source=reddit&utm_medium=cpc&utm_campaign=test`,
   book again, and confirm the UTM values appear on the Calendly booking.

Do not launch until step 4 and step 6 both pass. Optimising for a conversion the
platform never receives is how budget disappears.

## 3. Account structure

Start with two campaigns, not ten. The account needs conversion volume in one
place before Reddit's optimisation is worth anything.

**Campaign A — Conversions (`Lead`), 80% of budget**

| Ad group | Targeting | Purpose |
| --- | --- | --- |
| Communities — service businesses | Community targeting, list below | The core bet. |
| Interests — business & entrepreneurship | Reddit interest categories: Business, Entrepreneurship, Marketing, Small Business | Broader reach when community targeting caps out. |

**Campaign B — Traffic, 20% of budget**

One ad group, same communities, cheaper clicks. Its job is to fill the pixel
audience and surface which angle earns attention, not to produce bookings.

Shared settings for both:

- Geo: US, CA, UK, IE, AU, NZ, DE, AT, CH, NL (English-speaking plus DACH, where
  English-language B2B ads still convert).
- Placement: feed and conversation.
- Devices: all — but write for mobile, that is where the impressions are.
- Schedule: run all week. Reddit's B2B traffic does not respect office hours.
- Bidding: automatic to start. Move to manual CPC only after ~50 conversions.

### Community targeting list

Verify each is ad-eligible in Ads Manager — availability changes.

`r/freelance`, `r/Entrepreneur`, `r/smallbusiness`, `r/consulting`,
`r/agency`, `r/marketing`, `r/AskMarketing`, `r/PPC`, `r/SEO`,
`r/copywriting`, `r/web_design`, `r/graphic_design`, `r/videography`,
`r/Accounting`, `r/Bookkeeping`, `r/msp`, `r/nocode`, `r/automation`,
`r/SaaS`, `r/EntrepreneurRideAlong`

Split into two ad groups once spend justifies it: generalist business subs
behave differently from craft subs (`r/copywriting`, `r/videography`).

## 4. Budget and what "working" means

Starting point: **€30/day for 14 days (≈ €420)**. Below roughly €20/day the
algorithm never leaves the learning phase; above €50/day you are paying to learn
things €30/day would have taught you.

Split: €24/day Campaign A, €6/day Campaign B.

Benchmarks to judge against — these are starting assumptions to be replaced with
your own numbers after two weeks, not promises:

| Metric | Watch for |
| --- | --- |
| CTR (feed) | Below 0.4% → the creative is the problem |
| CPC | €0.60–€2.00 typical for B2B on Reddit |
| Landing → scheduler opened (`ViewContent` / `PageVisit`) | Below 10% → the ad promised something the page does not repeat |
| Scheduler opened → booked (`Lead` / `ViewContent`) | Below 20% → friction or wrong audience |
| Cost per booked call | The only number that decides renewal |

Decide the acceptable cost per call before launch: close rate × deal value ×
acceptable payback. Write it down, then hold the campaign to it.

## 5. Creative

Reddit punishes ads that look like ads. Text-forward, plain, first-person,
lowercase-ish. No stock photography of people shaking hands.

Run three angles simultaneously, two creatives each. Kill an angle after ~1,000
impressions with no click-through.

### Angle 1 — The capacity ceiling

> **Headline:** Your service only scales if you stop delivering it by hand.
>
> **Body:** Every client you take on costs you the same hours as the last one.
> We turn one repeatable service into a digital workflow — landing page,
> purchase, onboarding, delivery, revisions — and leave you the decisions only
> you can make. 30-minute fit call, bring one repeatable service.
>
> **CTA:** Book a fit call

### Angle 2 — The specific, boring promise

> **Headline:** One repeatable service, turned into a workflow that runs without you.
>
> **Body:** Not a course, not an agency retainer. We build the workflow your
> clients move through and hand it to you. You keep marketing and the
> judgement calls. Everything between them is automated.
>
> **CTA:** See how it works

### Angle 3 — The self-selecting filter

> **Headline:** If you deliver the same service more than 10 times a month, this is for you.
>
> **Body:** That repetition is the part worth automating. We map it once, build
> the client-facing workflow, and you get the capacity back. Starts with a
> 30-minute call about one service.
>
> **CTA:** Book a fit call

Format: single image or text-only post ad. Test one plain-background image with
the headline set in the site's display type against one screenshot of the
workflow map section — the map is the most concrete asset on the page.

**Comments are on.** Reddit ads accept replies and the comment section is read
as a credibility signal. Answer every question within a day, in the same
first-person voice, without a sales pitch. An ad with three honest replies
outperforms the same ad with a locked thread.

## 6. Link and UTM convention

Every ad's destination URL:

```
https://skilldwork.com/?utm_source=reddit&utm_medium=cpc&utm_campaign=<campaign>&utm_content=<ad>
```

- `utm_campaign`: `conv-communities`, `conv-interests`, `traffic-communities`
- `utm_content`: the angle plus creative, e.g. `capacity-ceiling-image-a`

Enable auto-tagging in Ads Manager so Reddit appends `rdt_cid`. The site stores
it for the session; it is the identifier a server-side Conversions API
integration would need later (see section 8).

Keep `utm_medium=cpc` fixed — it is what separates paid Reddit from organic
Reddit referrals in Calendly.

## 7. Weekly routine

**Every Monday, 20 minutes:**

1. Cost per booked call, per ad group, over the last 7 days.
2. Pause any ad below 0.3% CTR with more than 2,000 impressions.
3. Pause any ad group at more than 2× the target cost per call after ≥ €100 spend.
4. Check that Calendly booking count and Reddit `Lead` count still move together.
   A widening gap means either the consent rate dropped or the pixel broke.
5. Read the comments on every live ad. The objections that show up there are the
   next headline.

Do not touch budgets and creative in the same week. You lose the ability to say
which change did anything.

## 8. Next steps once the funnel proves out

- **Conversions API.** Browser-only pixel tracking undercounts, and the consent
  gate makes it worse. A server-side event sent from a Calendly webhook, keyed
  on the stored `rdt_cid`, would report bookings Reddit currently misses. This
  is the highest-value technical follow-up.
- **Retargeting.** Once the pixel audience passes the platform minimum, run a
  small ad group at visitors who opened the scheduler but did not book.
- **German landing page.** A DACH campaign is worth running only with a German
  page behind it, `/de` with its own UTM set.
- **Lead-gen forms.** Reddit's native lead forms convert cheaper but skip the
  landing page — useful only if a call booked from a form still shows up.

For the Facebook and Instagram side of the same funnel, see
`meta-ads-playbook.md`.
