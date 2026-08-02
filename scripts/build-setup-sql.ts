/**
 * Concatenates the migrations into a single supabase/setup.sql that can be
 * pasted into the Supabase SQL editor in one go. Generated — never edit
 * setup.sql by hand; edit the migrations and re-run `npm run setup-sql`.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const MIGRATIONS = join(ROOT, 'supabase', 'migrations');
const OUT = join(ROOT, 'supabase', 'setup.sql');

const files = readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith('.sql'))
  .sort();

const parts = [
  '-- SPOODY TRACKER — complete database setup',
  '-- GENERATED FILE: run `npm run setup-sql` after editing migrations.',
  '--',
  '-- Paste this whole file into the Supabase SQL editor and hit Run.',
  '-- Safe to run once on a fresh project.',
  '',
];

for (const f of files) {
  parts.push(`-- ${'='.repeat(70)}`);
  parts.push(`-- ${f}`);
  parts.push(`-- ${'='.repeat(70)}`);
  parts.push(readFileSync(join(MIGRATIONS, f), 'utf8').trimEnd());
  parts.push('');
}

writeFileSync(OUT, parts.join('\n') + '\n');
console.log(`wrote supabase/setup.sql from ${files.length} migrations`);
