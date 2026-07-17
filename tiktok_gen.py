#!/usr/bin/env python3
"""Bold zodiac card TikTok generator — large symbols, minimal design, popular format"""
import subprocess, os, json, tempfile, math, shutil

FPS, W, H = 24, 1080, 1920
OUT = os.path.expanduser("~/Downloads/tiktok_videos")
os.makedirs(OUT, exist_ok=True)

SYMBOLS = {"aries":"♈","taurus":"♉","gemini":"♊","cancer":"♋","leo":"♌","virgo":"♍","libra":"♎","scorpio":"♏","sagittarius":"♐","capricorn":"♑","aquarius":"♒","pisces":"♓"}
ELEM = {"fire":["aries","leo","sagittarius"],"earth":["taurus","virgo","capricorn"],"air":["gemini","libra","aquarius"],"water":["cancer","scorpio","pisces"]}
COLORS = {"fire":("#1a0505","#FF4500","#FF8C00"),"earth":("#0a1a0a","#228B22","#90EE90"),"air":("#0a0a2a","#9370DB","#E6E6FA"),"water":("#051525","#1E90FF","#00CED1")}

def element(sign):
    for e, signs in ELEM.items():
        if sign in signs: return e
    return "air"

def tts(text, out_mp3):
    subprocess.run(["edge-tts","--voice","en-US-JennyNeural","--text",text,"--write-media",out_mp3], capture_output=True, timeout=60)

def make_video(cards, sign, name):
    tmp = tempfile.mkdtemp()
    e = element(sign)
    bg, sym_c, glow = COLORS[e]
    symbol = SYMBOLS.get(sign, "✨")
    
    script = ". ".join([f"{c[0]} {c[1]}" for c in cards]) + "."
    audio = os.path.join(tmp, "audio.mp3")
    tts(script, audio)
    
    r = subprocess.run(["ffprobe","-v","quiet","-print_format","json","-show_format",audio], capture_output=True, text=True, timeout=10)
    dur = float(json.loads(r.stdout)["format"]["duration"])
    tf = max(len(cards) * FPS, int(dur * FPS))
    
    cx, cy = W/2, H/2
    for f in range(tf):
        p = f / max(1, tf-1)
        ci = min(int(p * len(cards)), len(cards)-1)
        card = cards[ci]
        fade = min(1.0, p * 3)
        
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{bg}"/><stop offset="1" stop-color="#000000"/></linearGradient><radialGradient id="glow" cx="50%" cy="40%" r="55%"><stop offset="0" stop-color="{glow}" stop-opacity="0.3"/><stop offset="1" stop-color="{glow}" stop-opacity="0"/></radialGradient></defs><rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#glow)"/><text x="{cx}" y="{cy-180}" font-family="sans-serif" font-size="500" font-weight="900" fill="{sym_c}" text-anchor="middle" opacity="0.10">{symbol}</text><g transform="translate({cx},{cy+100})" opacity="{fade:.2f}"><text x="0" y="0" font-family="PingFang SC, sans-serif" font-size="86" font-weight="900" fill="white" text-anchor="middle">{card[0]}</text><text x="0" y="90" font-family="PingFang SC, sans-serif" font-size="50" font-weight="700" fill="{glow}" text-anchor="middle">{card[1]}</text></g><text x="{cx}" y="280" font-family="sans-serif" font-size="22" fill="{sym_c}" text-anchor="middle" opacity="0.6" letter-spacing="10">{e.upper()} SIGNS</text><text x="{cx}" y="{H-70}" font-family="PingFang SC, sans-serif" font-size="30" fill="white" text-anchor="middle" opacity="0.4">lunaxstar.com</text></svg>'
        
        fn = os.path.join(tmp, f"f{f:06d}.png")
        js = f'const sharp=require("sharp");sharp(Buffer.from({json.dumps(svg)})).png().toFile({json.dumps(fn)}).then(()=>console.log("ok")).catch(e=>console.error(e));'
        subprocess.run(["node","-e",js], capture_output=True, timeout=10)
    
    il = os.path.join(tmp, "list.txt")
    with open(il, "w") as fh:
        for i in range(tf):
            fh.write(f"file '{os.path.join(tmp, f'f{i:06d}.png')}'\n")
            fh.write(f"duration {1/FPS}\n")
    
    out = os.path.join(OUT, f"{name}.mp4")
    subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",il,"-i",audio,"-c:v","libx264","-pix_fmt","yuv420p","-c:a","aac","-shortest","-movflags","+faststart",out], capture_output=True, timeout=180)
    shutil.rmtree(tmp, ignore_errors=True)
    if os.path.exists(out):
        print(f"✅ {name}.mp4 ({os.path.getsize(out)//1024}KB, {dur:.0f}s)")

# Quick test
make_video([
    ("4 Zodiac Signs","Secretly WEALTHY 💰"),
    ("Taurus ♉","Silent wealth builder"),
    ("Virgo ♍","Budgets in their sleep"),
    ("Capricorn ♑","Long-game money player"),
    ("Scorpio ♏","Knows what others don't"),
    ("You?","Comment your sign 👇"),
], "taurus", "taurus_bold")

print(f"\n{OUT}")
