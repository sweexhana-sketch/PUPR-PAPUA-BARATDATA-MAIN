# Panduan Setup Supabase untuk WebGIS

## Langkah 1: Buat Supabase Project

1. **Buka Supabase**
   - Kunjungi https://supabase.com
   - Login atau Sign up (gratis)

2. **Create New Project**
   - Click "New Project"
   - **Organization**: Pilih atau buat organization
   - **Project Name**: `pupr-papua-barat` (atau nama lain)
   - **Database Password**: Buat password yang kuat (simpan di tempat aman!)
   - **Region**: Pilih `Southeast Asia (Singapore)` (terdekat dengan Papua)
   - Click "Create new project"
   - Tunggu ~2 menit untuk project initialization

## Langkah 2: Get API Credentials

1. **Go to Project Settings**
   - Click icon ⚙️ (Settings) di sidebar kiri bawah
   - Click "API" di menu Settings

2. **Copy Credentials**
   - **Project URL**: Copy URL (contoh: `https://xxxxx.supabase.co`)
   - **anon public key**: Copy key di bagian "Project API keys"

3. **Update Environment Variables**
   - Buka file `.env.local` di project folder
   - Paste credentials:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Langkah 3: Create Storage Bucket

1. **Go to Storage**
   - Click "Storage" di sidebar kiri
   - Click "Create a new bucket"

2. **Bucket Configuration**
   - **Name**: `webgis-files`
   - **Public bucket**: ✅ **ENABLE** (penting!)
   - **File size limit**: 50 MB (default)
   - **Allowed MIME types**: Leave empty (allow all)
   - Click "Create bucket"

3. **Configure CORS (Optional)**
   - Jika ada CORS issues, tambahkan di Project Settings → API → CORS
   - Add allowed origin: `https://dpuprpbdprov.papuabaratdaya.app`

## Langkah 4: Upload File WebGIS

### Option A: Manual Upload (Simple)

1. **Go to Storage → webgis-files bucket**
2. **Upload folder structure**:
   - Click "Upload file" atau drag & drop
   - Upload semua file dari `public/webgis/`:
     - `index.html`
     - Folder `css/`
     - Folder `js/`
     - Folder `data/` (file GIS besar)
     - Folder `images/`
     - dll.

3. **Maintain folder structure**:
   - Buat folder di Supabase Storage sesuai struktur asli
   - Upload file ke folder yang sesuai

### Option B: Automated Upload (Recommended)

Gunakan script upload yang sudah disediakan:

```powershell
node scripts/upload-webgis-to-supabase.js
```

## Langkah 5: Get Public URL

1. **Navigate to uploaded file**
   - Go to Storage → webgis-files
   - Click pada `index.html`

2. **Get Public URL**
   - Click "Get URL" atau "Copy URL"
   - URL format: `https://xxxxx.supabase.co/storage/v1/object/public/webgis-files/index.html`
   - **Simpan URL ini!** Akan digunakan di WebGIS component

## Langkah 6: Test Access

1. **Open URL di browser**
   - Paste public URL `index.html` di browser
   - Verify WebGIS loads correctly
   - Check console untuk errors

2. **Troubleshooting**:
   - **404 Error**: Pastikan bucket adalah public
   - **CORS Error**: Configure CORS di Project Settings
   - **File not found**: Check folder structure

## Langkah 7: Update WebGIS Component

File sudah di-update otomatis, tapi verify:

1. **Check `.env.local`**:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Restart dev server**:
   ```powershell
   npm run dev
   ```

3. **Test di localhost**:
   - Navigate to `http://localhost:3000/webgis`
   - Verify WebGIS loads dari Supabase

## Langkah 8: Deploy ke Vercel

1. **Add Environment Variables di Vercel**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your anon key
   - Apply to: Production, Preview, Development

2. **Deploy**:
   ```powershell
   npm run build
   npx vercel --prod
   ```

3. **Test di production**:
   - Navigate to `https://dpuprpbdprov.papuabaratdaya.app/webgis`
   - Verify WebGIS loads correctly

## Troubleshooting

### Issue: "Invalid API key"
**Solution**: Double-check API key di `.env.local` dan Vercel environment variables

### Issue: "Bucket not found"
**Solution**: Pastikan bucket name `webgis-files` sesuai dengan code

### Issue: "Access denied"
**Solution**: Pastikan bucket adalah **public**

### Issue: WebGIS tidak load
**Solution**: 
1. Check browser console untuk errors
2. Verify public URL accessible
3. Check CORS configuration

## Maintenance

### Update WebGIS Files

1. **Upload new files** ke Supabase Storage
2. **Overwrite** existing files jika perlu
3. **Clear browser cache** untuk test

### Monitor Usage

- Go to Supabase Dashboard → Settings → Usage
- Check storage usage (free tier: 1 GB)
- Check bandwidth usage (free tier: 2 GB/month)

## Costs

**Free Tier** (cukup untuk WebGIS):
- Storage: 1 GB
- Bandwidth: 2 GB/month
- **Cost: $0/month**

**If exceed free tier**:
- Storage: $0.021/GB/month
- Bandwidth: $0.09/GB

**Estimated for 300MB WebGIS**:
- Monthly cost: **$0** (dalam free tier)
