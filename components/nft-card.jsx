import Link from "next/link";
import Image from "next/image";

export default function NFTCard({
  highlights_url,
  author,
  title,
  cover_image_url,
}) {
  return (
    <>
      <Link href={highlights_url}>
        <div className=" w-full shadow-md lg:max-w-full lg:flex">
          <div className="relative my-2 lg:w-32 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
            <Image objectFit="contain" src={cover_image_url} layout="fill" />
          </div>
          <div className="w-full bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
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
