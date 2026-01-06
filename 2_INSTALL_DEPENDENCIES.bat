@echo off
chcp 65001 >nul
TITLE Install Dependencies
COLOR 0B
CLS

ECHO.
ECHO ╔═══════════════════════════════════════════════════════════╗
ECHO ║   INSTALL DEPENDENCIES (HANYA SEKALI)                     ║
ECHO ╚═══════════════════════════════════════════════════════════╝
ECHO.

IF EXIST "node_modules" (
    COLOR 0A
    ECHO ✓ Dependencies sudah terinstall!
    ECHO.
    ECHO Folder node_modules sudah ada.
    ECHO Anda bisa langsung menjalankan server.
    ECHO.
    ECHO Langkah selanjutnya:
    ECHO - Double-click file: 3_MULAI_SERVER.bat
    ECHO.
    PAUSE
    EXIT
)

ECHO [INFO] Folder node_modules tidak ditemukan.
ECHO [INFO] Memulai instalasi dependencies...
ECHO.
ECHO ┌───────────────────────────────────────────────────────────┐
ECHO │ PROSES INI BISA MEMAKAN WAKTU 5-15 MENIT                  │
ECHO │ Akan muncul banyak tulisan - ini NORMAL                   │
ECHO │ JANGAN TUTUP jendela ini sampai selesai!                  │
ECHO └───────────────────────────────────────────────────────────┘
ECHO.

npm install

IF %ERRORLEVEL% EQU 0 (
    COLOR 0A
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   ✓ INSTALASI BERHASIL!
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO Langkah selanjutnya:
    ECHO - Double-click file: 3_MULAI_SERVER.bat
    ECHO.
) ELSE (
    COLOR 0C
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   ✗ INSTALASI GAGAL!
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO Kemungkinan penyebab:
    ECHO - Koneksi internet bermasalah
    ECHO - Node.js belum terinstall dengan benar
    ECHO.
    ECHO Solusi:
    ECHO 1. Cek koneksi internet
    ECHO 2. Jalankan file: 1_CEK_NODEJS.bat
    ECHO 3. Coba lagi
    ECHO.
)

PAUSE
