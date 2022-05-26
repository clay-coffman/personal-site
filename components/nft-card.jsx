import Link from "next/link";
import Image from "next/image";

export default function NFTCard({ permalink, image_url }) {
  return (
    <>
      <Link href={permalink}>
        <div className="w-full shadow-md md:max-w-full">
          <div className="relative m-2 flex-none bg-cover rounded-t md:rounded-t-none md:rounded-l text-center overflow-hidden">
            {image_url ? (
              <Image width={250} height={250} src={image_url} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}
