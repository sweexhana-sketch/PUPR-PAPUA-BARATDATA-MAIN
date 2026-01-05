
import fs from 'fs'
import dotenv from 'dotenv'

try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'))
    const url = envConfig.VITE_SUPABASE_URL || ''

    console.log('--- Validating Supabase URL ---')
    console.log('URL provided:', url)

    const validPattern = /^https:\/\/[a-z0-9]+\.supabase\.co$/

    if (validPattern.test(url)) {
        console.log('✅ URL format looks correct (https://<project-ref>.supabase.co)')
    } else {
        console.log('❌ URL format seems INCORRECT.')
        console.log('Expected format: https://<project-ref>.supabase.co')
        console.log('Common mistakes:')
        console.log(' - Using dashboard URL (supabase.com/dashboard/...)')
        console.log(' - Missing "https://"')
        console.log(' - Trailing slashes')
    }
} catch (err) {
    console.error('Error reading .env.local', err)
}
