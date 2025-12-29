/**
 * Cleans a URL by removing common tracking parameters using Regex.
 * @param url The input URL string
 * @returns The cleaned URL string
 */
export const cleanTrackingParams = (url: string): string => {
  if (!url) return url;

  try {
    // 1. Check if it's a valid URL first
    const urlObj = new URL(url);

    // 2. Define regex patterns for tracking parameters
    // Common: utm_*, fbclid, gclid, ref, mc_eid, _hsenc, _hsmi, ml_subscriber, etc.
    const trackingRegex = /^(utm_|fbclid|gclid|gclsrc|dclid|ref|mc_|ad_id|campaign|osis|cvosrc|sc_|yclid|_hs|cto_)/i;

    // 3. Iterate and delete
    const params = new URLSearchParams(urlObj.search);
    const keysToDelete: string[] = [];

    params.forEach((_, key) => {
      if (trackingRegex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => params.delete(key));

    // 4. Reconstruct
    urlObj.search = params.toString();
    
    // Remove trailing ? if empty
    let cleanedUrl = urlObj.toString();
    if (cleanedUrl.endsWith('?')) {
        cleanedUrl = cleanedUrl.slice(0, -1);
    }
    
    return cleanedUrl;

  } catch (e) {
    // If it's not a valid full URL (e.g. relative path), we try a simpler regex replacement on the string directly
    // This handles cases like "/product?utm_source=xyz"
    return url.replace(/([?&])(utm_[^&=]+|fbclid|gclid|ref)=[^&]*(&|$)/gi, (match, p1, p2, p3) => {
        if (p1 === '?' && p3 === '&') return '?';
        if (p1 === '?' && !p3) return '';
        return p3 ? p1 : ''; // preserve delimiter if needed
    }).replace(/\?$/, '');
  }
};