type Point = { x: number; y: number }

const center = 260
const almutenScale = ringsOuterScale()
const symbolFontFamily = 'Apple Symbols, DejaVu Sans, STIXGeneral, Times New Roman, serif'
const rings = {
  outer: 248,
  zodiac: 222,
  house: 115,
  inner: 94,
  aspect: 82,
}

const planets = [
  { glyph: '☉', degree: 150, degreeText: '21°', signGlyph: '♏', minuteText: "18′", color: '#0a7a19', label: almutenLabel(381.29044059111277, 321.72506489962075, 364.96412688409777, 311.62103200477463, 351.3588654615852, 303.20100459240285, 337.7536040390727, 294.7809771800311) },
  { glyph: '☽', degree: 16, degreeText: '28°', signGlyph: '♈', minuteText: "32′", color: '#ff0000', label: almutenLabel(130.85748054391405, 67.14048641130151, 140.69173720091538, 83.6307076349305, 148.88695108174988, 97.37255865462134, 157.08216496258433, 111.11440967431217) },
  { glyph: '☿', degree: 28, degreeText: '00°', signGlyph: '♈', minuteText: "01′", rxText: 'R', color: '#ff0000', label: almutenLabel(367.3281997923227, 341.29756465152946, 352.46040090215627, 329.1489615976156, 340.0705684936842, 319.02512571935404, 327.6807360852122, 308.90128984109253, 317.76887015843454, 300.8022211384833) },
  { glyph: '♀', degree: 158, degreeText: '7°', signGlyph: '♏', minuteText: "09′", color: '#0a7a19', label: almutenLabel(332.37845935777733, 374.17206999284474, 321.1615582714372, 358.5893510382059, 311.814140699487, 345.6037519093402, 302.46672312753685, 332.6181527804745) },
  { glyph: '♂', degree: 73, degreeText: '22°', signGlyph: '♒', minuteText: "13′", color: '#1338ff', label: almutenLabel(331.7158792249317, 75.35321212518528, 320.5681921677027, 90.98552076063925, 311.2784529533452, 104.01244462351757, 301.9887137389877, 117.03936848639589) },
  { glyph: '♃', degree: 42, degreeText: '13°', signGlyph: '♓', minuteText: "02′", color: '#0a7a19', label: almutenLabel(271.59652436437045, 47.204600967402314, 266.72898754284756, 65.7773521177063, 262.67270685824514, 81.25464474295964, 258.6164261736427, 96.73193736821298) },
  { glyph: '♄', degree: 137, degreeText: '9°', signGlyph: '♐', minuteText: "50′", color: '#d00000', label: almutenLabel(399.9187432073404, 281.4435405938049, 381.64649146859756, 275.5473709561496, 366.4196150196452, 270.63389625810345, 351.1927385706928, 265.72042156005733) },
  { glyph: '♅', degree: 125, degreeText: '20°', signGlyph: '♐', minuteText: "46′", color: '#d00000', label: almutenLabel(407.4524816070129, 247.21557911562562, 388.39324522586685, 244.89490926241555, 372.5105482415785, 242.9610177180738, 356.62785125729005, 241.02712617373209) },
  { glyph: '♆', degree: 103, degreeText: '4°', signGlyph: '♑', minuteText: "00′", color: '#a00000', label: almutenLabel(407.6947994298753, 204.87413948976007, 388.61025019672184, 206.97651447233136, 372.706459169094, 208.72849362447414, 356.8026681414661, 210.4804727766169) },
  { glyph: 'pluto', degree: 161, degreeText: '7°', signGlyph: '♏', minuteText: "40′", color: '#0a7a19', label: almutenLabel(350.93068403425394, 358.880180828474, 337.77579212207945, 344.894873581974, 326.81338219526737, 333.24045087655736, 315.8509722684553, 321.5860281711407) },
  { glyph: '☊', degree: 22, degreeText: '19°', signGlyph: '♈', minuteText: "32′", rxText: 'R', color: '#ff0000', label: almutenLabel(158.24827391939897, 53.749753094308176, 165.2212507460994, 71.6387886796688, 171.03206476834976, 86.54631833413598, 176.8428787906001, 101.45384798860317, 181.49153000840042, 113.37987171217694) },
]

const aspects = [
  [0, 3, '#3ba349'],
  [0, 4, '#3ba349'],
  [1, 4, '#1e43ff'],
  [1, 6, '#ff5c6c'],
  [2, 8, '#ff5c6c'],
  [3, 5, '#3ba349'],
  [4, 7, '#1e43ff'],
  [5, 9, '#3ba349'],
  [6, 10, '#ff5c6c'],
  [7, 9, '#1e43ff'],
] as const

const houseCusps = [
  houseCusp(1, '♊', '#0028ff', '27°', "43'", 134.36970414359456, 241.5555541429581, 25.19999999999999, 225, 140.64, 225, 14.100000000000023, 225, 14.902538172450875, 243.3811461454811, 14.902538172450875, 206.6188538545189),
  houseCusp(2, '♋', '#0a7a19', '18°', "25'", 146.41921799348773, 273.093633666474, 38.10359670828544, 295.6383354604339, 146.08818527683164, 254.8250749721832, 27.72046319207911, 299.56268743045797, 34.96973779421688, 316.4729984531026, 21.972604985690793, 282.08490933428595),
  houseCusp(3, '♌', '#ff0000', '9°', "57'", 170.45603014863792, 299.2488535457195, 77.06053998509785, 359.2905662006798, 162.53667243815244, 281.7004612847315, 68.84168109538109, 366.75115321182864, 81.7903376878127, 379.82184154837216, 57.08148360078462, 352.6016530076567),
  houseCusp(4, '♍', '#9a2020', '2°', "53'", 217.70629796165142, 316.8408341130229, 141.0856887513275, 406.3240975922972, 189.5695130283383, 301.5590634278588, 136.4237825708457, 416.397658569647, 153.44224691285507, 423.3892587140725, 120.07943672725453, 407.94940667444047),
  houseCusp(5, '♎', '#0028ff', '13°', "28'", 278.1059604547143, 300.2840877223223, 279.2426055513395, 417.29607313463737, 247.90243345501003, 306.19167532351355, 282.256083637525, 427.9791883087838, 299.72900887256884, 422.2165947199259, 264.34740503383114, 432.196987712427),
  houseCusp(6, '♏', '#0a7a19', '22°', "22'", 312.77999723854936, 252.97514941515539, 387.9558818107863, 340.6089122138473, 293.803594542332, 273.81265182362444, 397.00898635582996, 347.031629559061, 406.9901975447402, 331.5756914011184, 385.7186829188861, 361.55883333134676),
  houseCusp(7, '♐', '#ff0000', '27°', "43'", 315.6302958564055, 208.44444585704196, 424.8, 225.00000000000003, 309.36, 225, 435.9, 225.00000000000003, 435.0974618275491, 206.61885385451893, 435.0974618275491, 243.3811461454812),
  houseCusp(8, '♑', '#9a2020', '18°', "25'", 303.5807820065123, 176.9063663335261, 411.8964032917146, 154.36166453956616, 303.9118147231684, 195.17492502781684, 422.2795368079209, 150.4373125695421, 415.03026220578306, 133.5270015468974, 428.0273950143092, 167.91509066571408),
  houseCusp(9, '♒', '#0028ff', '9°', "57'", 279.5439698513621, 150.7511464542805, 372.93946001490224, 90.7094337993203, 287.4633275618476, 168.29953871526857, 381.158318904619, 83.24884678817145, 368.20966231218745, 70.17815845162795, 392.9185163992155, 97.39834699234348),
  houseCusp(10, '♓', '#0a7a19', '2°', "53'", 232.2937020383487, 133.15916588697712, 308.9143112486728, 43.67590240770295, 260.4304869716619, 148.44093657214125, 313.5762174291546, 33.602341430353135, 296.5577530871453, 26.610741285927617, 329.92056327274554, 42.05059332555959),
  houseCusp(11, '♈', '#ff0000', '13°', "28'", 171.8940395452858, 149.7159122776776, 170.7573944486605, 32.70392686536263, 202.09756654499, 143.80832467648645, 167.74391636247498, 22.020811691216153, 150.27099112743122, 27.78340528007402, 185.65259496616883, 17.803012287572983),
  houseCusp(12, '♉', '#9a2020', '22°', "22'", 137.22000276145064, 197.02485058484464, 62.04411818921372, 109.39108778615267, 156.19640545766802, 176.18734817637556, 52.99101364417007, 102.96837044093894, 43.00980245525989, 118.42430859888142, 64.28131708111385, 88.4411666686533),
] as const

function ringsOuterScale() {
  return 248 / 222
}

function fromAlmuten(x: number, y: number): Point {
  return {
    x: center + (x - 225) * almutenScale,
    y: center + (y - 225) * almutenScale,
  }
}

function houseCusp(
  house: number,
  glyph: string,
  color: string,
  degree: string,
  minute: string,
  labelX: number,
  labelY: number,
  lineOuterX: number,
  lineOuterY: number,
  lineInnerX: number,
  lineInnerY: number,
  glyphX: number,
  glyphY: number,
  degreeX: number,
  degreeY: number,
  minuteX: number,
  minuteY: number,
) {
  return {
    house,
    glyph,
    color,
    degree,
    minute,
    label: fromAlmuten(labelX, labelY),
    lineOuter: fromAlmuten(lineOuterX, lineOuterY),
    lineInner: fromAlmuten(lineInnerX, lineInnerY),
    glyphPoint: fromAlmuten(glyphX, glyphY),
    degreePoint: fromAlmuten(degreeX, degreeY),
    minutePoint: fromAlmuten(minuteX, minuteY),
  }
}

function almutenLabel(
  symbolX: number,
  symbolY: number,
  degreeX: number,
  degreeY: number,
  signX: number,
  signY: number,
  minuteX: number,
  minuteY: number,
  rxX?: number,
  rxY?: number,
) {
  return {
    symbol: fromAlmuten(symbolX, symbolY),
    degree: fromAlmuten(degreeX, degreeY),
    sign: fromAlmuten(signX, signY),
    minute: fromAlmuten(minuteX, minuteY),
    rx: rxX === undefined || rxY === undefined ? undefined : fromAlmuten(rxX, rxY),
  }
}

function point(degree: number, radius: number): Point {
  const angle = ((degree - 90) * Math.PI) / 180
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  }
}

function chartGlyphSize(glyph: string) {
  if (glyph === '☽' || glyph === '☊') return 22
  if (glyph === '♈' || glyph === '♆') return 18
  return 20
}

function PlutoGlyphSvg({ x, y, color, size = 17.6 }: { x: number; y: number; color: string; size?: number }) {
  const scale = size / 24

  return (
    <g aria-label="冥王" transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9">
      <circle cx="0" cy="-8.2" r="3.2" />
      <path d="M -7 -2.2 Q 0 5 7 -2.2" />
      <path d="M 0 2.8 V 12" />
      <path d="M -5 8 H 5" />
    </g>
  )
}

export default function NatalChartWheel() {
  const planetPoints = planets.map((planet) => point(planet.degree, rings.aspect))

  return (
    <section className="flex w-[520px] justify-center">
      <svg viewBox="0 0 520 520" className="h-[500px] w-[500px]" role="img" aria-label="本命盘">
        <circle cx={center} cy={center} r={rings.outer} fill="white" stroke="#777" strokeWidth="1.6" />
        <circle cx={center} cy={center} r={rings.zodiac} fill="none" stroke="#777" strokeWidth="1.6" />
        <circle cx={center} cy={center} r={rings.house} fill="none" stroke="#777" strokeWidth="1.4" />
        <circle cx={center} cy={center} r={rings.inner} fill="white" stroke="#777" strokeWidth="1.4" />

        {houseCusps.map((cusp) => (
          <line key={`house-line-${cusp.house}`} x1={cusp.lineInner.x} y1={cusp.lineInner.y} x2={cusp.lineOuter.x} y2={cusp.lineOuter.y} stroke={cusp.house % 3 === 1 ? '#111' : '#888'} strokeWidth={cusp.house % 3 === 1 ? 1.5 : 1} />
        ))}

        {houseCusps.map((cusp) => (
          <g key={`house-cusp-${cusp.house}`}>
            <text x={cusp.glyphPoint.x} y={cusp.glyphPoint.y} fill={cusp.color} className="font-bold" dominantBaseline="middle" fontSize={chartGlyphSize(cusp.glyph)} fontFamily={symbolFontFamily} textAnchor="middle">{cusp.glyph}</text>
            <text x={cusp.degreePoint.x} y={cusp.degreePoint.y} fill="black" className="text-[11px] font-bold" dominantBaseline="middle" fontFamily={symbolFontFamily} textAnchor="middle">{cusp.degree}</text>
            <text x={cusp.minutePoint.x} y={cusp.minutePoint.y} fill="black" className="text-[9px]" dominantBaseline="middle" fontFamily={symbolFontFamily} textAnchor="middle">{cusp.minute}</text>
          </g>
        ))}

        {houseCusps.map((cusp) => (
          <text key={`house-label-${cusp.house}`} x={cusp.label.x} y={cusp.label.y} className="fill-[#555] text-[10px]" dominantBaseline="middle" textAnchor="middle">{cusp.house}</text>
        ))}

        {aspects.map(([from, to, color]) => {
          const start = planetPoints[from]
          const end = planetPoints[to]
          return <line key={`${from}-${to}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={color} strokeWidth="1" opacity="0.78" />
        })}

        {planets.map((planet) => (
          <g key={planet.glyph}>
            {planet.glyph === 'pluto' ? (
              <PlutoGlyphSvg x={planet.label.symbol.x} y={planet.label.symbol.y} color={planet.color} />
            ) : (
              <text x={planet.label.symbol.x} y={planet.label.symbol.y} fill={planet.color} className="font-bold" textAnchor="middle" dominantBaseline="middle" fontSize={chartGlyphSize(planet.glyph)} fontFamily={symbolFontFamily}>{planet.glyph}</text>
            )}
            <text x={planet.label.degree.x} y={planet.label.degree.y} fill="black" className="text-[12px] font-bold" textAnchor="middle" dominantBaseline="middle" fontFamily={symbolFontFamily}>{planet.degreeText}</text>
            <text x={planet.label.sign.x} y={planet.label.sign.y} fill={planet.color} className="font-bold" textAnchor="middle" dominantBaseline="middle" fontSize={chartGlyphSize(planet.signGlyph)} fontFamily={symbolFontFamily}>{planet.signGlyph}</text>
            <text x={planet.label.minute.x} y={planet.label.minute.y} fill="black" className="text-[10px]" textAnchor="middle" dominantBaseline="middle" fontFamily={symbolFontFamily}>{planet.minuteText}</text>
            {planet.rxText && planet.label.rx ? <text x={planet.label.rx.x} y={planet.label.rx.y} fill={planet.color} className="text-[10px] font-bold" textAnchor="middle" dominantBaseline="middle" fontFamily={symbolFontFamily}>{planet.rxText}</text> : null}
          </g>
        ))}

        <text x="260" y="262" className="fill-[#555] text-[18px]" textAnchor="middle">✶</text>
        <text x="260" y="279" className="fill-[#555] text-[11px]" textAnchor="middle">本命盘</text>
      </svg>
    </section>
  )
}
