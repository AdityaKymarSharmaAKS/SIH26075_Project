# StatSkill AI — SIH Prototype

## Core implementation
- Original Solo System dashboard layout preserved as the reference experience.
- Three separate visual theme files:
  - `solo.css` — original Solo System base + Solo light mode
  - `executive.css` — premium professional theme
  - `aurora.css` — floral rose/lilac theme with decorative floral accents
- `auth-themes.css` — applies the selected theme to login/register pages without changing their structure.
- Light/Dark appearance works across the full dashboard, sidebar, topbar, cards and authentication screens.
- English, Hindi, Tamil and Telugu controls update navigation, headings, settings and major page labels.
- New `Analytics` tab provides graphical representations of competency scores, assessment history and learning effort.
- Competency engine remains in `App.jsx` and feeds My Competencies + Analytics.
- iGOT/Karmayogi data boundary remains backend-ready; secrets/tokens stay out of client code.

## Important design rule
The Solo System dashboard markup was preserved from the original dashboard. New themes are visual skins layered on top of the existing structure; selecting Executive or Aurora should not replace the dashboard layout.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
