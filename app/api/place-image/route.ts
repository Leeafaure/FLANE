import { NextRequest, NextResponse } from "next/server";

type ImageInfo = {
  thumburl?: string;
  descriptionurl?: string;
  extmetadata?: {
    Artist?: { value?: string };
    LicenseShortName?: { value?: string };
  };
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim();
  const category = request.nextUrl.searchParams.get("category");
  if (
    !name ||
    name.length > 150 ||
    !["walk", "curiosity"].includes(category ?? "")
  )
    return NextResponse.json({ image: null });
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${name} Paris`,
    gsrnamespace: "6",
    gsrlimit: "1",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "720",
  });
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?${params}`,
      {
        next: { revalidate: 2592000 },
        headers: { "User-Agent": "FLANE-Paris/1.0 (place imagery)" },
      },
    );
    const data = (await response.json()) as {
      query?: { pages?: Record<string, { imageinfo?: ImageInfo[] }> };
    };
    const info = Object.values(data.query?.pages ?? {})[0]?.imageinfo?.[0];
    const host = info?.thumburl ? new URL(info.thumburl).hostname : "";
    if (!info?.thumburl || !info.descriptionurl)
      return NextResponse.json(
        { image: null },
        { headers: { "Cache-Control": "public, max-age=86400" } },
      );
    if (host !== "upload.wikimedia.org")
      return NextResponse.json({ image: null });
    return NextResponse.json(
      {
        image: info.thumburl,
        source: info.descriptionurl,
        credit: [
          info.extmetadata?.Artist?.value,
          info.extmetadata?.LicenseShortName?.value,
        ]
          .filter(Boolean)
          .join(" · "),
      },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch {
    return NextResponse.json({ image: null });
  }
}
