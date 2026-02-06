"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_KEY = "GurS0wJyr12na3jhvOraArdY3bGr64N2ovBUUTh5";

export default function ApodDetailsPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [apodData, setApodData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setApodData(null);
      setError("");
      return;
    }

    const fetchApodDetail = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`
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
    <section className="section">
      <div className="container">
        <div className="mb-4">
          <Link href="/nasa-api" className="button is-light">
            &larr; Back to NASA API
          </Link>
        </div>

        {!date && (
          <p className="has-text-danger">
            No date supplied. Please choose an item from the NASA API page.
          </p>
        )}

        {isLoading && (
          <div className="has-text-centered">
            <div className="loader is-loading"></div>
            <p>Loading details...</p>
          </div>
        )}

        {error && <p className="has-text-danger">{error}</p>}

        {apodData && !error && (
          <div className="box">
            <h1 className="title is-3">{apodData.title}</h1>
            <p className="subtitle is-6">{apodData.date}</p>

            {apodData.media_type === "image" ? (
              <figure className="image is-4by3">
                <Image
                  src={apodData.url}
                  alt={apodData.title}
                  width={800}
                  height={600}
                  unoptimized
                  style={{ width: "100%", height: "auto" }}
                />
              </figure>
            ) : (
              <div className="video-container">
                <iframe
                  src={apodData.url}
                  title={`APOD video for ${apodData.title}`}
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <p className="mt-4">{apodData.explanation}</p>
          </div>
        )}
      </div>
    </section>
  );
}
