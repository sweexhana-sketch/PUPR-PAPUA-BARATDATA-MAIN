
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import dotenv from 'dotenv'

const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
const supabase = createClient(envConfig.VITE_SUPABASE_URL, envConfig.VITE_SUPABASE_ANON_KEY)

async function testUpload() {
    console.log('Testing upload of tiny file...')
    const { data, error } = await supabase
        .storage
        .from('webgis-data')
        .upload('test_connection.txt', 'Hello Supabase', {
            contentType: 'text/plain',
            upsert: true
        })

    if (error) {
        console.error('❌ Upload Failed:', error)
    } else {
        console.log('✅ Upload Success:', data)
        const { data: url } = supabase.storage.from('webgis-data').getPublicUrl('test_connection.txt')
        console.log('Public URL:', url.publicUrl)
    }
}

testUpload()
