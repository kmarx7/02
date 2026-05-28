"use client";

import { useState, useEffect, useCallback } from "react";
import type { Photo } from "@/app/api/photos/route";

const QUERIES = ["nature landscape", "ocean waves", "forest", "mountain sunset", "peaceful nature"];

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [queryIndex, setQueryIndex] = useState(0);

  const fetchPhotos = useCallback(async () => {
    try {
      const query = QUERIES[queryIndex % QUERIES.length];
      const res = await fetch(`/api/photos?query=${encodeURIComponent(query)}&count=12`);
      const data = await res.json();
      setPhotos(data.photos);
      setCurrentIndex(0);
    } catch {
      // silently fail — fallback photos already handled by API
    } finally {
      setLoading(false);
    }
  }, [queryIndex]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= photos.length) {
        setQueryIndex((q) => q + 1);
        return 0;
      }
      return next;
    });
  }, [photos.length]);

  const currentPhoto = photos[currentIndex] ?? null;

  return { currentPhoto, photos, loading, nextPhoto };
}
