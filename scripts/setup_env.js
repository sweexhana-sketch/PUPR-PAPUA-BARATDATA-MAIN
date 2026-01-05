
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n--- Supabase Credentials Setup ---');
console.log('This script will add your Supabase keys to .env.local\n');

rl.question('Enter VITE_SUPABASE_URL: ', (url) => {
    rl.question('Enter VITE_SUPABASE_ANON_KEY: ', (key) => {

        if (!url || !key) {
            console.error('\nError: Both fields are required.');
            rl.close();
            return;
        }

        try {
            let content = '';
            if (fs.existsSync(envPath)) {
                content = fs.readFileSync(envPath, 'utf8');
                // Remove existing keys if present to avoid duplicates
                content = content.replace(/^VITE_SUPABASE_URL=.*$/gm, '');
                content = content.replace(/^VITE_SUPABASE_ANON_KEY=.*$/gm, '');
                // Trim empty newlines
                content = content.trim() + '\n';
            }

            const newContent = content + `\nVITE_SUPABASE_URL=${url.trim()}\nVITE_SUPABASE_ANON_KEY=${key.trim()}\n`;

            fs.writeFileSync(envPath, newContent);
            console.log(`\nSuccess! Credentials saved to ${envPath}`);
            console.log('You can now ask the AI to continue.');
        } catch (err) {
            console.error('Failed to write file:', err);
        }

        rl.close();
    });
});
