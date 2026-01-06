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
ECHO [INFO] Memulai server...
ECHO.
ECHO ┌───────────────────────────────────────────────────────────┐
ECHO │ JANGAN TUTUP JENDELA INI!                                 │
ECHO │                                                            │
ECHO │ Tunggu sampai muncul tulisan:                             │
ECHO │   "Local: http://localhost:3000/"                         │
ECHO │                                                            │
ECHO │ Kemudian buka browser dan akses:                          │
ECHO │   http://localhost:3000/webgis                            │
ECHO └───────────────────────────────────────────────────────────┘
ECHO.
ECHO [INFO] Menjalankan npm run dev...
ECHO.

npm run dev

ECHO.
ECHO [INFO] Server telah berhenti.
PAUSE
