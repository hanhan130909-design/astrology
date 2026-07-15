#!/usr/bin/env python3
"""Animated TikTok video — 24fps, text animations, dynamic backgrounds"""

import subprocess, os, json, tempfile, shutil, math

FPS = 24
W, H = 1080, 1920
OUT_DIR = os.path.expanduser("~/Downloads/tiktok_videos")
os.makedirs(OUT_DIR, exist_ok=True)

def tts(text, out_mp3, voice="en-US-JennyNeural"):
    subprocess.run(["edge-tts","--voice",voice,"--text",text,"--write-media",out_mp3],
                   capture_output=True, timeout=60)
    return out_mp3

def render_frame(card_text, subtitle_text, out_png, frame, total_frames, card_idx, total_cards,
                 bg_color="#1a1a2e", accent="#7B68EE"):
    """Render one frame at 24fps with animations"""
    progress = frame / max(1, total_frames - 1)  # 0 to 1

    # Animate background gradient
    bg_shift = math.sin(progress * math.pi * 3) * 0.1
    bg_top = f"#{int(26*(1+bg_shift)):02x}{int(26*(1+bg_shift*0.8)):02x}{int(46*(1+bg_shift*0.5)):02x}"
    bg_bot = "#0d0d1a"

    # Card animation: scale + fade
    card_start = card_idx / max(1, total_cards)
    card_progress = max(0, min(1, (progress - card_start) * 4))  # fast animation over 0.25s
    scale = 0.7 + 0.3 * card_progress  # scale from 0.7 to 1.0
    fade = card_progress
    # Slight wobble/bounce at the end
    bounce = 1 + (1 - card_progress) * 0.05 * max(0, 1 - abs(card_progress - 0.8) * 5)
    scale *= bounce

    # Subtitle animation: reveals word by word in sync
    words = subtitle_text.split()
    word_count = len(words)
    sub_fade = 0.85

    # Particle-like star dots background
    stars = ""
    for i in range(15):
        sx = int((hash(f"{frame}_{i}") % 10000) / 10000 * W)
        sy = int((hash(f"{i}_{frame*2}") % 10000) / 10000 * H)
        sr = 1 + (hash(f"{frame}_{i}_{frame}") % 10) / 10
        so = 0.15 + (hash(f"{frame}") % 50) / 100 * 0.2
        stars += f'<circle cx="{sx}" cy="{sy}" r="{sr}" fill="white" opacity="{so}"/>'

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="{bg_top}"/>
        <stop offset="1" stop-color="{bg_bot}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="60%">
        <stop offset="0" stop-color="{accent}" stop-opacity="{0.08 + fade * 0.12}"/>
        <stop offset="1" stop-color="{accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="{W}" height="{H}" fill="url(#bg)"/>
    <rect width="{W}" height="{H}" fill="url(#glow)"/>
    {stars}
    <g transform="translate({W/2},{H/2}) scale({scale})" opacity="{fade:.2f}">
      <text x="0" y="-40" font-family="PingFang SC, sans-serif" font-size="68" font-weight="900"
            fill="{accent}" text-anchor="middle">{card_text}</text>
      <text x="0" y="30" font-family="PingFang SC, sans-serif" font-size="42" font-weight="600"
            fill="white" text-anchor="middle" opacity="{sub_fade:.2f}">{subtitle_text}</text>
    </g>
    <text x="{W/2}" y="{H-90}" font-family="PingFang SC, sans-serif" font-size="30" fill="white"
          text-anchor="middle" opacity="0.5">lunaxstar.com</text>
    </svg>'''

    js = f"""const sharp=require('sharp');sharp(Buffer.from({json.dumps(svg)})).png().toFile({json.dumps(out_png)}).then(()=>console.log('ok')).catch(e=>console.error(e));"""
    subprocess.run(["node","-e",js], capture_output=True, timeout=10)

def generate_video(cards, output_name):
    """cards: list of (main_text, subtitle_text) tuples — each is one visual card"""
    frames_dir = tempfile.mkdtemp()
    
    # Full script for TTS
    full_script = ". ".join([m for m, _ in cards]) + "."
    audio_path = os.path.join(frames_dir, "audio.mp3")
    tts(full_script, audio_path)
    
    result = subprocess.run(["ffprobe","-v","quiet","-print_format","json","-show_format",audio_path],
                          capture_output=True, text=True, timeout=10)
    duration = float(json.loads(result.stdout)["format"]["duration"])
    total_frames = int(duration * FPS)
    
    frames = []
    for f in range(total_frames):
        progress = f / max(1, total_frames - 1)
        card_idx = min(int(progress * len(cards)), len(cards) - 1)
        fn = os.path.join(frames_dir, f"frame_{f:06d}.png")
        render_frame(cards[card_idx][0], cards[card_idx][1], fn, f, total_frames, card_idx, len(cards))
        frames.append(fn)
    
    out_mp4 = os.path.join(OUT_DIR, f"{output_name}.mp4")
    
    # Use concat to build video from frames at 24fps
    img_list = os.path.join(frames_dir, "img_list.txt")
    with open(img_list, "w") as fh:
        for fn in frames:
            fh.write(f"file '{fn}'\n")
            fh.write(f"duration {1/FPS}\n")
    
    subprocess.run([
        "ffmpeg","-y",
        "-f","concat","-safe","0","-i",img_list,
        "-i",audio_path,
        "-c:v","libx264","-pix_fmt","yuv420p",
        "-c:a","aac","-shortest",
        "-movflags","+faststart",
        out_mp4
    ], capture_output=True, timeout=120)
    
    shutil.rmtree(frames_dir, ignore_errors=True)
    
    if os.path.exists(out_mp4):
        size_mb = os.path.getsize(out_mp4) / 1024 / 1024
        print(f"✅ {output_name}.mp4 ({size_mb:.1f}MB, {duration:.0f}s)")
        return out_mp4
    else:
        print(f"❌ Failed: {output_name}")
        return None

# ─── TikTok script with animated cards ───
cards_wealth = [
    ("These 4 signs", "are secretly wealthy 💰"),
    ("Taurus", "builds wealth in silence 🐂"),
    ("Capricorn", "treats money like a long game 📈"),
    ("Virgo", "budgets in their sleep 😴"),
    ("Scorpio", "knows secrets you don't 🦂"),
    ("Which one are you?", "Comment your sign below 👇"),
]

generate_video(cards_wealth, "wealth_signs_animated")

cards_free = [
    ("Stop paying", "for birth chart readings 💸"),
    ("Go to", "lunaxstar.com ✨"),
    ("Free natal chart", "plus BaZi reading 🎴"),
    ("No signup", "8 languages 🌏"),
    ("Link in bio", "Get yours now 🔮"),
]

generate_video(cards_free, "free_chart_animated")

print(f"\nDone! Videos in {OUT_DIR}")
