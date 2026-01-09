@echo off
chcp 65001 >nul
TITLE Build Project untuk Production
COLOR 0B
CLS

ECHO.
ECHO ╔═══════════════════════════════════════════════════════════╗
ECHO ║   BUILD PROJECT UNTUK PRODUCTION                          ║
ECHO ╚═══════════════════════════════════════════════════════════╝
ECHO.

ECHO [INFO] Memulai build process...
ECHO.
ECHO Ini akan:
ECHO 1. Compile semua kode TypeScript
ECHO 2. Bundle semua file JavaScript
ECHO 3. Optimize CSS dengan Tailwind
ECHO 4. Compress assets
ECHO 5. Generate production-ready files di folder 'dist'
ECHO.
ECHO Tunggu 1-3 menit...
ECHO.

call npm run build

IF %ERRORLEVEL% EQU 0 (
    COLOR 0A
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   ✓ BUILD BERHASIL!
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO File production tersimpan di folder: dist/
    ECHO.
    ECHO Langkah selanjutnya:
    ECHO - Untuk preview lokal: npm run preview
    ECHO - Untuk deploy ke Vercel: jalankan DEPLOY_VERCEL.bat
    ECHO.
) ELSE (
    COLOR 0C
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   ✗ BUILD GAGAL!
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO Kemungkinan penyebab:
    ECHO - Ada error di kode TypeScript
    ECHO - Dependencies belum terinstall lengkap
    ECHO - File yang dibutuhkan hilang
    ECHO.
    ECHO Solusi:
    ECHO 1. Baca error message di atas
    ECHO 2. Perbaiki error yang disebutkan
    ECHO 3. Coba lagi
    ECHO.
    ECHO Jika masih error, jalankan:
    ECHO   npm install
    ECHO Lalu coba build lagi.
    ECHO.
)

PAUSE
