import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

export default function EducationSection({ posts = [], isEn = false }: { posts?: any[]; isEn?: boolean }) {
  if (!posts || posts.length === 0) return null;

  // Ensure absolutely unique posts and strict chronological order (newest first)
  const uniquePosts = posts
    .filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (uniquePosts.length === 0) return null;

  const imagePost1 = uniquePosts[0];
  const imagePost2 = uniquePosts[1] || null;
  const listPosts = uniquePosts.slice(2, 5);

  const getPostMeta = (p: any) => {
    const title = (isEn && p.headlineEn) ? p.headlineEn : p.headline;
    const summary = (isEn && p.summaryEn) ? p.summaryEn : p.summary;
    const slug = (isEn && p.slugEn) ? p.slugEn : p.slug;
    const href = isEn ? `/en/${p.categoryStr || 'education'}/${slug}` : `/${p.categoryStr || 'education'}/${slug}`;
    return { title, summary, href };
  };

  const headerHref = isEn ? "/en/jobs" : "/jobs";

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href={headerHref} className="flex items-center gap-2 group">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-b-[6px] border-b-transparent border-l-emerald-600"></div>
          <h2 className="text-[22px] font-black text-white group-hover:text-emerald-400 transition-colors">
            {isEn ? "Jobs & Career" : "सरकारी नौकरी & करियर"}
          </h2>
        </Link>
        <Link href={headerHref} className="text-emerald-400 font-bold hover:underline text-sm">
          {isEn ? "More >" : "और भी >"}
        </Link>
      </div>

      {/* Content Area with Thick Border */}
      <div className="w-full border-[4px] border-[#222430] bg-[#0b0c10] p-4 md:p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {uniquePosts.slice(0, 3).map((post, idx) => {
            const meta = getPostMeta(post);
            const badges = isEn 
              ? ["CAREER & JOBS", "EDUCATION GUIDE", "EXAMS & RESULTS"]
              : ["करियर & शिक्षा", "एजुकेशन गाइड", "परीक्षा & परिणाम"];
            const badgeColors = ["bg-indigo-600", "bg-blue-600", "bg-purple-600"];

            return (
              <Link href={meta.href} key={post.id} className="group cursor-pointer block">
                <div className="relative w-full h-44 md:h-48 rounded-lg border border-gray-800 overflow-hidden mb-3 bg-gray-900 shadow-md">
                  <Image 
                    src={getPostImage(post)} 
                    alt={meta.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className={`absolute top-2.5 left-2.5 ${badgeColors[idx % badgeColors.length]} text-white text-[10px] font-black px-2 py-0.5 rounded shadow`}>
                    {badges[idx % badges.length]}
                  </div>
                </div>
                <h3 className="text-white font-bold text-[16px] leading-snug group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {meta.title}
                </h3>
                {meta.summary && (
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {meta.summary}
                  </p>
                )}
                <div className="mt-2 flex items-center">
                  <PostViews views={getPostViews(post, isEn)} size="xs" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Optional Extra Headlines if available */}
        {uniquePosts.length > 3 && (
          <div className="mt-5 pt-4 border-t border-gray-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            {uniquePosts.slice(3, 6).map((post) => {
              const meta = getPostMeta(post);
              return (
                <Link key={post.id} href={meta.href} className="group flex items-center justify-between gap-2 text-xs text-gray-300 hover:text-indigo-400 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                    <span className="line-clamp-1 font-medium">{meta.title}</span>
                  </div>
                  <PostViews views={getPostViews(post, isEn)} size="xs" className="shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
