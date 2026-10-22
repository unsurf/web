# unsurf: design

Dark ground (`#02060a`), an animated ASCII sea behind everything, a decoding ASCII wordmark, and a list of large mono project names that flood with the accent colour on hover.

- Type: Martian Mono for display, Geist for body, system mono for the wordmark (full-block glyphs tile cleanly).
- Accent: sea-glass `#9ff5d4`.
- Motion: sea drifts on the GSAP ticker, pointer pushes the surface, clicks and row hovers send ripples, page changes play a rising ASCII tide, smooth scroll via Lenis. Everything stills under reduced motion.
- Scroll: the native scrollbar is hidden; a thin tick gauge on the right edge shows progress. The sea starts sea-glass green and fades to grey with depth; hover on project tiles is neutral white.
