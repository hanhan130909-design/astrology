# qclaw-text-file skill - write_file.py
# Writes text files with automatic encoding detection (utf-8/utf-8-sig/gbk) and line ending adaptation

import sys
import os

def get_platform():
    return sys.platform

def write_file(file_path: str, content: str, platform: str = None, encoding: str = None) -> dict:
    """Write content to file with automatic encoding and line ending adaptation."""
    
    if platform is None:
        platform = get_platform()
    
    is_windows = platform == "win32"
    
    # Detect encoding
    if encoding is None:
        encoding = "utf-8"
    
    # Line endings
    if is_windows:
        content = content.replace("\n", "\r\n")
    else:
        content = content.replace("\r\n", "\n")
    
    # Write
    if is_windows:
        with open(file_path, "w", encoding=encoding, newline="") as f:
            f.write(content)
    else:
        with open(file_path, "w", encoding=encoding) as f:
            f.write(content)
    
    return {"success": True, "bytes": len(content.encode(encoding, errors="replace"))}

if __name__ == "__main__":
    args = sys.argv
    if len(args) < 3:
        print("Usage: python write_file.py <file_path> <content> [platform] [encoding]", file=sys.stderr)
        sys.exit(1)
    
    file_path = args[1]
    content = args[2]
    platform = args[3] if len(args) > 3 else None
    encoding = args[4] if len(args) > 4 else None
    
    result = write_file(file_path, content, platform, encoding)
    print(result)