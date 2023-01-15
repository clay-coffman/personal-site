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
  return (
    <>
      <div className="flex w-full shadow-md transition ease-in-out delay-100 hover:-translate-y-1 hover:shadow-lg hover:scale-105 duration-200 lg:max-w-full cursor-pointer">
        <div className="relative m-2 bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
          <img width="200" src={cover_image_url} alt={cover_image_url} />
        </div>
        <div className="w-full font-body bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
          <div className="mb-8">
            <div className="text-gray-900 font-bold text-xl mb-2">{title}</div>
            <p className="text-lg text-gray-600 flex items-center mb-2">
              {author}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              {getCardRating(rating)}
            </p>
            <p className="text-sm text-gray-600 flex items-center">{}</p>
          </div>
        </div>
      </div>
    </>
  );
}
