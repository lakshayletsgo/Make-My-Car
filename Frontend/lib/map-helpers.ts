export function extractFirstGoogleMapsUrl(text: string): string | null {
  const candidates = (text || "").match(/https?:\/\/[^\s]+/g) || []
  for (const candidate of candidates) {
    if (candidate.includes("maps.app.goo.gl") || candidate.includes("google.com/maps") || candidate.includes("goo.gl/maps")) {
      return candidate
    }
  }
  return null
}

export function normalizeGoogleMapsInput(input: string): string {
  const trimmed = (input || "").trim()
  return extractFirstGoogleMapsUrl(trimmed) || trimmed
}

export function extractLatLngFromGoogleMapsLink(link: string): { latitude: number; longitude: number } | null {
  const input = decodeURIComponent(normalizeGoogleMapsInput(link))
  if (!input) return null

  const patterns: RegExp[] = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (!match) continue

    const latitude = Number(match[1])
    const longitude = Number(match[2])
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) continue

    return { latitude, longitude }
  }

  return null
}
