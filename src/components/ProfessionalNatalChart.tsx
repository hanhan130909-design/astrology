"use client";

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
const CX = SIZE/2, CY = SIZE/2;
const R_ZODIAC_OUT = 222, R_ZODIAC_IN = 199.8;
const R_HOUSE = 99.9, R_INNER = 84.36;
const R_PLANET = R_ZODIAC_OUT + 18;

const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
// almuten uses single-letter codes + element classes
const PLANET_CODES: Record<string,{code:string;element:string;color:string}> = {
  Sun:{code:'Q',element:'air',color:'#d4a017'},
  Moon:{code:'W',element:'earth',color:'#666'},
  Mercury:{code:'E',element:'water',color:'#b8860b'},
  Venus:{code:'R',element:'water',color:'#228b22'},
  Mars:{code:'T',element:'earth',color:'#c00'},
  Jupiter:{code:'Y',element:'water',color:'#d4a017'},
  Saturn:{code:'U',element:'fire',color:'#4169e1'},
  Uranus:{code:'I',element:'air',color:'#4169e1'},
  Neptune:{code:'O',element:'fire',color:'#7b68ee'},
  Pluto:{code:'P',element:'air',color:'#8b4513'},
  North_Node:{code:'‹',element:'water',color:'#666'},
  South_Node:{code:'›',element:'water',color:'#999'},
};
const ELEMENT_COLORS: Record<string,string> = {fire:'#c00',earth:'#228b22',air:'#0028ff',water:'#4169e1'};
const ASPECT_COLORS: Record<string,{color:string}> = {Conjunction:{color:'brown'},Sextile:{color:'#008000'},Square:{color:'red'},Trine:{color:'blue'},Opposition:{color:'red'}};
const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node','South_Node'];

function norm(a:number){return((a%360)+360)%360;}
function lonAngle(lon:number,ascLon:number):number{return(norm(lon-ascLon+180)*Math.PI)/180;}
function lonXY(lon:number,ascLon:number,r:number):{x:number;y:number}{const a=lonAngle(lon,ascLon);return{x:CX+r*Math.cos(a),y:CY-r*Math.sin(a)};}

export default function ProfessionalNatalChart({planets,houses=[],aspects=[],ascendant:ascIn,midheaven:mcIn,size=SIZE,showDegrees=true,showAspectLines=true}:Props){
  const ascLon=typeof ascIn==='number'?ascIn:ascIn?.longitude??(houses[0]?.longitude??0);
  const mcLon=typeof mcIn==='number'?mcIn:mcIn?.longitude??0;

  // Planet data with almuten-style labels
  const planetEntries=PLANET_ORDER.filter(k=>planets?.[k]&&planets[k].longitude!=null).map(k=>{
    const p=planets[k];const lon=norm(p.longitude??0);
    const si=Math.floor(lon/30);const deg=lon%30;
    const code=PLANET_CODES[k]||{code:k[0],element:'air',color:'#666'};
    return{key:k,code:code.code,element:code.element,color:code.color,longitude:lon,degree:deg,sign:si,format:`${Math.floor(deg)}°`,min:`${Math.round((deg%1)*60)}′`,rx:p.retrograde??false};
  }).sort((a,b)=>a.longitude-b.longitude);

  // Planet overlap prevention
  const offsets:Record<string,number>={};
  const clusters:number[][]=[];let cur:number[]=[];
  for(let i=0;i<planetEntries.length;i++){if(cur.length===0){cur.push(i);continue;}const p=planetEntries[cur[cur.length-1]],c=planetEntries[i];const d=norm(c.longitude-p.longitude);if(d<9||360-d<9)cur.push(i);else{clusters.push(cur);cur=[i];}}if(cur.length>0)clusters.push(cur);
  clusters.forEach(c=>{if(c.length<=1){offsets[planetEntries[c[0]].key]=0;return;}const m=Math.floor(c.length/2);c.forEach((idx,r)=>{const l=Math.abs(r-m),d=r<m?-1:1;offsets[planetEntries[idx].key]=d*l*12;});});

  // Planet positions for aspect lines (on the house ring, not outside)
  const planetPts:Record<string,{x:number;y:number}>={};
  planetEntries.forEach(p=>{const r=R_HOUSE+(offsets[p.key]||0)*0.3;planetPts[p.key]=lonXY(p.longitude,ascLon,r);});

  const zMid=(R_ZODIAC_OUT+R_ZODIAC_IN)/2;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[450px] h-[450px]" role="img" aria-label="本命盘">
      {/* Rings */}
      <circle cx={CX} cy={CY} r={R_ZODIAC_OUT} fill="none" stroke="grey" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={R_ZODIAC_IN} fill="none" stroke="grey" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={R_HOUSE} fill="none" stroke="grey" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="grey" strokeWidth="1.5"/>

      {/* Sign boundaries */}
      {SIGN_SYMBOLS.map((_,i)=>{const p1=lonXY(i*30,ascLon,R_ZODIAC_IN),p2=lonXY(i*30,ascLon,R_ZODIAC_OUT);return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ccc" strokeWidth="0.5"/>;})}

      {/* Zodiac glyphs in ring */}
      {SIGN_SYMBOLS.map((s,i)=>{const p=lonXY(i*30+15,ascLon,zMid);const els=['fire','earth','air','water','fire','earth','air','water','fire','earth','air','water'];return<text key={i} x={p.x} y={p.y+5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={ELEMENT_COLORS[els[i]]||'#666'} fontFamily="Apple Symbols,DejaVu Sans,serif">{s}</text>;})}

      {/* House cusp lines */}
      {houses.map((h,i)=>{const isAng=[1,4,7,10].includes(h.house);const p1=lonXY(h.longitude,ascLon,R_INNER),p2=lonXY(h.longitude,ascLon,isAng?R_ZODIAC_OUT:R_HOUSE);return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isAng?'black':'grey'} strokeWidth={isAng?1.25:1}/>;})}

      {/* House numbers */}
      {houses.map((h,i)=>{const nx=houses[(i+1)%houses.length];if(!nx)return null;let ml=h.longitude<nx.longitude?h.longitude+(nx.longitude-h.longitude)/2:h.longitude+(nx.longitude+360-h.longitude)/2;const p=lonXY(ml%360,ascLon,(R_HOUSE+R_INNER)/2);return<text key={i} x={p.x} y={p.y+3} textAnchor="middle" fontSize="10" fill="#666">{h.house}</text>;})}

      {/* House cusp degrees + sign symbols */}
      {showDegrees&&houses.map((h,i)=>{const dv=h.degree!=null?h.degree:(norm(h.longitude)%30);const si=Math.floor(norm(h.longitude)/30);const isAng=[1,4,7,10].includes(h.house);const pdeg=lonXY(h.longitude,ascLon,R_ZODIAC_IN-10);const psym=lonXY(h.longitude,ascLon,R_ZODIAC_IN+12);const els=['fire','earth','air','water','fire','earth','air','water','fire','earth','air','water'];return<g key={'h'+i}>
        <text x={pdeg.x} y={pdeg.y+3} textAnchor="middle" fontSize="8" fill="#666">{Math.floor(dv)}°</text>
        <text x={psym.x} y={psym.y-3} textAnchor="middle" fontSize={isAng?12:9} fill={ELEMENT_COLORS[els[si]]||'#666'} fontFamily="Apple Symbols,DejaVu Sans,serif">{SIGN_SYMBOLS[si]}</text>
        <text x={psym.x} y={psym.y+10} textAnchor="middle" fontSize="7" fill="#888">{Math.round((dv%1)*60)}′</text>
      </g>;})}

      {/* Aspect lines */}
      {showAspectLines&&aspects.map((a,i)=>{if(i>30)return null;const p1=planetPts[a.planet1],p2=planetPts[a.planet2];if(!p1||!p2)return null;const ac=ASPECT_COLORS[a.type||a.aspect];if(!ac)return null;return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={ac.color} strokeWidth="0.5"/>;})}

      {/* ASC/MC */}
      {(()=>{const p=lonXY(ascLon,ascLon,R_ZODIAC_OUT+14);return<text x={p.x} y={p.y+4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#d4a017">ASC</text>;})()}
      {mcLon>0&&(()=>{const p=lonXY(mcLon,ascLon,R_ZODIAC_OUT+14);return<text x={p.x} y={p.y+4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7b68ee">MC</text>;})()}

      {/* Planets — almuten style: outside zodiac ring, code+degree+sign+minute */}
      {planetEntries.map(p=>{
        const o=offsets[p.key]||0;
        const a=lonAngle(p.longitude,ascLon);
        const baseR=R_ZODIAC_OUT+1+Math.abs(o)*0.6;
        const symP=lonXY(p.longitude,ascLon,baseR+15);
        const degP=lonXY(p.longitude,ascLon,baseR+30);
        const signP=lonXY(p.longitude,ascLon,baseR+44);
        const minP=lonXY(p.longitude,ascLon,baseR+58);
        const c=PLANET_CODES[p.key]||{element:'air',color:'#666'};
        return <g key={p.key}>
          {/* Planet symbol/code */}
          <text x={symP.x} y={symP.y+5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={c.color} fontFamily="Apple Symbols,DejaVu Sans,serif">{p.code}</text>
          {/* Degree */}
          <text x={degP.x} y={degP.y+4} textAnchor="middle" fontSize="10" fill="black">{p.format}</text>
          {/* Sign glyph */}
          <text x={signP.x} y={signP.y+4} textAnchor="middle" fontSize="14" fontWeight="bold" fill={ELEMENT_COLORS[['fire','earth','air','water'][p.sign%4]]||'#666'} fontFamily="Apple Symbols,DejaVu Sans,serif">{SIGN_SYMBOLS[p.sign]}</text>
          {/* Minute */}
          <text x={minP.x} y={minP.y+4} textAnchor="middle" fontSize="8" fill="#666">{p.min}</text>
          {/* Retrograde */}
          {p.rx&&<text x={minP.x} y={minP.y+14} textAnchor="middle" fontSize="8" fill="red">R</text>}
        </g>;
      })}
    </svg>
  );
}
