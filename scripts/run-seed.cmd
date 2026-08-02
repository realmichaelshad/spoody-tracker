@echo off
REM Launched by Windows Task Scheduler at the scheduled time.
REM Drips the opening-week sightings onto the live map and logs output.
cd /d "%~dp0.."
npx tsx scripts/seed.ts --drip >> "%~dp0..\seed-run.local.log" 2>&1
