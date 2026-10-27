import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";
import VideoBadge, { isVideoPost } from "@/components/common/VideoBadge";

export default async function MainSection({ posts, isEn }: { posts: any[]; isEn?: boolean }) {
  if (!posts || posts.length === 0) return null;
  const livePosts = posts;
  const leadPost = livePosts[0];
  if (!leadPost) return null;
  const subLeadPost = livePosts[1] || leadPost;
  const middleNews = livePosts.slice(2, 9);
  const textHeadlines = livePosts.slice(9, 17);

  const getPostMeta = (p: any) => {
    const title = (isEn && p.headlineEn) ? p.headlineEn : (p.headline || p.title);
    const summary = (isEn && p.summaryEn) ? p.summaryEn : p.summary;
    const slug = (isEn && p.slugEn) ? p.slugEn : p.slug;
    const href = isEn ? `/en/${p.categoryStr || 'news'}/${slug}` : `/${p.categoryStr || 'news'}/${slug}`;
    return { title, summary, href };
  };

  const leadMeta = getPostMeta(leadPost);
  const subLeadMeta = getPostMeta(subLeadPost);

  return (
    <section className="mb-8 pt-4">
      <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-7 bg-red-600 rounded-full shadow-lg shadow-red-600/30"></div>
          <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
            {isEn ? "Main Stories" : "मुख्य समाचार"}
          </h2>
        </div>
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">
          {isEn ? "Top Priority Editorial Selection" : "शीर्ष संपादकीय चयन"}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Approx 38%) - Lead & SubLead Rounded Cards */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Lead Card */}
          <Link 
            href={leadMeta.href} 
            className="group cursor-pointer block bg-[#12141c] p-4 sm:p-5 rounded-2xl border border-gray-800 hover:border-red-600/60 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative w-full h-[230px] sm:h-[260px] rounded-xl border border-gray-800/90 overflow-hidden mb-3.5 bg-gray-900 shadow-inner">
              <Image 
                src={getPostImage(leadPost)} 
                alt={leadMeta.title} 
                fill 
                priority 
                sizes="(max-width: 1024px) 100vw, 480px" 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {(leadPost?.videoUrl || leadPost?.postType === 'video') && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center border border-white/50 backdrop-blur-sm group-hover:bg-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-0.5"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              )}
            </div>
            <h2 className="text-[20px] sm:text-[23px] lg:text-[25px] font-black text-white mb-2 leading-[1.22] group-hover:text-red-500 transition-colors line-clamp-3">
              {leadMeta.title}
            </h2>
            <p className="text-gray-300 text-[14px] leading-relaxed mb-3 line-clamp-2">
              {leadMeta.summary}
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800/60 text-xs text-gray-500">
              <span>{leadPost.createdAt ? new Date(leadPost.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }) : ''}</span>
              <PostViews views={getPostViews(leadPost, isEn)} size="xs" />
            </div>
          </Link>

          {/* SubLead Card */}
          <Link 
            href={subLeadMeta.href} 
            className="group cursor-pointer block bg-[#12141c] p-4 rounded-2xl border border-gray-800 hover:border-red-600/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3.5 items-center">
              <div className="relative w-full sm:w-40 lg:w-40 h-28 rounded-xl border border-gray-800/90 overflow-hidden flex-shrink-0 bg-gray-900 shadow-inner">
                <Image 
                  src={getPostImage(subLeadPost)} 
                  alt={subLeadMeta.title} 
                  fill 
                  priority 
                  sizes="(max-width: 640px) 100vw, 160px" 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {isVideoPost(subLeadPost) && <VideoBadge size="sm" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] lg:text-[17px] font-black text-white mb-1 leading-snug group-hover:text-red-500 transition-colors line-clamp-2">
                  {subLeadMeta.title}
                </h3>
                <p className="text-gray-300 text-[13px] leading-relaxed mb-2 line-clamp-2 hidden sm:line-clamp-2">
                  {subLeadMeta.summary}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-800/50 text-xs text-gray-500">
                  <span>{subLeadPost.createdAt ? new Date(subLeadPost.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                  <PostViews views={getPostViews(subLeadPost, isEn)} size="xs" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Area (Approx 62%) - Two Columns of Interactive Rounded Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Middle Column (Thumbnail News Cards - 5 items) */}
          <div className="flex flex-col gap-3">
            {middleNews.slice(0, 5).map((post: any) => {
              const meta = getPostMeta(post);
              return (
                <Link 
                  href={meta.href} 
                  key={post.id} 
                  className="flex gap-3 items-center group cursor-pointer bg-[#12141c] p-3 rounded-2xl border border-gray-800 hover:border-red-600/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative w-24 sm:w-28 aspect-video flex-shrink-0 rounded-xl overflow-hidden border border-gray-800 bg-[#0b0c10] shadow-inner">
                    <Image 
                      src={getPostImage(post)} 
                      alt={meta.title} 
                      fill 
                      sizes="(max-width: 640px) 96px, 112px" 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {isVideoPost(post) && <VideoBadge size="sm" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-200 font-extrabold text-[13px] lg:text-[14px] leading-snug line-clamp-2 group-hover:text-red-400 transition-colors mb-1.5">
                      {meta.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                      <PostViews views={getPostViews(post, isEn)} size="xs" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Column (Text Headline Cards - 5 items) */}
          <div className="flex flex-col gap-3">
            {textHeadlines.slice(0, 5).map((post: any, i: number) => {
              const meta = getPostMeta(post);
              return (
                <Link 
                  href={meta.href} 
                  key={i} 
                  className="group block bg-[#12141c] p-3.5 rounded-2xl border border-gray-800 hover:border-red-600/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-200 font-extrabold text-[13.5px] lg:text-[14.5px] leading-[1.35] group-hover:text-red-400 line-clamp-2 transition-colors tracking-tight mb-1.5">
                        {meta.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                        <PostViews views={getPostViews(post, isEn)} size="xs" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
