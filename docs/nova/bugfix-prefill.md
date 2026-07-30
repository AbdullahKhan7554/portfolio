# Nova — Bug Fix: Lead Capture Re-Asks Already-Answered Fields

## Bug
During the pre-lead-capture "qualification" phase, the user already answers budget ("20000pkr") and timeline ("asap") naturally. When lead capture formally starts (`fullName → email → phone → projectDescription → budget → timeline`), it re-asks budget and timeline from scratch, ignoring the earlier answers — forcing the user to repeat themselves.

## Root cause (verify before fixing)
Lead capture's field-extraction logic (`leadExtractor.js` / lead state init) only scans messages sent AFTER lead capture begins. It does not backfill from the qualification-stage conversation history that precedes it.

## Fix
When lead capture starts (the turn where the user confirms, e.g. "yeah sure"), scan the full conversation history up to that point through the same extractor used mid-flow (`leadExtractor.js`) and pre-fill `budget`, `timeline`, and `projectDescription` (and any other extractable field) into the lead state BEFORE asking the first lead-capture question. Then the deterministic question sequence should skip any field that's already filled — ask only what's still missing.

## Constraints
- Do not change the extractor's matching logic itself — reuse it as-is, just call it against a wider message range (qualification history + lead-capture messages).
- Do not skip `fullName`/`email`/`phone` even if guessable — those still need explicit confirmation in lead capture (only backfill budget/timeline/projectDescription from natural qualification chat, since those are the fields users tend to state early).
- Preserve existing behavior: user can still correct/override the pre-filled value if the extractor picks up something different later.
- No new files needed if this fits inside existing `leadExtractor.js` / lead-state-init location — find and reuse.

## Verification
1. Repeat the exact scenario: qualification stage states budget=20000pkr and timeline=asap naturally, then user says "yeah sure" to proceed to lead capture.
2. Confirm lead capture does NOT re-ask budget or timeline (skips straight from phone/projectDescription to completion, using the already-known values).
3. Confirm a case where qualification stage did NOT mention budget/timeline — lead capture should still ask normally (no regression).
4. Confirm final saved lead row has correct budget/timeline values either way.

STOP after fix for review — show which file(s) changed and the two test transcripts (backfilled case + normal case).
