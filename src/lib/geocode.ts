/**
 * Reverse-geocode a reported location to a short "CITY, CC" label.
 * BigDataCloud's client API is free/keyless; its fair-use policy requires
 * client-side calls tied to the user's own action — which this is (called
 * once, at report time). Failure just yields a coordinate label.
 */
export async function placeLabel(lat: number, lng: number): Promise<string> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: ctl.signal },
    );
    clearTimeout(t);
    if (res.ok) {
      const d = await res.json();
      const city = d.city || d.locality || d.principalSubdivision;
      if (city && d.countryCode) return `${String(city).toUpperCase()}, ${d.countryCode}`;
      if (d.countryName) return String(d.countryName).toUpperCase();
    }
  } catch {
    /* fall through */
  }
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(1)}°${ns} ${Math.abs(lng).toFixed(1)}°${ew}`;
}
