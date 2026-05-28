import { NextResponse } from "next/server";

export interface Photo {
  id: string;
  url: string;
  description: string;
  photographer: string;
  photographerUrl: string;
}

const PICSUM_SEEDS = [
  10, 15, 20, 24, 26, 28, 29, 30, 35, 37, 39, 40, 42, 43, 45, 48, 50, 55, 60,
];

function getFallbackPhotos(count: number): Photo[] {
  return PICSUM_SEEDS.slice(0, count).map((seed) => ({
    id: `picsum-${seed}`,
    url: `https://picsum.photos/seed/${seed}/1920/1080`,
    description: "자연 풍경",
    photographer: "Picsum Photos",
    photographerUrl: "https://picsum.photos",
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "nature landscape";
  const count = Math.min(parseInt(searchParams.get("count") || "10"), 20);

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json({ photos: getFallbackPhotos(count), source: "picsum" });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=landscape&client_id=${accessKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ photos: getFallbackPhotos(count), source: "picsum" });
    }

    const data = await res.json();
    const photos: Photo[] = data.map(
      (photo: {
        id: string;
        urls: { regular: string };
        alt_description: string;
        user: { name: string; links: { html: string } };
      }) => ({
        id: photo.id,
        url: `${photo.urls.regular}&w=1920&q=85`,
        description: photo.alt_description || "자연 풍경",
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
      })
    );

    return NextResponse.json({ photos, source: "unsplash" });
  } catch {
    return NextResponse.json({ photos: getFallbackPhotos(count), source: "picsum" });
  }
}
