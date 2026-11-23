# Maths games

The Games section contains 41 generated activity types and Number trails (42 games total).
Play is the main entrance; specific activities are under the expandable practice section below. Play draws from a shuffled bag
of all 42 games, then refills it without an immediate repeat. Each screen has a new
puzzle. Activities are untimed and separate from exam scores and records.

Number trails supports touch dragging, mouse dragging, taps, and keyboard activation.
Other activities use large touch choices (usually four), illustrated fraction choices,
or a number hunt validated after every tap. No keyboard or Check button is needed.
Incorrect choices stay red and play a gentle retry sound. Correct answers play a
positive sound, award a star, celebrate, and advance after 1.25 seconds. Skip is
always available. Leaving, skipping, or restarting cancels pending advancement.
Each new problem is read once in English, with a Listen button to repeat it.
Five stars advance the explorer level. Dice use standard pip positions; larger
quantities are split across several dice.

Money uses UK pence, matching the source material. Seasons use UK conventions.
Equivalent or repeated source pages share a generator. Numbers vary each time;
these are interactive adaptations rather than scanned worksheets.

## Source coverage

| Resource screenshot | Activity ID |
| --- | --- |
| Screenshot 2026-10-23 at 23.24.34.png | `fractions` |
| Screenshot 2026-10-23 at 23.24.37.png | `bonds-nine` |
| Screenshot 2026-10-23 at 23.24.51.png | `halves-quarters` |
| Screenshot 2026-10-23 at 23.24.57.png | `odd-even` |
| Screenshot 2026-10-23 at 23.25.01.png | `find-even` |
| Screenshot 2026-10-23 at 23.25.18.png | `double-money` |
| Screenshot 2026-10-23 at 23.25.27.png | `clock-hour` |
| Screenshot 2026-10-23 at 23.25.32.png | `clock-day` |
| Screenshot 2026-10-23 at 23.25.35.png | `clock-half` |
| Screenshot 2026-10-23 at 23.25.55.png | `count-back-money` |
| Screenshot 2026-10-23 at 23.26.54.png | `match-coins` |
| Screenshot 2026-10-23 at 23.27.08.png | `subtract-ten` |
| Screenshot 2026-10-23 at 23.28.01.png | `count-fives` |
| Screenshot 2026-10-23 at 23.28.08.png | `months` |
| Screenshot 2026-10-23 at 23.28.12.png | `days` |
| Screenshot 2026-10-23 at 23.28.14.png | `solid-sort` |
| Screenshot 2026-10-23 at 23.28.20.png | `solid-faces` |
| Screenshot 2026-10-23 at 23.28.54.png | `bonds-eight` |
| Screenshot 2026-10-23 at 23.29.06.png | `neighbours` |
| Screenshot 2026-10-23 at 23.29.11.png | `cartoon-calculation` |
| Screenshot 2026-10-23 at 23.29.14.png | `coin-stacks` |
| Screenshot 2026-10-23 at 23.29.22.png | `money-bonds` |
| Screenshot 2026-10-23 at 23.29.28.png | `over-ten` |
| Screenshot 2026-10-23 at 23.29.32.png | `addition-patterns` |
| Screenshot 2026-10-23 at 23.29.41.png | `three-numbers` |
| Screenshot 2026-10-23 at 23.30.08.png | `halve-dots` |
| Screenshot 2026-10-23 at 23.31.55.png | `hundred-square` |
| Screenshot 2026-10-23 at 23.32.08.png | `place-value` |
| Screenshot 2026-10-23 at 23.32.11.png | `missing-tens` |
| Screenshot 2026-10-23 at 23.32.15.png | `find-even` |
| Screenshot 2026-10-23 at 23.32.19.png | `sequences` |
| Screenshot 2026-10-23 at 23.32.26.png | `multiplication` |
| Screenshot 2026-10-23 at 23.32.36.png | `number-machine` |
| Screenshot 2026-10-23 at 23.32.44.png | `halve-odd` |
| Screenshot 2026-10-23 at 23.32.48.png | `halve-odd` |
| Screenshot 2026-10-23 at 23.32.52.png | `clock-half` |
| Screenshot 2026-10-23 at 23.33.00.png | `clock-quarters` |
| Screenshot 2026-10-23 at 23.33.22.png | `patterns` |
| Screenshot 2026-10-23 at 23.33.25.png | `add-bonds` |
| Screenshot 2026-10-23 at 23.33.28.png | `subtract-bonds` |
| Screenshot 2026-10-23 at 23.33.32.png | `money-ten` |
| Screenshot 2026-10-23 at 23.33.38.png | `change-twenty` |
| Screenshot 2026-10-23 at 23.35.59.png | `add-subtract-one` |

Additional variants: `solid-names` names the illustrated solid; `clock-quarters`
adds quarter hours to the clock practice; `trails` adapts number bonds to a swipe
board with addition, subtraction, and multiplication.

## Implementation

- `index.html`: existing exams, home, Games catalogue, activity screen, Number trails.
- `maths-games.js`: activity generators, response controls, checking and random bag.
- `maths-games.css`: responsive activity and menu layouts, generated visual objects.

No remote services or dependencies are needed to play. Existing local settings and
exam records are preserved. Files can be served with the existing games site or
opened locally together.

## Beat That exam (v2.4)
Handwriting answer boxes have a tappable × to clear a response during the exam. Once every answer contains writing and no stroke is in progress, automatic submission waits 1.8 seconds for any extra strokes. The recorded total and last-answer timings stop at the last stroke, excluding that confirmation delay. Writing again or clearing a response cancels the pending submission. Practice mode keeps its existing manual finish. Timed exams still enforce their deadline. Numeric-keypad exams use the final key entry by the same rule. Exam records and settings keep their existing storage keys.

## Handwriting variants (v2.4.3)
The digit recognizer supports sevens with a separately drawn middle bar. A conservative shape check removes only a plausible middle bar from a seven-shaped backbone, then requires the existing model to identify the remaining shape as 7 with at least 80% confidence. Ordinary sevens and other digits keep their existing recognition path.

## Completion checkpoints (v2.4.4)
The 30-second and one-minute checkpoints count written, non-erased responses by their final-input timestamp, regardless of the handwriting recognition verdict. Correctness appears separately as “marked correct” when grading is available. Completion records use `bm.best.sums-completed.*` and never replace the existing correctness records. Empty answers are excluded; manual grading changes only the correctness subtotal. All checkpoint captions remain in English.

## English speech (v2.4.5)
All spoken prompts and number buttons share one voice policy. Prefer named female English voices (British English first, then other English accents), with enhanced/natural variants preferred within that group. Avoid known male and novelty voices when alternatives exist. Refresh voices at startup, on `voiceschanged`, and before each utterance, preserving synchronous playback from the user gesture on iPad. Use rate 0.95, pitch 1.08, and full volume. If no English voice is exposed yet, request the browser's en-GB fallback. Actual voice availability depends on the device.

## Course-aligned revision (v3.0.0)
Reception and Years 1-6 have separate course choices. Beat That uses numeric facts transcribed from the downloaded course sheets: 7/17/40/24/42/72/72 questions, with course-default 20/30/90/60/60/100/100 seconds. Settings also offers fixed durations or no timer. Full sheets are paged in groups of 18 without resetting the running clock. Eight complete Year 4 variants are retained; two source pages with incomplete extracted equations are excluded rather than inventing missing facts.

Learn Its Steps 1-15 use the full current-and-two-previous-step challenge; Step 13 is 6×6, 6×9, 9×9, 7×9, 7×7, 6×7. Ultimate uses the exact 72-fact bank. `curriculum.js` provides ten skill positions for CLIC 1-20, grouped under school years. These are new interactive adaptations of the source skills, not scanned copies or a claim to duplicate every original question/method. CLIC 6 follows the new standalone teacher notes. Grouping: Reception 1-3; Year 1 4-6; Year 2 7-9; Year 3 10-12; Year 4 13-15; Year 5 16-18; Year 6 19, with 20 as an optional extra. Early observed skills have grown-up marking. Tasks support multiple answer fields, selections, column layout, decimals, and remainders. SAFE remains outside this revision.

First visit asks Pencil or Keypad once; Settings retains the choice, Home Screen installation instructions, and backup/restore. iPad help follows Apple's Safari instructions. The manifest supports standalone launch, without promising offline playback. Spoken questions no longer append the visible equation. Self-contained problems hide their calculation until Help is requested; direct arithmetic retains it. Wrong-answer feedback does not reveal a strategy automatically.

Existing records are not deleted. Changed tests use new record namespaces; unchanged Year 1 Beat That keeps its existing keys. JSON backup/restore moves only Big Maths preferences and records, conservatively merging best scores/times. Browser storage is separate on a new domain.

### Voice and independent hosting (v3.0.1)
English speech prefers known female British voices and enhanced variants when exposed by the browser, avoids character/novelty voices, and offers a persistent voice selector and preview for iPad and Android. All prompts use rate 0.80, pitch 1.16, volume 1, and 700 ms between sentences; decimal points are not sentence breaks. Every navigation/retry cancels pending speech and pauses. Actual quality depends on available device voices; this has not been auditioned on a physical iPad or Android device.

The standalone repository is repd79/big-maths and the Pages project is big-maths. The old games address keeps its own local records. Settings provides an explicit transfer link to the new app (URL fragment, not server query data), which asks the user to restore; JSON backup/restore is also available. The source ZIPs and PDFs stay local and are excluded from publication.

## Original school worksheets and illustrated controls (v3.1.0)
The original Level 1 ten-week school pack is the Year 1 default again. It is a separate series from modern CLIC 1–20: never equate those numbering schemes or claim an official one-to-one mapping to school years. The selector belongs immediately below Big Maths. Printed skill order is dictation, ordering (smallest first), one more/less, picture addition, double, number sentence, half, counting, missing piece to ten, picture subtraction. Week 1 is checked against the original local PDF. Alternative CLIC skill adaptations remain explicitly selectable.

Thirteen generated raster illustrations replace primary navigation, onboarding and character icons. Optimized transparent WebP assets and generation prompts are in assets/icons; instructional mathematical diagrams remain code-drawn. Speech rate is .74, pitch 1.16, with 850 ms between sentences. Main Big Maths automatically narrates questions; Extra practice and Maths games only speak when Listen is tapped.

## Child profiles and round setup (v3.2.0)
Profiles are local to this browser/device and keep their own school year, worksheet choice, input preferences and records. The first player retains all original settings and record keys; additional players use bm.child.<id> namespaces. Backups include every player and merge records conservatively. No account or cloud synchronization is implied. Player names are rendered as plain text.

Practice/Exam is chosen at launch, including retry; Settings contains only Course default, 2× course default and No timer. Beat That launch offers an accessible range control and a draggable illustrated dial from 1× through 2× in tenths, then No timer. Round overrides do not change the saved default; scores use the actual round limit. CLIC worksheets retain their documented lack of a fixed time limit, rather than borrowing the much shorter Beat That durations. CLIC series/course mappings for other years still require matching the child's school worksheet; they are not inferred official equivalences.
