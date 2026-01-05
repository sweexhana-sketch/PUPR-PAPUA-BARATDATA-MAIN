
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// Load environment variables from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8')
const envConfig = dotenv.parse(envContent)

console.log('--- .env.local Debug Info ---')
// Debugging block removed in favor of new logic
console.log('Scanning lines for "SUPABASE":')
const lines = envContent.split('\n')
lines.forEach((line, idx) => {
    if (line.toUpperCase().includes('SUPABASE') || line.toUpperCase().includes('VITE')) {
        // Mask the value after equals sign to be safe, but show the key and structure
        const parts = line.split('=')
        const key = parts[0].trim()
        const hasValue = parts.length > 1 && parts[1].trim().length > 0
        console.log(`Line ${idx + 1}: ${key}=${hasValue ? '[HIDDEN]' : '[EMPTY/MISSING]'}`)
    }
})
console.log('-----------------------------')

for (const k in envConfig) {
    process.env[k] = envConfig[k] // Manually set to process.env to be sure
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY
const BUCKET_NAME = 'webgis-data'
const DATA_DIR = path.join(process.cwd(), 'public/webgis/data')

console.log('Checking environment variables...')
console.log('VITE_SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Missing')
console.log('VITE_SUPABASE_ANON_KEY:', SUPABASE_KEY ? 'Set' : 'Missing')

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: One or more required environment variables are missing in .env.local')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function uploadFiles() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            console.error(`Error: Data directory not found at ${DATA_DIR}`)
            process.exit(1)
        }

        const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.js'))
        console.log(`Found ${files.length} files to upload...`)

        const urls = {}

        for (const file of files) {
            const filePath = path.join(DATA_DIR, file)
            const fileContent = fs.readFileSync(filePath)

            console.log(`Uploading ${file}...`)

            // Upload to Supabase Storage
            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(file, fileContent, {
                    contentType: 'application/javascript',
                    upsert: true
                })

            if (error) {
                console.error(`Failed to upload ${file}:`, error.message)
                continue
            }

            // Get public URL
            const { data: urlData } = supabase
                .storage
                .from(BUCKET_NAME)
                .getPublicUrl(file)

            if (urlData) {
                urls[file] = urlData.publicUrl
                console.log(`Success: ${file} -> ${urlData.publicUrl}`)
            }
        }

        console.log('\n--- Upload Complete ---')
        console.log('Public URLs:')
        console.table(urls)

        // Save URLs to a file for easy access later if needed
        fs.writeFileSync('uploaded_gis_urls.json', JSON.stringify(urls, null, 2))
        console.log('\nURLs saved to uploaded_gis_urls.json')

    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

uploadFiles()
