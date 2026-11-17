# Academic briefing — Codespaces-ready source

A five-screen, English-language, **personal academic presentation** for José Aldonate, with two optional built-in screens each for the Peru irrigation project and Chambit Menu. It uses a **navy / violet / white palette chosen for this presentation**, not official JBNU brand colors or logo. All images are local; no network connection, account, packages, npm or server is needed to run the slides.

## Contents

- `index.html` — all five main screens, detail-screen templates, photos and captions.
- `styles.css` — palette, presentation layout, responsive styles and chart appearance.
- `script.js` — slide controls, optional two-screen project views, usage chart, animation and accessibility features.
- `analytics.js` — **the only file to edit** for usage figures. It contains *no* invented daily observations; an older, explicitly labeled 390 “Total users” screenshot is stored separately.
- `assets/` — local images extracted from the supplied presentation PDFs.
- `build_pdf.py` — regenerates the PDF fallback after you edit its text/layout (PDF does not auto-sync with HTML).
- `professor-briefing.pdf` — nine-page offline fallback: five main screens, then four appendix pages.
- `SOURCE_NOTES.md` — sources and boundaries for every factual claim.

## Create a project in GitHub Codespaces

1. Create a new GitHub repository. Unzip the package, then upload **the files inside `professor-briefing/` to the repository root** (or keep them in that folder and open it there). Do not omit `assets/`, `analytics.js`, `styles.css`, or `script.js`.
2. Open the repository in Codespaces. Open `index.html` in a browser preview using the editor's preview or Live Preview extension. A static preview is sufficient; there is no install/build step and no API key.
3. You can also open `index.html` directly from your own computer without Codespaces: the `file://` version works because all data is in `analytics.js` rather than being fetched.
4. If you want to publish: repository **Settings → Pages → Deploy from a branch → main / root**. Check your site and obtain its GitHub Pages address from GitHub. **This is optional**; public publishing makes photos and details visible to anyone with access to the URL. Review permission to publish people pictured and any dashboard screenshots first.

## Controls

- Main screens: click 01–05, use ←/→ buttons, or press Left/Right Arrow, PageUp/PageDown, Home/End.
- On screen 03, click **View project details** for two project screens.
- On screen 04, click **View Chambit Menu details** for the service overview and usage-evidence screen.
- Inside detail views use ←/→ buttons or keys; **Esc** closes the view. Animation starts on entering the usage screen and respects reduced-motion settings.

## Add real daily usage data

Open `analytics.js`. Leave `historicalSnapshot` alone unless you replace it with a verified, clearly defined snapshot. Enter confirmed daily figures using the same metric and units on every date:

```js
window.ANALYTICS.dailyUsers = [
  // Add REAL values only, e.g. { date: 'YYYY-MM-DD', value: <verified integer> }
];
```

**Do not paste that example literally.** If you have seven consecutive valid daily entries, the usage view computes their arithmetic average (the latest seven dates). Otherwise the ring displays “—” rather than making up an average. Bars start at zero and animate one by one. The table under the chart gives exact values. Changing `analytics.js` changes the website after a refresh, but **not** the PDF; update `build_pdf.py` or print an updated screenshot if you need a new PDF.

The older briefing (`(slides)_Continuing_My_Contribution_At_JBNU.pdf`, p. 7) has a screenshot marked **390 “Total users” on 28 Oct 2026**. It is historical, and its metric should **not** be treated automatically as seven-day mean or unique daily users. No weekly figures were inferred from the shape of its chart.

## Before the meeting

- Verify the official title of your introductory AI course if you decide to add it; this presentation says only “introductory AI study.”
- Check any new service usage figures against the actual analytics dashboard; label the metric, date and period.
- Confirm hardware/protocol or conference claims before adding precision not present in the cited materials.
- Swap menu screenshots for more current ones if you have them, keeping each filename or updating `index.html`.
- Inspect the slides at the projector's size. On short displays, a slide may scroll rather than cut off content.

## PDF generation

The included PDF is already generated and usable offline. To regenerate after modifying `build_pdf.py` or images, run `python -m pip install reportlab pillow` if the libraries are missing, then `python build_pdf.py`. The PDF is a condensed, static companion and does not reproduce CSS or browser animations.
