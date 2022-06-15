import Date from "./date";
import CoverImage from "./cover-image";
import PostTitle from "./post-title";

export default function PostHeader({ title, coverImage, date }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} url={coverImage} width={2000} height={1216} />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 font-body text-md lg:text-lg">
          <Date dateString={date} />
        </div>
      </div>
    </>
  );
}
