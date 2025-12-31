/**
 * Utility to automatically discover the latest EAIP URL by following redirects and parsing effective dates
 */

import * as cheerio from 'cheerio';

/**
 * Discover the latest EAIP ENR 5.1 URL by following redirects from the main EAIP page
 */
export async function discoverLatestEaipUrl(): Promise<string> {
  try {
    // First, try to get the effective date from the history page
    const effectiveDate = await getCurrentEffectiveDate();
    console.log(`Discovered effective date: ${effectiveDate}`);

    // Construct the URL for the ENR 5.1 page using the effective date
    const url = `https://eaip.eans.ee/${effectiveDate}/html/eAIP/EE-ENR-5.1-en-GB.html#ENR-5.1`;
    
    // Verify that the URL is accessible
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Discovered URL is not accessible: ${url}, status: ${response.status}`);
      // Fallback to the original URL construction
      return `https://eaip.eans.ee/${effectiveDate}/html/eAIP/EE-ENR-5.1-en-GB.html`;
    }

    return url;
  } catch (error) {
    console.error('Error discovering latest EAIP URL:', error);
    throw error;
  }
}

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

    // If we can't find the effective date from the history page, try the main page redirect
    console.log('Could not find effective date on history page, trying main page redirect...');
    const mainPageResponse = await fetch('https://eaip.eans.ee/', { redirect: 'manual' });
    
    // Check if there's a redirect to a specific date
    if (mainPageResponse.status >= 300 && mainPageResponse.status < 400) {
      const location = mainPageResponse.headers.get('Location');
      if (location) {
        // Extract date from URL like https://eaip.eans.ee/2025-12-25/
        const dateMatch = location.match(/eaip\.eans\.ee\/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch && dateMatch[1]) {
          return dateMatch[1];
        }
      }
    }

    // If we still can't find the effective date, throw an error
    throw new Error('Could not find effective date on history page or through redirects');
  } catch (error) {
    console.error('Error getting effective date:', error);
    throw error;
  }
}