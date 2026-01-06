@echo off
chcp 65001 >nul
TITLE Server WebGIS - PUPR Papua Barat Daya
COLOR 0A
CLS

ECHO.
ECHO ╔═══════════════════════════════════════════════════════════╗
ECHO ║   SERVER WEBGIS - PUPR PAPUA BARAT DAYA                  ║
ECHO ╚═══════════════════════════════════════════════════════════╝
ECHO.

REM Cek node_modules
IF NOT EXIST "node_modules" (
    COLOR 0C
    ECHO ✗ Dependencies belum terinstall!
    ECHO.
    ECHO Anda harus menjalankan file ini terlebih dahulu:
    ECHO   2_INSTALL_DEPENDENCIES.bat
    ECHO.
    PAUSE
    EXIT
)

ECHO [INFO] Memulai server development...
ECHO.
ECHO ┌───────────────────────────────────────────────────────────┐
ECHO │ ⚠️  JANGAN TUTUP JENDELA INI SELAMA MENGGUNAKAN WEBGIS!  │
ECHO │                                                            │
ECHO │ Tunggu sampai muncul tulisan:                             │
ECHO │   "Local: http://localhost:3000/"                         │
ECHO │                                                            │
ECHO │ Kemudian:                                                  │
ECHO │ 1. Buka browser (Chrome/Edge)                             │
ECHO │ 2. Ketik: http://localhost:3000/webgis                    │
ECHO │ 3. Tekan Enter                                             │
ECHO │                                                            │
ECHO │ Untuk menghentikan server: Tekan Ctrl+C                   │
ECHO └───────────────────────────────────────────────────────────┘
ECHO.
ECHO [INFO] Menjalankan: npm run dev
ECHO.
ECHO ════════════════════════════════════════════════════════════
ECHO.

npm run dev

ECHO.
ECHO ════════════════════════════════════════════════════════════
ECHO [INFO] Server telah dihentikan.
ECHO ════════════════════════════════════════════════════════════
ECHO.
PAUSE
