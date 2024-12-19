import Image from "next/image";
import { useState } from "react";

export default function BookCard({ title, author, rating, coverImage, dateCompleted }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 w-full bg-gray-100">
        {coverImage && !imageError ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
              </div>
            )}
            <Image
              src={coverImage}
              alt={`Cover of ${title}`}
              fill
              style={{ objectFit: "cover" }}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
              onLoad={() => setIsLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              quality={75}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No cover available</span>
          </div>
        )}
      </div>
      <div className="px-6 py-4">
        <h3 className="font-bold text-xl mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-700 text-base mb-2 line-clamp-1">{author}</p>
        <p className="text-yellow-500">{renderStars(rating)}</p>
        {dateCompleted && (
          <p className="text-gray-600 text-sm mt-2">
            Read: {formatDate(dateCompleted)}
          </p>
        )}
      </div>
    </div>
  );
}
