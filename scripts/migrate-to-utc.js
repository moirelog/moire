import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMOS_DIR = path.resolve(__dirname, '../src/memos');

/**
 * Normalizes UTC offset to ISO format (+HH:mm or -HH:mm)
 */
function normalizeUtcOffset(offset) {
    const num = parseFloat(offset);
    if (isNaN(num)) return offset;
    const sign = num >= 0 ? '+' : '-';
    const absOffset = Math.abs(num);
    const hours = Math.floor(absOffset);
    const minutes = (absOffset % 1) * 60;
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

async function migrate() {
    const args = process.argv.slice(2);
    const offsetArg = args[0];

    if (!offsetArg) {
        console.error('Usage: node scripts/migrate-to-utc.js <your_previous_utc_offset>');
        console.error('Example: node scripts/migrate-to-utc.js 8');
        process.exit(1);
    }

    const offset = normalizeUtcOffset(offsetArg);
    console.log(`Migrating memos from offset ${offset} to UTC...`);

    if (!fs.existsSync(MEMOS_DIR)) {
        console.error(`Memos directory not found at ${MEMOS_DIR}`);
        return;
    }

    const files = fs.readdirSync(MEMOS_DIR).filter(f => f.endsWith('.md'));

    for (const file of files) {
        const slug = file.replace('.md', '');
        const match = slug.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        
        if (!match) {
            console.log(`Skipping non-timestamped file: ${file}`);
            continue;
        }

        const [_, year, month, day, hour, minute, second] = match;
        const localIso = `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`;
        const date = new Date(localIso);

        if (isNaN(date.getTime())) {
            console.error(`Invalid date for file: ${file}`);
            continue;
        }

        // Generate UTC timestamp YYYYMMDDHHmmss
        const utcYear = date.getUTCFullYear();
        const utcMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
        const utcDay = String(date.getUTCDate()).padStart(2, '0');
        const utcHour = String(date.getUTCHours()).padStart(2, '0');
        const utcMinute = String(date.getUTCMinutes()).padStart(2, '0');
        const utcSecond = String(date.getUTCSeconds()).padStart(2, '0');

        const newSlug = `${utcYear}${utcMonth}${utcDay}${utcHour}${utcMinute}${utcSecond}`;
        const newFile = `${newSlug}.md`;

        if (file === newFile) {
            console.log(`File already matches UTC (or offset was 0): ${file}`);
            continue;
        }

        const oldPath = path.join(MEMOS_DIR, file);
        const newPath = path.join(MEMOS_DIR, newFile);

        if (fs.existsSync(newPath)) {
            console.warn(`Warning: Destination file ${newFile} already exists. Skipping ${file} to avoid overwrite.`);
            continue;
        }

        console.log(`Renaming: ${file} -> ${newFile}`);
        fs.renameSync(oldPath, newPath);
    }

    console.log('Migration complete!');
}

migrate().catch(console.error);
