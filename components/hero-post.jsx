import Date from "./date";
import CoverImage from "./cover-image";
import Link from "next/link";

export default function HeroPost({ title, coverImage, date, excerpt, slug }) {
  return (
    <section className="relative">
      <div className="container">
        <div className="flex flex-col rounded bg-white shadow-xl">
          <div className="mb-8 md:mb-8">
            <CoverImage
              title={title}
              url={coverImage}
              slug={slug}
              width={2000}
              height={1216}
            />
          </div>
          <div className="font-body m-8 md:m-8">
            <div>
              <h3 className="mb-4 text-xl md:text-6xl leading-tight">
                <Link href={`/posts/${slug}`}>
                  <a className="hover:underline">{title}</a>
                </Link>
              </h3>
              <div className="mb-4 text-sm md:text-xl">
                <Date dateString={date} />
              </div>
            </div>
            <div>
              <p className="text-xs md:text-lg leading-relaxed mb-4">
                {excerpt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
