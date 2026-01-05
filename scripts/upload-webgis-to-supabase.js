const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase credentials not found in .env.local');
    console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'webgis-data';
const SOURCE_DIR = path.join(__dirname, '..', 'public', 'webgis');

async function uploadFile(filePath, storagePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
            contentType: getContentType(fileName),
            upsert: true // Overwrite if exists
        });

    if (error) {
        console.error(`❌ Error uploading ${storagePath}:`, error.message);
        return false;
    }

    console.log(`✅ Uploaded: ${storagePath}`);
    return true;
}

function getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

async function uploadDirectory(dirPath, storagePrefix = '') {
    const items = fs.readdirSync(dirPath);
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        const storagePath = storagePrefix ? `${storagePrefix}/${item}` : item;

        if (stat.isDirectory()) {
            // Recursively upload directory
            const result = await uploadDirectory(fullPath, storagePath);
            successCount += result.successCount;
            errorCount += result.errorCount;
        } else {
            // Upload file
            const success = await uploadFile(fullPath, storagePath);
            if (success) {
                successCount++;
            } else {
                errorCount++;
            }
        }
    }

    return { successCount, errorCount };
}

async function main() {
    console.log('🚀 Starting WebGIS upload to Supabase Storage...\n');
    console.log(`Source directory: ${SOURCE_DIR}`);
    console.log(`Bucket: ${BUCKET_NAME}\n`);

    // Check if source directory exists
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Error: Source directory not found: ${SOURCE_DIR}`);
        process.exit(1);
    }

    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error('❌ Error checking buckets:', bucketError.message);
        process.exit(1);
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
    if (!bucketExists) {
        console.error(`❌ Error: Bucket '${BUCKET_NAME}' not found.`);
        console.error('Please create the bucket in Supabase Dashboard first.');
        console.error('Go to: Storage → Create bucket → Name: webgis-files → Public: YES');
        process.exit(1);
    }

    console.log('✅ Bucket found. Starting upload...\n');

    const startTime = Date.now();
    const { successCount, errorCount } = await uploadDirectory(SOURCE_DIR);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n📊 Upload Summary:');
    console.log(`✅ Success: ${successCount} files`);
    console.log(`❌ Errors: ${errorCount} files`);
    console.log(`⏱️  Duration: ${duration}s`);

    if (errorCount === 0) {
        console.log('\n🎉 All files uploaded successfully!');
        console.log('\nNext steps:');
        console.log('1. Verify files in Supabase Dashboard → Storage → webgis-files');
        console.log('2. Test WebGIS URL: npm run dev → http://localhost:3000/webgis');
        console.log('3. Deploy to Vercel: npm run build && npx vercel --prod');
    } else {
        console.log('\n⚠️  Some files failed to upload. Please check the errors above.');
    }
}

main().catch(console.error);
