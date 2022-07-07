import Link from "next/link";
import Image from "next/image";

export default function BookCard({
  highlights_url,
  author,
  title,
  cover_image_url,
}) {
  return (
    <>
      <Link href={highlights_url}>
        <div className="flex w-full shadow-md transition ease-in-out delay-100 hover:-translate-y-1 hover:shadow-lg hover:scale-105 duration-200 lg:max-w-full cursor-pointer">
          <div className="relative m-2 w-32 bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
            <img src={cover_image_url} alt={title} />
          </div>
          <div className="w-full font-body bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div className="text-gray-900 font-bold text-xl mb-2">
                {title}
              </div>
              <p className="text-sm text-gray-600 flex items-center">
                {author}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
