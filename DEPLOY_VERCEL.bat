@echo off
chcp 65001 >nul
TITLE Deploy ke Vercel
COLOR 0B
CLS

ECHO.
ECHO ╔═══════════════════════════════════════════════════════════╗
ECHO ║   DEPLOY WEBGIS KE VERCEL                                 ║
ECHO ╚═══════════════════════════════════════════════════════════╝
ECHO.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0E
    ECHO [!] Vercel CLI belum terinstall
    ECHO.
    ECHO Menginstall Vercel CLI...
    ECHO (Ini akan memakan waktu beberapa menit)
    ECHO.
    call npm install -g vercel
    
    IF %ERRORLEVEL% NEQ 0 (
        COLOR 0C
        ECHO.
        ECHO ✗ Gagal menginstall Vercel CLI
        ECHO.
        ECHO Solusi:
        ECHO 1. Pastikan npm sudah terinstall
        ECHO 2. Jalankan CMD sebagai Administrator
        ECHO 3. Coba manual: npm install -g vercel
        ECHO.
        PAUSE
        EXIT
    )
)

COLOR 0A
ECHO ✓ Vercel CLI terdeteksi
ECHO.

ECHO ════════════════════════════════════════════════════════════
ECHO   LANGKAH DEPLOYMENT
ECHO ════════════════════════════════════════════════════════════
ECHO.
ECHO 1. Anda akan diminta login ke Vercel
ECHO 2. Browser akan terbuka - login dengan GitHub/Email
ECHO 3. Kembali ke terminal ini setelah login
ECHO 4. Ikuti prompts untuk setup project
ECHO.
ECHO Tekan Enter untuk melanjutkan...
PAUSE >nul

ECHO.
ECHO [1/3] Login ke Vercel...
ECHO.
call vercel login

ECHO.
ECHO [2/3] Build project...
ECHO.
call npm run build

IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO.
    ECHO ✗ Build gagal!
    ECHO.
    ECHO Perbaiki error di atas, lalu coba lagi.
    ECHO.
    PAUSE
    EXIT
)

ECHO.
ECHO [3/3] Deploy ke Vercel Production...
ECHO.
call vercel --prod

IF %ERRORLEVEL% EQU 0 (
    COLOR 0A
    ECHO.
    ECHO ════════════════════════════════════════════════════════════
    ECHO   ✓ DEPLOYMENT BERHASIL!
    ECHO ════════════════════════════════════════════════════════════
    ECHO.
    ECHO Website Anda sudah online!
    ECHO Check URL yang diberikan Vercel di atas.
    ECHO.
    ECHO Untuk akses WebGIS, tambahkan /webgis di akhir URL:
    ECHO https://your-project.vercel.app/webgis
    ECHO.
) ELSE (
    COLOR 0C
    ECHO.
    ECHO ✗ Deployment gagal!
    ECHO.
    ECHO Check error di atas dan coba lagi.
    ECHO.
)

PAUSE
