import * as cheerio from 'cheerio';
import { parseEaipEnr51, generateGeoJson } from './parser';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Get the current effective date by scraping the history page
 */
export async function getCurrentEffectiveDate(): Promise<string> {
  try {
    const response = await fetch('https://eaip.eans.ee/history-en-GB.html');
    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for the effective date after "Currently Effective Issue"
    // The page contains a table with the date like "25 DEC 2025"

    // Find the table cell that contains the effective date
    let effectiveDate = '';
    $('td.date a').each((i, elem) => {
      const text = $(elem).text().trim();
      // Look for dates in format "DD MMM YYYY" like "25 DEC 2025"
      const dateMatch = text.match(/^(\d{1,2}) ([A-Z]{3}) (\d{4})$/);
      if (dateMatch) {
        const [, day, monthStr, year] = dateMatch;

        // Convert month abbreviation to number
        const months: { [key: string]: string } = {
          'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04', 'MAY': '05', 'JUN': '06',
          'JUL': '07', 'AUG': '08', 'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
        };

        const month = months[monthStr] || '01'; // Default to January if not found
        const dayPadded = day.padStart(2, '0');

        effectiveDate = `${year}-${month}-${dayPadded}`;
        return false; // Break the loop
      }
    });

    if (effectiveDate) {
      return effectiveDate;
    }
    
    // If we can't find the effective date, throw an error
    throw new Error('Could not find effective date on history page');
  } catch (error) {
    console.error('Error getting effective date:', error);
    throw error;
  }
}

/**
 * Backup current data before overwriting
 */
function backupCurrentData(targetDate: string) {
  const airspaceDir = path.join(process.cwd(), '..', '..', 'data', 'airspace', 'ee');
  const backupDir = path.join(airspaceDir, 'backup');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Backup latest.json if it exists
  const latestPath = path.join(airspaceDir, 'latest.json');
  if (fs.existsSync(latestPath)) {
    const backupLatestPath = path.join(backupDir, `latest-${targetDate}.json`);
    fs.copyFileSync(latestPath, backupLatestPath);
    console.log(`Backed up latest.json to: ${backupLatestPath}`);
  }

  // Backup any existing data for this date if it exists
  const targetDir = path.join(airspaceDir, targetDate);
  if (fs.existsSync(targetDir)) {
    const targetBackupPath = path.join(backupDir, `${targetDate}-backup-${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}`);
    fs.cpSync(targetDir, targetBackupPath, { recursive: true });
    console.log(`Backed up existing data for ${targetDate} to: ${targetBackupPath}`);
  }
}

/**
 * Download and parse ENR 5.1 for a specific effective date
 */
export async function downloadEnr5_1(effectiveDate: string) {
  // Convert date format if needed (e.g., 2025-12-25)
  const url = `https://eaip.eans.ee/${effectiveDate}/html/eAIP/EE-ENR-5.1-en-GB.html`;

  try {
    console.log(`Fetching ENR 5.1 from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ENR 5.1: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const result = await parseEaipEnr51(html, url);

    // Backup current data before overwriting
    backupCurrentData(effectiveDate);

    // Create output directories if they don't exist
    const dataDir = path.join(process.cwd(), '..', '..', 'data', 'airspace', 'ee', effectiveDate);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Generate and save GeoJSON
    const geoJson = generateGeoJson(result);
    const geoJsonPath = path.join(dataDir, 'enr5_1.geojson');
    fs.writeFileSync(geoJsonPath, geoJson);
    console.log(`GeoJSON saved to: ${geoJsonPath}`);

    // Update latest.json
    const latestPath = path.join(process.cwd(), '..', '..', 'data', 'airspace', 'ee', 'latest.json');
    fs.writeFileSync(latestPath, JSON.stringify({
      effectiveDate: result.effectiveDate,
      sourceUrl: result.sourceUrl,
      generatedAt: result.generatedAt,
      sha256: result.sha256
    }, null, 2));
    console.log(`Latest metadata updated: ${latestPath}`);

    return result;
  } catch (error) {
    console.error('Error downloading/parsing ENR 5.1:', error);
    throw error;
  }
}

/**
 * Restore data from backup for a specific effective date
 */
export async function restoreFromBackup(targetDate: string) {
  try {
    console.log(`Restoring data for effective date: ${targetDate}`);

    const airspaceDir = path.join(process.cwd(), '..', '..', 'data', 'airspace', 'ee');
    const backupDir = path.join(airspaceDir, 'backup');

    if (!fs.existsSync(backupDir)) {
      throw new Error(`Backup directory does not exist: ${backupDir}`);
    }

    // Look for backup files for the target date
    const backupFiles = fs.readdirSync(backupDir).filter(file =>
      file.includes(targetDate) || file.startsWith(`${targetDate}-backup-`)
    );

    if (backupFiles.length === 0) {
      throw new Error(`No backup found for date: ${targetDate}`);
    }

    // Use the most recent backup for the target date
    const sortedBackups = backupFiles.sort().reverse();
    const backupToRestore = sortedBackups[0];
    const backupPath = path.join(backupDir, backupToRestore);

    // Restore the data directory
    const targetDir = path.join(airspaceDir, targetDate);
    if (fs.lstatSync(backupPath).isDirectory()) {
      // Remove current target directory if it exists
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
      // Copy backup to target location
      fs.cpSync(backupPath, targetDir, { recursive: true });
      console.log(`Restored directory from: ${backupPath} to: ${targetDir}`);
    } else {
      // If it's a single file backup, copy it
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.copyFileSync(backupPath, path.join(targetDir, path.basename(backupPath)));
      console.log(`Restored file from: ${backupPath} to: ${targetDir}`);
    }

    // Also restore the latest.json if available
    const latestBackupPath = path.join(backupDir, `latest-${targetDate}.json`);
    if (fs.existsSync(latestBackupPath)) {
      const latestPath = path.join(airspaceDir, 'latest.json');
      fs.copyFileSync(latestBackupPath, latestPath);
      console.log(`Restored latest.json from: ${latestBackupPath}`);
    }

    console.log(`Restore completed for date: ${targetDate}`);
  } catch (error) {
    console.error(`Error restoring from backup:`, error);
    throw error;
  }
}

/**
 * Main function to restore from backup
 */
export async function restoreEaip() {
  // Get the date from command line arguments or prompt for it
  const args = process.argv.slice(2);
  const targetDate = args.find(arg => !arg.startsWith('-')) ||
                    (args.includes('--date') ? args[args.indexOf('--date') + 1] : null) ||
                    (args.includes('-d') ? args[args.indexOf('-d') + 1] : null);

  if (!targetDate) {
    console.error('Error: Please provide a date to restore from (e.g., 2025-12-25)');
    console.log('Usage: npm run eaip:restore <date>');
    process.exit(1);
  }

  try {
    console.log(`Starting restore process for date: ${targetDate}`);
    await restoreFromBackup(targetDate);
    console.log(`Restore completed successfully!`);
  } catch (error) {
    console.error('Restore failed:', error);
    process.exit(1);
  }
}

/**
 * Main function to pull the latest eAIP data
 */
export async function pullLatestEaip() {
  try {
    console.log('Getting current effective date...');
    const effectiveDate = await getCurrentEffectiveDate();
    console.log(`Current effective date: ${effectiveDate}`);
    
    console.log('Downloading and parsing ENR 5.1...');
    const result = await downloadEnr5_1(effectiveDate);
    
    console.log(`Parse completed!`);
    console.log(`Features found: ${result.features.length}`);
    console.log(`Issues: ${result.issues.length}`);
    
    if (result.issues.length > 0) {
      console.log('\nIssues found:');
      result.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error in pullLatestEaip:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (require.main === module) {
  pullLatestEaip().catch(error => {
    console.error('Failed to pull latest eAIP:', error);
    process.exit(1);
  });
}