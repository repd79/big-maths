# Big Maths · Beat That

English maths practice for Reception and Years 1-6, optimized for touch, Apple Pencil and a number keypad. Standalone, buildless HTML/CSS/JavaScript.

## Run locally

```sh
python3 -m http.server 8874
```

## Checks

```sh
node --test tests/*.test.cjs
```

## Cloudflare Pages

Connect this repository, use the main branch, no framework, no build command, and the repository root as the output directory. No API keys or external services are required by the app. Preferences and records are browser-local; Settings supports backup/restore when moving from the old games address.

See GAMES.md for the content mapping and known scope. The downloaded school PDFs and reference artwork are not included in this repository.
