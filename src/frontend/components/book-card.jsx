import Image from 'next/image';

export default function BookCard({ author, title, cover_image_url, rating }) {
  function getCardRating(rating) {
    let stars = "";
    switch (rating) {
      case 1:
        stars = "★☆☆☆☆";
        break;
      case 2:
        stars = "★★☆☆☆";
        break;
      case 3:
        stars = "★★★☆☆";
        break;
      case 4:
        stars = "★★★★☆";
        break;
      case 5:
        stars = "★★★★★";
        break;
    }
    return stars;
  }

  const imageUrl = cover_image_url?.startsWith('http') 
    ? cover_image_url 
    : `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${cover_image_url}`;

  return (
    <div className="flex flex-col md:flex-row w-full shadow-md transition ease-in-out delay-100 hover:-translate-y-1 hover:shadow-lg hover:scale-105 duration-200 cursor-pointer">
      <div className="relative m-2 bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden flex-shrink-0">
        {cover_image_url ? (
          <div style={{ width: '200px', height: '300px', position: 'relative' }}>
            <Image 
              src={imageUrl}
              alt={`Cover for ${title}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="w-[200px] h-[300px] bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Cover</span>
          </div>
        )}
      </div>
      <div className="font-body bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
        <div>
          <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
          <p className="text-lg text-gray-600 flex items-center mb-2">
            {author}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            {getCardRating(rating)}
          </p>
        </div>
      </div>
    </div>
  );
}
