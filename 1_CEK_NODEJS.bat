@echo off
chcp 65001 >nul
TITLE Cek Status Node.js
COLOR 0E
CLS

ECHO.
ECHO ╔═══════════════════════════════════════════════════════════╗
ECHO ║   CEK INSTALASI NODE.JS                                   ║
ECHO ╚═══════════════════════════════════════════════════════════╝
ECHO.

ECHO [1] Mengecek Node.js...
ECHO.

node -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    COLOR 0A
    ECHO ✓ Node.js TERDETEKSI!
    ECHO.
    node -v
    ECHO.
    ECHO ✓ npm TERDETEKSI!
    ECHO.
    npm -v
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   STATUS: SIAP MENJALANKAN SERVER
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO Langkah selanjutnya:
    ECHO 1. Tutup jendela ini
    ECHO 2. Double-click file: MULAI_SERVER.bat
    ECHO.
) ELSE (
    COLOR 0C
    ECHO ✗ Node.js TIDAK TERDETEKSI!
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   ANDA HARUS INSTALL NODE.JS TERLEBIH DAHULU
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO Cara install:
    ECHO 1. Buka browser
    ECHO 2. Kunjungi: https://nodejs.org/
    ECHO 3. Download versi LTS (Long Term Support)
    ECHO 4. Install dengan klik Next-Next-Finish
    ECHO 5. RESTART KOMPUTER setelah install
    ECHO 6. Jalankan file ini lagi untuk cek
    ECHO.
)

PAUSE
