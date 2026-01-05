
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import dotenv from 'dotenv'

// Load environment variables manually to be safe
const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing credentials')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function checkBuckets() {
    console.log('Checking buckets...')
    const { data, error } = await supabase.storage.listBuckets()

    if (error) {
        console.error('Error listing buckets:', error)
    } else {
        console.log('Buckets found:', data)
        const webgisBucket = data.find(b => b.name === 'webgis-files')
        if (webgisBucket) {
            console.log('✅ "webgis-files" bucket exists.')
            console.log('Public:', webgisBucket.public)
            console.log('File size limit:', webgisBucket.file_size_limit)
            console.log('Allowed MIME types:', webgisBucket.allowed_mime_types)
        } else {
            console.error('❌ "webgis-files" bucket NOT found. Please create it.')
        }
    }
}

checkBuckets()
