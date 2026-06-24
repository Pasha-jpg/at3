"use client";

import { useState } from "react";

import ApodForm from "../components/ApodForm";
import ApodContent from "../components/ApodContent";

const NASA_API_URL = "https://api.nasa.gov/planetary/apod";

export default function NasaApi() {
  const [apodData, setApodData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchApodData = async (params) => {
    const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "";
    let apiUrl = `${NASA_API_URL}?api_key=${apiKey}`;

    for (const key in params) {
      apiUrl += `&${key}=${params[key]}`;
    }

    try {
      setIsLoading(true);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch APOD data");
      }
      const data = await response.json();
      setApodData(Array.isArray(data) ? data : [data]);
      setError("");
    } catch (err) {
      setError(err.message || "Error fetching APOD data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-stack py-6">
      <div className="space-y-3">
        <p className="eyebrow">NASA API</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Astronomy Picture of the Day
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Search APOD entries by date, date range, or count. Results can open
          in a separate detail view.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-950">Filters</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Use a single date for one result, or use a range or count to load
              multiple items.
            </p>
          </div>

          <ApodForm fetchApodData={fetchApodData} isLoading={isLoading} />
        </div>

        <div className="space-y-4">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <ApodContent apodData={apodData} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
}
