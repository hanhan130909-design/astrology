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
const R_Z_OUT = 222, R_Z_IN = 199.8, R_H = 99.9, R_I = 84.36;

const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const ELEMENT: Record<number,string> = {0:'fire',1:'earth',2:'air',3:'water',4:'fire',5:'earth',6:'air',7:'water',8:'fire',9:'earth',10:'air',11:'water'};
const EL_COLOR: Record<string,string> = {fire:'#c00',earth:'#9a2020',air:'#0028ff',water:'#0a7a19'};
const PLANET_LABELS: Record<string,{code:string;color:string}> = {
  Sun:{code:'Q',color:'#d4a017'},Moon:{code:'W',color:'#666'},Mercury:{code:'E',color:'#b8860b'},
  Venus:{code:'R',color:'#228b22'},Mars:{code:'T',color:'#c00'},Jupiter:{code:'Y',color:'#d4a017'},
  Saturn:{code:'U',color:'#4169e1'},Uranus:{code:'I',color:'#4169e1'},Neptune:{code:'O',color:'#7b68ee'},
  Pluto:{code:'P',color:'#8b4513'},North_Node:{code:'‹',color:'#666'},South_Node:{code:'›',color:'#999'},
};
const ASP_COLORS: Record<string,string> = {Conjunction:'brown',Sextile:'#008000',Square:'red',Trine:'blue',Opposition:'red'};
const PLANET_ORDER = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto','North_Node','South_Node'];

function norm(a:number){return((a%360)+360)%360;}
function a2r(lon:number,asc:number):number{return(norm(lon-asc+60)*Math.PI)/180;}
function xy(lon:number,asc:number,r:number){const a=a2r(lon,asc);return{x:CX+r*Math.cos(a),y:CY-r*Math.sin(a)};}

export default function ProfessionalNatalChart({planets,houses=[],aspects=[],ascendant:ascIn,midheaven:mcIn,showDegrees=true,showAspectLines=true}:Props){
  const ascLon=typeof ascIn==='number'?ascIn:ascIn?.longitude??(houses[0]?.longitude??0);
  const mcLon=typeof mcIn==='number'?mcIn:mcIn?.longitude??0;

  const planetEntries=PLANET_ORDER.filter(k=>planets?.[k]&&planets[k].longitude!=null).map(k=>{
    const p=planets[k];const lon=norm(p.longitude??0);
    const si=Math.floor(lon/30);const deg=lon%30;
    const lbl=PLANET_LABELS[k]||{code:k[0],color:'#666'};
    return{key:k,code:lbl.code,color:lbl.color,longitude:lon,degree:deg,sign:si,degStr:`${Math.floor(deg)}°`,minStr:`${Math.round((deg%1)*60)}\u2032`,rx:p.retrograde??false};
  }).sort((a,b)=>a.longitude-b.longitude);

  // Cluster offsets for outer labels
  const offsets:Record<string,number>={};const clusters:number[][]=[];let cur:number[]=[];
  for(let i=0;i<planetEntries.length;i++){if(cur.length===0){cur.push(i);continue;}const p=planetEntries[cur[cur.length-1]],c=planetEntries[i];const d=norm(c.longitude-p.longitude);if(d<10||360-d<10)cur.push(i);else{clusters.push(cur);cur=[i];}}if(cur.length>0)clusters.push(cur);
  clusters.forEach(c=>{if(c.length<=1){offsets[planetEntries[c[0]].key]=0;return;}const m=Math.floor(c.length/2);c.forEach((idx,r)=>{const l=Math.abs(r-m),d=r<m?-1:1;offsets[planetEntries[idx].key]=d*l*14;});});

  // Planet positions for aspect lines (on house ring)
  const planetPts:Record<string,{x:number;y:number}>={};
  planetEntries.forEach(p=>{const r=R_H+(offsets[p.key]||0)*0.5;planetPts[p.key]=xy(p.longitude,ascLon,r);});

  const zMid=(R_Z_OUT+R_Z_IN)/2;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[450px] h-[450px]" role="img" aria-label="本命盘">
      {/* Rings — exact almuten.net sizes */}
      <circle cx={CX} cy={CY} r={R_Z_OUT} fill="none" stroke="grey" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={R_Z_IN} fill="none" stroke="grey" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={R_H} fill="none" stroke="grey" strokeWidth="1.5"/>
      <circle cx={CX} cy={CY} r={R_I} fill="none" stroke="grey" strokeWidth="1.5"/>

      {/* Sign boundaries */}
      {SIGN_SYMBOLS.map((_,i)=>{const p1=xy(i*30,ascLon,R_Z_IN),p2=xy(i*30,ascLon,R_Z_OUT);return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#ccc" strokeWidth="0.5"/>;})}

      {/* Zodiac glyphs in ring — almuten colors by element */}
      {SIGN_SYMBOLS.map((s,i)=>{const p=xy(i*30+15,ascLon,zMid);const el=ELEMENT[i];return<text key={i} x={p.x} y={p.y+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill={EL_COLOR[el]} fontFamily="Apple Symbols,DejaVu Sans,serif">{s}</text>;})}

      {/* House cusp lines */}
      {houses.map((h,i)=>{const isAng=[1,4,7,10].includes(h.house);const p1=xy(h.longitude,ascLon,R_I),p2=xy(h.longitude,ascLon,isAng?R_Z_OUT:R_H);return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={isAng?'black':'grey'} strokeWidth={isAng?1.25:1}/>;})}

      {/* House numbers */}
      {houses.map((h,i)=>{const nx=houses[(i+1)%houses.length];if(!nx)return null;let ml=h.longitude<nx.longitude?h.longitude+(nx.longitude-h.longitude)/2:h.longitude+(nx.longitude+360-h.longitude)/2;const p=xy(ml%360,ascLon,(R_H+R_I)/2);return<text key={i} x={p.x} y={p.y+3} textAnchor="middle" fontSize="10" fill="#666">{h.house}</text>;})}

      {/* House cusp symbols + degrees — almuten style */}
      {showDegrees&&houses.map((h,i)=>{const dv=h.degree!=null?h.degree:(norm(h.longitude)%30);const si=Math.floor(norm(h.longitude)/30);const pdeg=xy(h.longitude,ascLon,R_Z_IN-8);const psym=xy(h.longitude,ascLon,R_Z_IN+14);const el=ELEMENT[si];return<g key={'h'+i}>
        <text x={pdeg.x} y={pdeg.y+3} textAnchor="middle" fontSize="8" fill="#666">{Math.floor(dv)}°</text>
        <text x={psym.x} y={psym.y+4} textAnchor="middle" fontSize="14" fontWeight="bold" fill={EL_COLOR[el]||'#666'} fontFamily="Apple Symbols,DejaVu Sans,serif">{SIGN_SYMBOLS[si]}</text>
        <text x={psym.x+13} y={psym.y+2} textAnchor="middle" fontSize="7" fill="#888">{Math.round((dv%1)*60)}{'\u2032'}</text>
      </g>;})}

      {/* Aspect lines through center */}
      {showAspectLines&&aspects.map((a,i)=>{if(i>25)return null;const p1=planetPts[a.planet1],p2=planetPts[a.planet2];if(!p1||!p2)return null;const c=ASP_COLORS[a.type||a.aspect];if(!c)return null;return<line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={c} strokeWidth="0.5"/>;})}

      {/* ASC / MC text markers */}
      <text x={xy(ascLon,ascLon,R_Z_OUT+14).x} y={xy(ascLon,ascLon,R_Z_OUT+14).y+4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#d4a017">ASC</text>
      {mcLon>0&&<text x={xy(mcLon,ascLon,R_Z_OUT+14).x} y={xy(mcLon,ascLon,R_Z_OUT+14).y+4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7b68ee">MC</text>}

      {/* Planets — almuten style: outside zodiac ring with codes */}
      {planetEntries.map(p=>{
        const o=offsets[p.key]||0;
        const baseR=184+Math.abs(o)*0.7;
        const sP=xy(p.longitude,ascLon,baseR-4);
        const dP=xy(p.longitude,ascLon,baseR+13);
        const gP=xy(p.longitude,ascLon,baseR+30);
        const mP=xy(p.longitude,ascLon,baseR+45);
        return<g key={p.key}>
          <text x={sP.x} y={sP.y+5} textAnchor="middle" fontSize="13" fontWeight="bold" fill={p.color} fontFamily="Apple Symbols,DejaVu Sans,serif">{p.code}</text>
          <text x={dP.x} y={dP.y+4} textAnchor="middle" fontSize="10" fill="black">{p.degStr}</text>
          <text x={gP.x} y={gP.y+4} textAnchor="middle" fontSize="14" fontWeight="bold" fill={EL_COLOR[ELEMENT[p.sign]]||'#666'} fontFamily="Apple Symbols,DejaVu Sans,serif">{SIGN_SYMBOLS[p.sign]}</text>
          <text x={mP.x} y={mP.y+4} textAnchor="middle" fontSize="8" fill="#666">{p.minStr}</text>
          {p.rx&&<text x={mP.x} y={mP.y+14} textAnchor="middle" fontSize="8" fill="red">R</text>}
        </g>;
      })}
    </svg>
  );
}
