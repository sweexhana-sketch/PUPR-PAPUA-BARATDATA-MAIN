# Panduan Deployment Website PUPR Papua Barat

## Prerequisites

- Node.js dan npm terinstall
- Akun Vercel (gratis di [vercel.com](https://vercel.com))
- Akses ke DNS management domain `papuabaratdaya.app`

## Langkah 1: Fix PowerShell Execution Policy (Windows)

Jika mengalami error "running scripts is disabled", jalankan:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

Verifikasi:
```powershell
Get-ExecutionPolicy -List
```

## Langkah 2: Build Project Locally (Opsional - untuk testing)

```powershell
cd "d:\PUPR PAPUA BARATDATA MAIN"
npm install
npm run build
npm run preview
```

Website akan tersedia di `http://localhost:4173`

## Langkah 3: Deploy ke Vercel

### Opsi A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
```powershell
npm install -g vercel
```

2. Login ke Vercel:
```powershell
vercel login
```

3. Deploy ke production:
```powershell
vercel --prod
```

4. Ikuti prompts:
   - Set up and deploy? **Y**
   - Which scope? Pilih account Anda
   - Link to existing project? **N**
   - Project name? `dpupr-papua-barat` (atau nama lain)
   - In which directory is your code located? `./`
   - Want to override settings? **N**

### Opsi B: Deploy via Vercel Dashboard

1. Push code ke GitHub repository
2. Login ke [vercel.com](https://vercel.com)
3. Click "Add New Project"
4. Import repository dari GitHub
5. Vercel akan auto-detect Vite configuration
6. Click "Deploy"

## Langkah 4: Konfigurasi Custom Domain

### Di Vercel Dashboard:

1. Buka project di Vercel dashboard
2. Go to **Settings** → **Domains**
3. Add domain: `dpuprpbdprov.papuabaratdaya.app`
4. Vercel akan memberikan DNS configuration

### Di DNS Management (Registrar Domain):

Tambahkan CNAME record:

| Type  | Name/Host           | Value/Target                    | TTL  |
|-------|---------------------|---------------------------------|------|
| CNAME | dpuprpbdprov        | cname.vercel-dns.com            | 3600 |

**Atau** jika Vercel memberikan instruksi berbeda, ikuti instruksi tersebut.

### Verifikasi:

1. Tunggu DNS propagation (5-30 menit)
2. Check status di Vercel dashboard
3. Akses `https://dpuprpbdprov.papuabaratdaya.app`

## Troubleshooting

### Error: "running scripts is disabled"
**Solusi:** Jalankan `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force`

### Build Failed
**Solusi:** 
- Pastikan semua dependencies terinstall: `npm install`
- Clear cache: `npm cache clean --force`
- Rebuild: `npm run build`

### Domain tidak dapat diakses
**Solusi:**
- Check DNS propagation: `nslookup dpuprpbdprov.papuabaratdaya.app`
- Verifikasi CNAME record sudah benar
- Tunggu hingga 48 jam untuk DNS propagation penuh

### SSL Certificate Error
**Solusi:** Vercel akan otomatis generate SSL certificate. Tunggu beberapa menit setelah DNS verified.

## Update Website

Untuk update website di masa depan:

```powershell
# Edit code Anda
# Commit changes
git add .
git commit -m "Update website"
git push

# Jika menggunakan Vercel CLI
vercel --prod
```

Jika sudah connect ke GitHub, Vercel akan otomatis deploy setiap kali ada push ke branch main.

## Monitoring

- **Vercel Dashboard**: Monitor deployment status, analytics, dan logs
- **URL Production**: https://dpuprpbdprov.papuabaratdaya.app
- **Vercel URL**: https://[project-name].vercel.app (backup URL)

## Support

Jika mengalami masalah:
1. Check Vercel deployment logs di dashboard
2. Check browser console untuk JavaScript errors
3. Verifikasi DNS settings di registrar
4. Contact Vercel support: [vercel.com/support](https://vercel.com/support)
