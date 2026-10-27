import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

export default function SportsSection({ posts = [], isEn = false }: { posts?: any[]; isEn?: boolean }) {
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
    const href = isEn ? `/en/${p.categoryStr || 'sports'}/${slug}` : `/${p.categoryStr || 'sports'}/${slug}`;
    return { title, summary, href };
  };

  const headerHref = isEn ? "/en/sports" : "/sports";

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href={headerHref} className="flex items-center gap-2 group">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-b-[6px] border-b-transparent border-l-green-600"></div>
          <h2 className="text-[22px] font-black text-white group-hover:text-green-400 transition-colors">
            {isEn ? "Sports" : "खेल"}
          </h2>
        </Link>
        <Link href={headerHref} className="text-green-400 font-bold hover:underline text-sm">
          {isEn ? "More >" : "और भी >"}
        </Link>
      </div>

      {/* Content Area with Thick Border */}
      <div className="w-full border-[4px] border-[#1b2f23] bg-[#0b0c10] p-4 md:p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Column 1: List with Thumbnails */}
          {listPosts.length > 0 ? (
            <div className="flex flex-col justify-between gap-4">
              {listPosts.map((post, index) => {
                const meta = getPostMeta(post);
                return (
                  <div 
                    key={post.id} 
                    className={`py-2.5 ${index === 0 ? 'pt-0' : ''} border-b border-gray-800 last:border-0 last:pb-0`}
                  >
                  <Link href={meta.href} className="flex gap-3 items-center group cursor-pointer">
                    <div className="relative w-20 h-14 rounded-md overflow-hidden flex-shrink-0 border border-gray-800 bg-gray-900">
                      <Image 
                        src={getPostImage(post)} 
                        alt={meta.title} 
                        fill 
                        loading="lazy"
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-200 font-semibold text-[14px] leading-snug group-hover:text-green-400 transition-colors line-clamp-2 mb-1">
                        {meta.title}
                      </h4>
                      <PostViews views={getPostViews(post, isEn)} size="xs" />
                    </div>
                  </Link>
                </div>
              );
            })}
            </div>
          ) : null}

          {/* Column 2: Big Image Post 1 */}
          {imagePost1 && (() => {
            const meta1 = getPostMeta(imagePost1);
            return (
              <Link href={meta1.href} className="group cursor-pointer block">
                <div className="relative w-full h-44 md:h-48 rounded-lg border border-gray-800 overflow-hidden mb-3 bg-gray-900 shadow-md">
                  <Image 
                    src={getPostImage(imagePost1)} 
                    alt={meta1.title} 
                    fill 
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                    {isEn ? "LIVE ACTION" : "लाइव एक्शन"}
                  </div>
                </div>
                <h3 className="text-white font-bold text-[16px] leading-snug group-hover:text-green-400 transition-colors line-clamp-2">
                  {meta1.title}
                </h3>
                {meta1.summary && (
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {meta1.summary}
                  </p>
                )}
                <div className="mt-2 flex items-center">
                  <PostViews views={getPostViews(imagePost1, isEn)} size="xs" />
                </div>
              </Link>
            );
          })()}

          {/* Column 3: Big Image Post 2 */}
          {imagePost2 && (() => {
            const meta2 = getPostMeta(imagePost2);
            return (
              <Link href={meta2.href} className="group cursor-pointer block">
                <div className="relative w-full h-44 md:h-48 rounded-lg border border-gray-800 overflow-hidden mb-3 bg-gray-900 shadow-md">
                  <Image 
                    src={getPostImage(imagePost2)} 
                    alt={meta2.title} 
                    fill 
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                    {isEn ? "CRICKET & MORE" : "क्रिकेट & अन्य"}
                  </div>
                </div>
                <h3 className="text-white font-bold text-[16px] leading-snug group-hover:text-green-400 transition-colors line-clamp-2">
                  {meta2.title}
                </h3>
                {meta2.summary && (
                  <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {meta2.summary}
                  </p>
                )}
                <div className="mt-2 flex items-center">
                  <PostViews views={getPostViews(imagePost2, isEn)} size="xs" />
                </div>
              </Link>
            );
          })()}

        </div>
      </div>
    </section>
  );
}
