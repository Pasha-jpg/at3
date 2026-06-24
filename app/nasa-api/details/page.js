"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || "";

export default function ApodDetailsPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [apodData, setApodData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      return;
    }

    const fetchApodDetail = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch APOD details.");
        }

        const data = await response.json();
        setApodData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unexpected error fetching APOD details.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApodDetail();
  }, [date]);

  return (
    <section className="mx-auto grid max-w-5xl gap-5 py-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">NASA API</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            APOD details
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            View a single Astronomy Picture of the Day entry.
          </p>
        </div>
        <Link
          href="/nasa-api"
          className="button-secondary hover:border-slate-400 hover:bg-white"
        >
          &larr; Back to list
        </Link>
      </div>

      {!date && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No date was supplied. Choose an item from the NASA API page first.
        </div>
      )}

      {isLoading && (
        <div className="surface-card flex min-h-[18rem] items-center justify-center rounded-[0.875rem] px-6 py-10">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
            <p className="mt-5 text-sm font-medium text-slate-700">
              Loading APOD details…
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {apodData && !error && (
        <article className="surface-card overflow-hidden rounded-[0.875rem]">
          {apodData.media_type === "image" ? (
            <div className="relative aspect-[16/9] bg-slate-100">
              <Image
                src={apodData.url}
                alt={apodData.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1100px"
              />
            </div>
          ) : (
            <div className="video-container bg-slate-950">
              <iframe
                src={apodData.url}
                title={`APOD video for ${apodData.title}`}
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="grid gap-6 px-5 py-6 md:grid-cols-[minmax(0,1.2fr)_18rem] md:px-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-teal-700">
                {apodData.date}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {apodData.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {apodData.explanation}
              </p>
            </div>

            <aside className="rounded-md border border-slate-200/80 bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Entry details
              </p>
              <dl className="mt-4 grid gap-4 text-sm">
                <div>
                  <dt className="text-slate-500">Type</dt>
                  <dd className="mt-1 font-medium text-slate-950">
                    {apodData.media_type}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Date</dt>
                  <dd className="mt-1 font-medium text-slate-950">
                    {apodData.date}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </article>
      )}
    </section>
  );
}
