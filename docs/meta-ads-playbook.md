# Meta Ads Playbook (Facebook & Instagram)

How Skilldwork runs paid traffic from Facebook and Instagram to skilldwork.com.
Same single conversion as everywhere else: a booked workflow fit call.

Read alongside `reddit-ads-playbook.md` — the two channels share the consent
banner, the campaign capture, and the UTM convention, and differ in almost
everything else.

## 1. Reddit vs. Meta — why they need different creative

| | Reddit | Meta |
| --- | --- | --- |
| Audience arrives via | Community context, self-selected topics | Interest and lookalike modelling |
| Wins with | Plain, first-person text that reads like a post | Motion, a face, a concrete before/after |
| Targeting lever that matters | Which subreddits | Which creative (Advantage+ does the rest) |
| Comment section | An asset — answer everything | A liability — moderate spam, hide nothing honest |

Do not copy the Reddit ads over. The Reddit angles are written to survive a
sceptical reader; Meta needs the promise in the first 1.5 seconds.

## 2. What the site already does

| Piece | Where | Notes |
| --- | --- | --- |
| Meta Pixel | `app/meta-pixel.tsx` | Loads only after the visitor allows measurement. `NEXT_PUBLIC_META_PIXEL_ID` must be set in Vercel. |
| `PageView` | on pixel init | Every consented page view. |
| `ViewContent` | `app/booking-widget.tsx` | Scheduler opened — the mid-funnel signal and the retargeting audience. |
| `Schedule` | `app/booking-widget.tsx` | Calendly confirmed a booking. **Optimise campaigns for `Schedule`, not `Lead`** — the site never fires `Lead` for Meta. |
| Campaign capture | `app/campaign.ts` | Stores `utm_*` and `fbclid` for the session; the UTMs ride into the Calendly booking. |

The consent banner is shared: one "Allow" covers Reddit and Meta together.
Visitors who decline are invisible to the pixel but still visible in Calendly
via UTM, so Calendly stays the source of truth for how many calls were booked.

## 3. Before spending anything

1. Create the pixel in Meta Events Manager, set `NEXT_PUBLIC_META_PIXEL_ID` in
   Vercel, redeploy (the value is baked in at build time).
2. Install the Meta Pixel Helper extension. Open skilldwork.com, allow
   measurement, confirm `PageView`.
3. Open the scheduler → confirm `ViewContent`.
4. Book a real test slot → confirm `Schedule` in Events Manager's Test Events,
   then cancel the slot.
5. Verify the domain skilldwork.com in Business Settings → Brand Safety. Without
   it, iOS attribution degrades badly.
6. Configure Aggregated Event Measurement: rank `Schedule` first, `ViewContent`
   second, `PageView` third. Only the top-priority event is reported for
   opted-out iOS users.

Steps 5 and 6 are not optional polish. Skipping them is the most common reason a
Meta campaign appears to convert at zero.

## 4. Account structure

**Campaign — Sales / Conversions, optimising for `Schedule`**

One campaign, two ad sets. Meta needs concentration far more than Reddit does:
roughly 50 conversions per ad set per week is where its optimisation starts
working, and a €30/day budget will not feed four ad sets.

| Ad set | Targeting |
| --- | --- |
| Advantage+ broad | No interest targeting. Geo + age 25–55 only. Let the creative do the targeting. |
| Interest stack | Interests: small business owners, entrepreneurship, freelancing, marketing consulting, business automation, Zapier, Notion, Shopify. Behaviours: small business owners, admins of business pages. |

Shared settings:

- Geo: DE, AT, CH, NL, UK, IE, US, CA, AU (see the language note below).
- Placements: Advantage+ placements. Do not hand-pick — you will pay more for
  the same result.
- Attribution: 7-day click, 1-day view.
- Optimisation event: `Schedule`. If the account cannot exit the learning phase
  after two weeks, temporarily optimise for `ViewContent` and judge on the
  Calendly booking count instead.

**Retargeting ad set** — add only once the site has enough traffic: people who
fired `ViewContent` in the last 30 days but not `Schedule`. Small budget,
€5–8/day, one direct creative ("you looked at the calendar — here is what the
30 minutes actually cover").

### A note on language

The landing page is English. German-language ads into an English page will burn
budget on clicks that bounce. Two honest options:

- Run English ads everywhere, accept a smaller DACH audience — recommended to
  start.
- Build `/de` first, then run a separate German campaign against it. This is the
  bigger opportunity for Facebook specifically, where the DACH small-business
  audience is much stronger than on Reddit.

## 5. Budget and benchmarks

Start at **€30/day for 14 days (≈ €420)**, split €20 Advantage+ broad / €10
interest stack. Do not run Reddit and Meta at the same starting budget in the
same fortnight if you cannot tell the two apart in Calendly — the UTM convention
below is what makes running both at once safe.

| Metric | Watch for |
| --- | --- |
| CTR (link) | Below 0.8% → creative problem, not audience |
| CPM | €8–€25 typical for B2B in DACH/US |
| Landing → scheduler opened | Below 10% → ad promised something the page does not repeat |
| Scheduler opened → booked | Below 20% → wrong audience or friction |
| Cost per booked call | The only number that decides renewal |

Meta will report cheaper clicks than Reddit and often worse call quality. Judge
the two channels on cost per *held* call, not per booking.

## 6. Creative

Three angles, each as one static image and one 15-second vertical video. Video
first — Reels and Stories inventory is where the cheap impressions are.

### Angle 1 — The capacity ceiling

> **Primary text:** You can only take on as many clients as you have hours. That
> is not a marketing problem, it is a delivery problem. We turn one repeatable
> service into a digital workflow — sales page, purchase, onboarding, delivery,
> revisions — and leave you the decisions only you can make.
>
> **Headline:** Stop delivering your service by hand
> **Description:** 30-minute workflow fit call
> **CTA button:** Book now

### Angle 2 — The specific, boring promise

> **Primary text:** Not a course. Not an agency retainer. We build the workflow
> your clients actually move through, and hand it to you. You keep the marketing
> and the judgement calls; everything in between runs on its own.
>
> **Headline:** One service, turned into a workflow that runs without you
> **Description:** See how it works
> **CTA button:** Learn more

### Angle 3 — The self-selecting filter

> **Primary text:** If you deliver the same service more than 10 times a month,
> that repetition is the part worth automating. We map it once, build the
> client-facing workflow, and you get the capacity back.
>
> **Headline:** Same service, 10+ times a month?
> **Description:** Starts with one 30-minute call
> **CTA button:** Book now

Video structure that works for this offer: seconds 0–2 the problem stated as a
sentence on screen, 2–8 the workflow map animating step by step, 8–15 the
promise and the CTA. The workflow map section of the site is the best raw
material you have — screen-record it.

## 7. Link and UTM convention

```
https://skilldwork.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=<campaign>&utm_content=<ad>
```

- `utm_source`: `facebook` or `instagram` — set per ad set if you split them,
  otherwise `meta`.
- `utm_campaign`: `meta-conv-broad`, `meta-conv-interest`, `meta-retargeting`
- `utm_content`: angle plus format, e.g. `capacity-ceiling-video-a`

Keep `utm_medium=paid_social` fixed so Meta traffic never mixes with Reddit's
`cpc` in the Calendly records. Meta appends `fbclid` on its own; the site stores
it for the session for a later Conversions API integration.

## 8. Weekly routine

**Every Monday, 20 minutes:**

1. Cost per booked call per ad set, last 7 days.
2. Turn off any creative below 0.5% link CTR after 5,000 impressions.
3. Leave budgets alone for the first 7 days. Editing an ad set restarts the
   learning phase and throws away what it learned.
4. Compare Meta `Schedule` count against Calendly bookings tagged
   `utm_medium=paid_social`. A widening gap means iOS attribution loss, not
   necessarily a broken pixel.
5. Check the comment sections for spam and for real questions. Real questions
   are the next headline.

## 9. Next steps once the funnel proves out

- **Conversions API.** Browser-only tracking loses a meaningful share of iOS
  conversions, and the consent gate loses more. A server-side `Schedule` event
  from a Calendly webhook, keyed on the stored `fbclid`, is the single highest
  -value technical follow-up — same work as the Reddit CAPI integration.
- **German landing page** at `/de`, then a DACH campaign against it.
- **Lookalike audience** from bookers, once there are 100+ of them.
