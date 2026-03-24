import re
from urllib.parse import unquote
from urllib.request import Request, urlopen


def extract_first_google_maps_url(text: str) -> str | None:
    candidates = re.findall(r"https?://[^\s]+", text or "")
    for candidate in candidates:
        if "maps.app.goo.gl" in candidate or "google.com/maps" in candidate or "goo.gl/maps" in candidate:
            return candidate
    return None


def extract_lat_lng_from_maps_text(text: str) -> tuple[float, float] | None:
    patterns = [
        r"@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)",
        r"!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)",
        r"(?:[?&](?:q|query|ll)=)(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)",
        r"(?:[?&]center=)(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)",
    ]

    decoded = unquote(text or "")
    for pattern in patterns:
        match = re.search(pattern, decoded)
        if not match:
            continue

        latitude = float(match.group(1))
        longitude = float(match.group(2))
        if -90 <= latitude <= 90 and -180 <= longitude <= 180:
            return (latitude, longitude)

    return None


def resolve_google_maps_link(gmaps_link: str, timeout_seconds: int = 12) -> tuple[float, float, str]:
    normalized_link = extract_first_google_maps_url(gmaps_link.strip()) or gmaps_link.strip()

    direct_coords = extract_lat_lng_from_maps_text(normalized_link)
    if direct_coords:
        return (direct_coords[0], direct_coords[1], normalized_link)

    request = Request(
        normalized_link,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36"
        },
    )

    with urlopen(request, timeout=timeout_seconds) as response:
        resolved_url = response.geturl() or normalized_link
        preview_html = response.read(300000).decode("utf-8", errors="ignore")

    resolved_coords = extract_lat_lng_from_maps_text(resolved_url)
    if not resolved_coords:
        resolved_coords = extract_lat_lng_from_maps_text(preview_html)

    if not resolved_coords:
        raise ValueError("Could not extract latitude/longitude from this Google Maps link")

    return (resolved_coords[0], resolved_coords[1], resolved_url)
