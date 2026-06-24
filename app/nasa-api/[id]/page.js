import { notFound } from "next/navigation";
import Image from "next/image";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [
    { id: "2024-01-01" },
    { id: "2024-01-02" },
    { id: "2024-01-03" },
  ];
}

export default async function ApodDetail({ params }) {
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || "";

  const { id } = params;

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${id}`;

  const res = await fetch(apiUrl, {
    cache: "force-cache",
  });

  if (!res.ok) {
    notFound();
  }

  const apodData = await res.json();

  return (
    <div className="box">
      {apodData.media_type === "image" ? (
        <figure className="image is-4by3">
          <Image
            src={apodData.url}
            alt={apodData.title || "NASA Astronomy Picture of the Day"}
            width={800}
            height={600}
            className="rounded-lg"
            priority={true}
            unoptimized={apodData.url.includes('youtube') || apodData.url.includes('vimeo')}
          />
        </figure>
      ) : (
        <div className="video-container">
          <iframe 
            src={apodData.url} 
            frameBorder="0" 
            allowFullScreen
            title={apodData.title || "NASA APOD Video"}
            className="w-full aspect-video"
          ></iframe>
        </div>
      )}
      <h2 className="title is-4">{apodData.title}</h2>
      <p className="mt-2">{apodData.explanation}</p>
      
      {/* Optional: Add copyright info */}
      {apodData.copyright && (
        <p className="text-sm text-gray-500 mt-2">
          © {apodData.copyright}
        </p>
      )}
    </div>
  );
}