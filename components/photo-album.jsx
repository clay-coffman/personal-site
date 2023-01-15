import Gallery from "react-photo-gallery";
import { getPhotosInPhotoset } from "@/lib/flickr";

export default function PhotoAlbum({ id, title, photos }) {
  return (
    <div className="flex mb-4">
      <div className="w-full bg-gray-500 h-12">
        <h2>{id}</h2>
        <h2>{title}</h2>
        <Gallery photos={photos} />
      </div>
    </div>
  );
}
