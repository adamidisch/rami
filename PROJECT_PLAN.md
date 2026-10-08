# Philip Glass at 90 — Cyprus recital series

## Status
Concept website demo v0.1. The five proposed recitals are still in planning. Dates, venues, pricing, repertoire, ticket seller and publishing rights require confirmation. The demo contains no live checkout and collects no personal data.

## Purpose
A clear, premium home for the tour: learn about the series and pianist, find the correct event, then buy a ticket with confidence. The first version uses the supplied Rami Sarieddine photograph and a restrained editorial visual language.

## Visual direction
- Bilingual English and Greek throughout. English opens first for the current proposal; the choice persists in the production build.
- Near-white editorial canvas, aubergine ink, muted violet accent, Inter UI type and carefully spaced large music-led imagery.
- Navigation: logo to Home, The series, The pianist, Concerts, EL/EN and compact menu with Settings.
- Header is light and short. On mobile, essential actions remain visible and cards become readable rows.
- At least 12px visible UI text and 16px mobile input text. Greek ALL CAPS never carries tonos.
- The photo is used with consent before public launch. The project should obtain permission for any composer portraits, recordings, sheet music and other protected materials.

## Public site architecture
1. Home: concise tour concept, artist portrait, five-recital premise, direct concerts action.
2. Concerts: each confirmed concert has city, venue, date, start time, map/accessibility and ticket availability. Until confirmed, show a clear coming-soon state.
3. Concert detail: programme, venue, seating categories if required, ticket terms and checkout.
4. Artist: approved biography, press photo, official/social links and media only when cleared.
5. Information: organiser, contact, accessibility, refund/cancellation terms and privacy notice before sales begin.

## Ticketing decision
Start with a comparison of an established ticketing provider versus a custom checkout. Decide only after the organiser confirms expected ticket volume, seating type (general admission or assigned seats), box-office/offline sales, fee ownership, refund rules, payout account and door-scanning needs.

**Lower-risk initial route:** keep the branded website on Vercel and hand ticket selection/payment to a reputable hosted provider. This usually gives the tour a quicker launch and simpler refund, receipt and check-in operations. Confirm exact provider terms, country coverage and fees before selecting one.

**Custom route if genuinely needed:** a Vercel server endpoint creates the payment session, Supabase holds concerts, inventory, orders and ticket status, a verified payment webhook creates unique tickets and an organiser-only door screen validates them. Never issue a ticket on the browser success redirect alone. Idempotency, seat holds, race conditions, webhook retries, refunds, email delivery and check-in conflicts must be implemented and tested.

## Source and hosting
- New private GitHub repository, with a reviewed main branch and no credentials committed.
- Vercel project connected to that repository. Branch previews for review and production only after release checks.
- Environment variables in Vercel for payment and server credentials. Domain and analytics configured when approved.
- Supabase is introduced when we need structured concert content, admin operations, waitlist or custom orders. Use Row Level Security on exposed tables and server-side authorization for owner actions. No database is necessary for the visual demo.

## Suggested data model when needed
`concerts` (status, city, venue, date/time, capacity), `ticket_types` (price, capacity), `orders` (payment status and provider IDs), `tickets` (unique token and check-in state), `audit_events` (important ticket actions). For hosted external ticketing, store only the minimum needed for public concert data and links.

## Admin workflow
Authorised organiser can edit concert details, mark a concert ready, preview it, then publish. Sales and refunds stay in the selected ticketing provider unless the custom route is justified. No fake analytics or client-side password gate.

## Roadmap
1. Approve direction and obtain the tour name, official copy, branding and photo permissions.
2. Confirm the five dates, locations, venues, repertoire, ticket categories, prices, organiser and merchant of record.
3. Select ticketing provider and document fees, cancellation terms, settlement and support owner.
4. Create private GitHub repository and Vercel project; build concert pages and connect domain.
5. Add Supabase only for agreed functions. Integrate checkout, email/QR and check-in if custom ticketing is selected.
6. Test mobile/desktop, both languages, booking/payment/refund/check-in flows and accessibility; publish.
7. Maintain dates, sold-out states, copy, support and backup/recovery during the tour.

## Commercial arrangement to discuss
Separate a setup/design fee from any per-online-ticket fee, or agree on a minimum guaranteed amount against ticket commission. Define commission on paid, non-refunded tickets; clarify whether payment and ticketing fees, VAT, complimentary tickets, box-office sales, chargebacks and cancellations are excluded. Set a maintenance period and response expectations.

## Demo limitations
No dates, cities, venues, prices, repertoire or actual sale are asserted. The concept preview is for discussion and should not be promoted as an official tour announcement until the organisers approve it.
