"use client";

type Point = { x: number; y: number };

interface Props {
  planets?: Record<string, any>;
  houses?: any[];
  aspects?: any[];
  ascendant?: number | { longitude: number };
  midheaven?: number | { longitude: number };
  size?: number;
  showDegrees?: boolean;
  showAspectLines?: boolean;
}

const SIZE = 450;
const CX = SIZE / 2, CY = SIZE / 2;
const R_ZODIAC_OUT = 222, R_ZODIAC_IN = 199.8;
const R_HOUSE = 99.9, R_INNER = 84.36;
const R_PLANET = R_HOUSE;

const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const PLANET_SYMBOLS: Record<string,string> = {Sun:'☉',Moon:'☽',Mercury:'☿',Venus:'♀',Mars:'♂',Jupiter:'♃',Saturn:'♄',Uranus:'♅',Neptune:'♆',Pluto:'♇',North_Node:'☊',South_Node:'☋'};
const PLANET_COLORS: Record<string,string> = {Sun:'#d4a017',Moon:'#666',Mercury:'#b8860b',Venus:'#228b22',Mars:'#c00',Jupiter:'#d4a017',Saturn:'#556b2f',Uranus:'#4169e1',Neptune:'#7b68ee',Pluto:'#8b4513',North_Node:'#666',South_Node:'#999'};
const ASPECT_STYLES: Record<string,{color:string;width:number;opacity:number;dash?:string}> = {Conjunction:{color:'#8b4513',width:1,opacity:0.7},Sextile:{color:'#228b22',width:0.8,opacity:0.55,dash:'4 3'},Square:{color:'#c00',width:1,opacity:0.65},Trine:{color:'#228b22',width:1,opacity:0.6},Opposition:{color:'#c00',width:1,opacity:0.65,dash:'6 3'}};
const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node','South_Node'];

function norm(a:number){return((a%360)+360)%360;}
function lonAngle(lon:number,ascLon:number):number{return(norm(lon-ascLon+180)*Math.PI)/180;}
function lonXY(lon:number,ascLon:number,r:number):Point{const a=lonAngle(lon,ascLon);return{x:CX+r*Math.cos(a),y:CY-r*Math.sin(a)};}

function PlutoGlyph({x,y,color,size=16}:{x:number;y:number;color:string;size?:number}){
  const s=size/24;
  return <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
    <circle cx="0" cy="-8.2" r="3.2"/><path d="M -7 -2.2 Q 0 5 7 -2.2"/><path d="M 0 2.8 V 12"/><path d="M -5 8 H 5"/>
  </g>;
}

export default function ProfessionalNatalChart({planets,houses=[],aspects=[],ascendant:ascIn,midheaven:mcIn,size=SIZE,showDegrees=true,showAspectLines=true}:Props){
  const ascLon=typeof ascIn==='number'?ascIn:ascIn?.longitude??(houses[0]?.longitude??0);
  const mcLon=typeof mcIn==='number'?mcIn:mcIn?.longitude??0;

  // Planet data
  const planetEntries=PLANET_ORDER.filter(k=>planets?.[k]&&!planets[k].error&&planets[k].longitude!=null).map(k=>{const p=planets[k];return{key:k,glyph:PLANET_SYMBOLS[k]||p.planetSymbol||k[0],color:PLANET_COLORS[k]||'#555',longitude:p.longitude,degree:p.degree??(norm(p.longitude)%30),rx:p.retrograde??false};}).sort((a,b)=>a.longitude-b.longitude);

  // Cluster offsets
  const offsets:Record<string,number>={};
  const clusters:number[][]=[];let cur:number[]=[];
  for(let i=0;i<planetEntries.length;i++){if(cur.length===0){cur.push(i);continue;}const p=planetEntries[cur[cur.length-1]],c=planetEntries[i];const d=norm(c.longitude-p.longitude);if(d<9||360-d<9)cur.push(i);else{clusters.push(cur);cur=[i];}}if(cur.length>0)clusters.push(cur);
  clusters.forEach(c=>{if(c.length<=1){offsets[planetEntries[c[0]].key]=0;return;}const m=Math.floor(c.length/2);c.forEach((idx,r)=>{const l=Math.abs(r-m),d=r<m?-1:1;offsets[planetEntries[idx].key]=d*l*9;});});

  const planetPts:Record<string,Point>={};planetEntries.forEach(p=>{planetPts[p.key]=lonXY(p.longitude,ascLon,R_PLANET+(offsets[p.key]||0));});

  // Zodiac ring mid
  const zMid=(R_ZODIAC_OUT+R_ZODIAC_IN)/2;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[450px] h-[450px]" role="img" aria-label="本命盘">
      <defs><radialGradient id="abg" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#fff"/><stop offset="60%" stopColor="#fafafa"/><stop offset="100%" stopColor="#f0f0f0"/></radialGradient></defs>

      <circle cx={CX} cy={CY} r={R_ZODIAC_OUT} fill="url(#abg)" stroke="grey" strokeWidth="1"/>

      {/* Zodiac ring segments */}
      {SIGN_SYMBOLS.map((_,i)=>{const sa=lonAngle(i*30,ascLon),ea=lonAngle((i+1)*30,ascLon);const la=((ea-sa+2*Math.PI)%(2*Math.PI)>Math.PI?1:0);const p1=lonXY(i*30,ascLon,R_ZODIAC_OUT),p2=lonXY((i+1)*30,ascLon,R_ZODIAC_OUT),p3=lonXY((i+1)*30,ascLon,R_ZODIAC_IN),p4=lonXY(i*30,ascLon,R_ZODIAC_IN);return<path key={i} d={`M${p1.x} ${p1.y} A${R_ZODIAC_OUT} ${R_ZODIAC_OUT} 0 ${la} 0 ${p2.x} ${p2.y} L${p3.x} ${p3.y} A${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 ${la} 1 ${p4.x} ${p4.y} Z`} fill={['#ff6b6b','#4ecdc4','#ffe66d','#95e1d3','#f38181','#aa96da','#fcbad3','#6c5ce7','#fda7df','#a8d8ea','#7c3aed','#0ea5e9'][i]} opacity={0.07}/>;})}

      <circle cx={CX} cy={CY} r={R_ZODIAC_OUT} fill="none" stroke="grey" strokeWidth="0.8"/>
      <circle cx={CX} cy={CY} r={R_ZODIAC_IN} fill="none" stroke="grey" strokeWidth="0.6"/>
      <circle cx={CX} cy={CY} r={R_HOUSE} fill="none" stroke="grey" strokeWidth="0.6"/>
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="grey" strokeWidth="0.6"/>

      {/* Sign boundaries */}
      {SIGN_SYMBOLS.map((_,i)=>{const p1=lonXY(i*30,ascLon,R_ZODIAC_IN),p2=lonXY(i*30,ascLon,R_ZODIAC_OUT);return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#bbb" strokeWidth="0.5"/>;})}

      {/* Zodiac symbols */}
      {SIGN_SYMBOLS.map((s,i)=>{const p=lonXY(i*30+15,ascLon,zMid);return<text key={i} x={p.x} y={p.y+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill={['#c00','#9a2020','#0028ff','#0a7a19','#c00','#9a2020','#0028ff','#0a7a19','#c00','#9a2020','#0028ff','#0a7a19'][i]} fontFamily="Apple Symbols,DejaVu Sans,serif">{s}</text>;})}

      {/* House cusp lines */}
      {houses.map((h,i)=>{const isAng=[1,4,7,10].includes(h.house);const p1=lonXY(h.longitude,ascLon,R_INNER),p2=lonXY(h.longitude,ascLon,isAng?R_ZODIAC_OUT:R_HOUSE);return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isAng?'#333':'#aaa'} strokeWidth={isAng?1.2:0.6} strokeDasharray={isAng?'none':'3 2'}/>;})}

      {/* House numbers */}
      {houses.map((h,i)=>{const nx=houses[(i+1)%houses.length];if(!nx)return null;let ml=h.longitude<nx.longitude?h.longitude+(nx.longitude-h.longitude)/2:h.longitude+(nx.longitude+360-h.longitude)/2;const p=lonXY(ml%360,ascLon,(R_HOUSE+R_INNER)/2);const isAng=[1,4,7,10].includes(h.house);return<text key={i} x={p.x} y={p.y+4} textAnchor="middle" fontSize={isAng?'12':'10'} fontWeight={isAng?'bold':'normal'} fill={isAng?'#333':'#999'}>{h.house}</text>;})}

      {/* House cusp degrees */}
      {showDegrees&&houses.map((h,i)=>{const dv=h.degree!=null?h.degree:(norm(h.longitude)%30);const p=lonXY(h.longitude,ascLon,R_INNER-10);return<text key={'hd'+i} x={p.x} y={p.y+3} textAnchor="middle" fontSize="7" fill="#666">{Math.floor(dv)}°</text>;})}

      {/* House cusp sign symbols */}
      {houses.map((h,i)=>{const si=Math.floor(norm(h.longitude)/30);const p2=lonXY(h.longitude,ascLon,R_HOUSE-12);const isAng=[1,4,7,10].includes(h.house);return isAng?<text key={'hs'+i} x={p2.x} y={p2.y+4} textAnchor="middle" fontSize="10" fontWeight="bold" fill={['#c00','#9a2020','#0028ff','#0a7a19','#c00','#9a2020','#0028ff','#0a7a19','#c00','#9a2020','#0028ff','#0a7a19'][si]} fontFamily="Apple Symbols,DejaVu Sans,serif">{SIGN_SYMBOLS[si]}</text>:null;})}

      {/* Aspect lines — pass through center */}
      {showAspectLines&&aspects.map((a,i)=>{if(i>25)return null;const p1=planetPts[a.planet1],p2=planetPts[a.planet2];if(!p1||!p2)return null;const s=ASPECT_STYLES[a.type||a.aspect];if(!s)return null;return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={s.color} strokeWidth={s.width} strokeOpacity={s.opacity} strokeDasharray={s.dash||'none'}/>;})}

      {/* ASC marker */}
      {(()=>{const p=lonXY(ascLon,ascLon,R_ZODIAC_OUT+12);return<text x={p.x} y={p.y+4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#d4a017">ASC</text>;})()}
      {/* MC marker */}
      {mcLon>0&&(()=>{const p=lonXY(mcLon,ascLon,R_ZODIAC_OUT+12);return<text x={p.x} y={p.y+4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7b68ee">MC</text>;})()}

      {/* Planets */}
      {planetEntries.map(p=>{const o=offsets[p.key]||0;const a=lonAngle(p.longitude,ascLon);const pos={x:CX+(R_PLANET+o)*Math.cos(a),y:CY-(R_PLANET+o)*Math.sin(a)};return<g key={p.key}>
        <circle cx={pos.x} cy={pos.y} r="10" fill="white" stroke={p.color} strokeWidth="1"/>
        {p.key==='Pluto'?<PlutoGlyph x={pos.x} y={pos.y} color={p.color} size={14}/>:<text x={pos.x} y={pos.y+4} textAnchor="middle" fontSize="11" fontWeight="bold" fill={p.color} fontFamily="Apple Symbols,DejaVu Sans,serif">{p.glyph}</text>}
        {p.rx&&<text x={pos.x+11} y={pos.y-7} fontSize="7" fontWeight="bold" fill="#c00">R</text>}
      </g>;})}

      {/* Center circle */}
      <circle cx={CX} cy={CY} r={R_INNER-10} fill="white" stroke="#ccc" strokeWidth="0.8"/>
      <text x={CX} y={CY-2} textAnchor="middle" fontSize="18" fill="#d4a017">✦</text>
      <text x={CX} y={CY+11} textAnchor="middle" fontSize="7" fill="#999" letterSpacing="2">本命盘</text>
    </svg>
  );
}
