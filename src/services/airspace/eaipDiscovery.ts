/**
 * Utility to automatically discover the latest EAIP URL by following redirects and parsing effective dates
 */


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
    let effectiveDate = "";
    if (typeof DOMParser === "undefined") {
      const fallbackDate = extractEffectiveDateFromText(html);
      if (fallbackDate) {
        return fallbackDate;
      }
    } else {
      const document = new DOMParser().parseFromString(html, "text/html");

      // Look for the effective date after "Currently Effective Issue"
      // The page contains a table with the date like "25 DEC 2025"

      // Find the table cell that contains the effective date
      const dateLinks = Array.from(document.querySelectorAll("td.date a"));
      for (const link of dateLinks) {
        const text = link.textContent?.trim() ?? "";
        effectiveDate = parseEffectiveDate(text);
        if (effectiveDate) {
          break;
        }
      }
    }

    if (effectiveDate) {
      return effectiveDate;
    }

    const fallbackDate = extractEffectiveDateFromText(html);
    if (fallbackDate) {
      return fallbackDate;
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

const MONTHS: Record<string, string> = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

function parseEffectiveDate(text: string): string {
  const dateMatch = text.match(/^(\d{1,2}) ([A-Z]{3}) (\d{4})$/);
  if (!dateMatch) {
    return "";
  }

  const [, day, monthStr, year] = dateMatch;
  const month = MONTHS[monthStr] || "01";
  const dayPadded = day.padStart(2, "0");

  return `${year}-${month}-${dayPadded}`;
}

function extractEffectiveDateFromText(html: string): string {
  const dateRegex = /(\d{1,2}) ([A-Z]{3}) (\d{4})/g;
  for (const match of html.matchAll(dateRegex)) {
    const dateText = match[0];
    const parsed = parseEffectiveDate(dateText);
    if (parsed) {
      return parsed;
    }
  }

  return "";
}
