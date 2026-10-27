import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";
import VideoBadge, { isVideoPost } from "@/components/common/VideoBadge";

import { apiFetch } from "@/lib/actions";

async function getCategoryPosts(slug: string, isEn?: boolean) {
  try {
    const res = await apiFetch(`/articles?compact=true&category=${slug}&limit=6&lang=${isEn ? 'en' : 'hi'}`);
    return res?.data || [];
  } catch (e) {
    return [];
  }
}

export default async function CategoryGrid({ 
  title, 
  color, 
  subCategories, 
  categorySlug, 
  isEn,
  posts: passedPosts,
}: { 
  title: string; 
  color: string; 
  subCategories?: string[]; 
  categorySlug?: string; 
  isEn?: boolean; 
  posts?: any[];
}) {
  const livePosts = (passedPosts !== undefined && passedPosts.length > 0)
    ? passedPosts
    : (categorySlug ? await getCategoryPosts(categorySlug, isEn) : []);
  
  if (!livePosts || livePosts.length === 0) return null;
  
  // STRICT CHRONOLOGICAL INTEGRITY: Newest breaking stories must always lead (Main Card = freshest story)!
  const posts = [...livePosts].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5);

  const mainHeadline = (isEn && mainPost.headlineEn) ? mainPost.headlineEn : (mainPost.headline || mainPost.title);
  const mainSummary = (isEn && mainPost.summaryEn) ? mainPost.summaryEn : mainPost.summary;
  const mainSlug = (isEn && mainPost.slugEn) ? mainPost.slugEn : mainPost.slug;
  const mainHref = isEn ? `/en/${mainPost.categoryStr}/${mainSlug}` : `/${mainPost.categoryStr}/${mainSlug}`;
  const categoryHref = isEn ? `/en/${categorySlug}` : `/${categorySlug}`;

  return (
    <section className="py-6 border-t border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <Link href={categoryHref} className="flex items-center gap-3 group">
          <div className="w-2 h-6 rounded-full transition-transform group-hover:scale-110" style={{ backgroundColor: color }}></div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide group-hover:text-red-500 transition-colors">{title}</h2>
        </Link>
        <Link href={categoryHref} className="text-red-500 font-bold hover:underline text-sm">
          {isEn ? "More >" : "और भी >"}
        </Link>
      </div>

      {subCategories && subCategories.length > 0 && (
        <div className="w-full bg-[#004A8F] flex items-center overflow-x-auto scrollbar-hide mb-6 shadow-md border-b border-blue-900 rounded-md">
          {subCategories.map((subCat: string, index: number) => (
            <button 
              key={index} 
              className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors ${
                index === 0 
                  ? "bg-red-600 text-white" 
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              {subCat}
            </button>
          ))}
        </div>
      )}

      <div className={`grid grid-cols-1 ${sidePosts.length > 0 ? 'md:grid-cols-2' : ''} gap-6`}>
        <Link href={mainHref} className="group cursor-pointer bg-[#12141c] p-4 rounded-2xl border border-gray-800 hover:border-red-600/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block">
          <div className="relative h-56 md:h-64 w-full rounded-xl overflow-hidden mb-4 bg-gray-900 shadow-md">
            <Image 
              src={getPostImage(mainPost)} 
              alt={mainHeadline} 
              fill 
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {isVideoPost(mainPost) && <VideoBadge size="md" />}
          </div>
          <h3 className="text-lg font-bold text-white category-lead-title mb-2 group-hover:text-red-500 transition-colors leading-snug">{mainHeadline}</h3>
          <p className="text-gray-400 line-clamp-3 text-sm leading-relaxed mb-3">{mainSummary}</p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
            <span className="text-gray-500 text-xs">{mainPost.createdAt ? new Date(mainPost.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }) : ''}</span>
            <PostViews views={getPostViews(mainPost, isEn)} size="xs" />
          </div>
        </Link>

        {sidePosts.length > 0 && (
          <div className="flex flex-col gap-3.5">
            {sidePosts.map((post: any) => {
              const sideHeadline = (isEn && post.headlineEn) ? post.headlineEn : (post.headline || post.title);
              const sideSlug = (isEn && post.slugEn) ? post.slugEn : post.slug;
              const sideHref = isEn ? `/en/${post.categoryStr}/${sideSlug}` : `/${post.categoryStr}/${sideSlug}`;
              return (
                <Link href={sideHref} key={post.id} className="flex gap-4 group cursor-pointer bg-[#12141c] p-3.5 rounded-2xl border border-gray-800 hover:border-red-600/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-gray-200 text-sm font-semibold line-clamp-2 group-hover:text-red-500 transition-colors mb-2 leading-snug">{sideHeadline}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{post.createdAt ? new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }) : post.date}</span>
                      <PostViews views={getPostViews(post, isEn)} size="xs" />
                    </div>
                  </div>
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-800">
                    <Image 
                      src={getPostImage(post)} 
                      alt={sideHeadline} 
                      fill 
                      loading="lazy"
                      sizes="112px" 
                      className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    {isVideoPost(post) && <VideoBadge size="sm" />}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
