import Image from "next/image";
import Link from "next/link";

const ApodContent = ({ apodData }) => {
  if (!apodData) {
    return (
      <p className="has-text-centered">
        Please enter parameters and click &quot;Fetch APOD&quot;.
      </p>
    );
  }

  return (
    <div>
      {apodData.map((data, index) => (
        <div key={data.date ?? index} className="box">
          {data.media_type === "image" ? (
            <figure className="image is-4by3">
              <Image
                src={data.url}
                alt={data.title}
                width={800}
                height={600}
                unoptimized
                style={{ width: "100%", height: "auto" }}
              />
            </figure>
          ) : (
            <div className="video-container">
              <iframe
                src={data.url}
                title={`APOD video for ${data.title}`}
                allowFullScreen
              ></iframe>
            </div>
          )}
          <h2 className="title is-4">{data.title}</h2>
          <p>{data.explanation}</p>
          <Link
            href={`/nasa-api/details?date=${data.date}`}
            className="button is-link is-inverted is-medium m-1"
          >
            View
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ApodContent;
