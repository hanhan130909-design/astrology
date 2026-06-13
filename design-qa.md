# Design QA

Target: `/natal` generated natal chart page should match the prior Almuten-style white chart page, without the red top menu bar.

Reference used: Almuten screenshot supplied in chat and yesterday's local component at `/Users/hanhan/astro-indo/src/components/chart/NatalChartWheel.tsx`.

Prototype checked: `http://localhost:3000/natal?almutenpage=1781318492768`.

Production project checked: `astrology`.
Production deployment checked: `https://astrology-kj4b5ebz4-astrology-420da605.vercel.app`.

Custom domain checked: `https://lunaxstar.com/natal?browser-final-d=1781331566645`.

Checks:
- Wheel renders as a white chart panel with thin grey circular rings.
- Generated result switches the whole content area to the Almuten-style white page.
- Red top menu is not rendered.
- Left column contains the birth info card and aspect matrix.
- Aspect matrix is positioned left of the chart.
- Right column contains the feature panel.
- Outer zodiac/house cusp glyphs, degrees, and minutes are present.
- House numbers 1-12 are placed inside the wheel.
- Planet glyphs and degree labels render in the wheel, including Sun, Moon, Mercury, Neptune, Pluto, and North Node.
- Aspect lines render inside the inner ring.
- After pressing `生成星盘`, the chart remains populated and does not fall back to empty circles.
- Bottom `黄道状态` table renders with the Almuten tab styling.
- Build passes with `npm run build`; remaining output is existing image/font lint warnings.

Automated DOM evidence:
- `svg[aria-label="本命盘"]`: present.
- Text nodes: 95.
- Line nodes: 22.
- Circle nodes: 5.
- After generate: no `计算错误`.
- `.chart-tool-page`: present.
- Title: `han - 本命图`.
- Aspect matrix left of chart: true.
- Feature panel: present.
- Bottom table: present.
- Red top menu: absent.
- Production `/api/chart`: HTTP 200, `success: true`, 27 aspects.
- Production generated page: `han - 本命图`, 95 SVG text nodes, aspect matrix present, feature panel present, bottom table present, no `计算错误`.
- Custom domain `/api/chart`: HTTP 200, `success: true`, 27 aspects.
- Custom domain generated page: `han - 本命图`, 95 SVG text nodes, aspect matrix present, feature panel present, bottom table present, no `计算错误`, no old test-domain text.
- Final browser check: default inputs are `han`, `1986-11-14 18:33`, `41.66`, `123.34`, `UTC+8`; generated page renders the white `NatalChartWheel` SVG with `viewBox="0 0 520 520"`, first circle `fill="white"`, Pluto glyph present, aspect matrix present, bottom table present, no `计算错误`.
- Service worker cache was disabled and old caches are cleared to prevent stale `/natal` pages.

final result: passed
