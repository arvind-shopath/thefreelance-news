import Image from "next/image";
import Link from "next/link";
import { getPostImage } from "@/lib/constants";
import PostViews, { getPostViews } from "@/components/common/PostViews";

export default function PhotoGallerySection({ posts = [], isEn = false }: { posts: any[]; isEn?: boolean }) {
  const displayPosts = (posts || []).filter((p: any) => {
    if (isEn) {
      return p.isEnglishOnly || (p.headlineEn && p.headlineEn.trim() !== '') || (p.headline && !/[\u0900-\u097F]/.test(p.headline));
    }
    return !p.isEnglishOnly;
  });

  if (!displayPosts || displayPosts.length === 0) return null;

  const mainGallery = displayPosts[0];
  const sideGalleries = displayPosts.slice(1, 3);

  const getPostMeta = (p: any) => {
    const title = (isEn && p.headlineEn) ? p.headlineEn : p.headline;
    const slug = (isEn && p.slugEn) ? p.slugEn : p.slug;
    const href = isEn ? `/en/${p.categoryStr || 'gallery'}/${slug}` : `/${p.categoryStr || 'gallery'}/${slug}`;
    return { title, slug, href };
  };

  const headerHref = isEn ? "/photos" : "/gallery";

  return (
    <section className="mb-10 bg-[#121212] p-4 md:p-6 rounded-sm border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-b-[6px] border-b-transparent border-l-red-600"></div>
          <h2 className="text-[22px] font-black text-white">
            {isEn ? "Photo Gallery" : "फोटो गैलरी"}
          </h2>
        </div>
        <Link href={headerHref} className="text-red-500 font-bold hover:underline cursor-pointer text-sm">
          {isEn ? "More >" : "और भी >"}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Main Large Gallery */}
        {(() => {
          const meta = getPostMeta(mainGallery);
          return (
            <Link 
              href={meta.href}
              className="md:col-span-2 group cursor-pointer relative rounded-sm overflow-hidden h-[300px] md:h-[400px]"
            >
              <Image 
                src={getPostImage(mainGallery)} 
                alt={meta.title} 
                fill 
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                <div className="w-4/5">
                  <h3 className="text-white font-black text-2xl md:text-3xl leading-tight group-hover:text-yellow-400 transition-colors drop-shadow-md line-clamp-2 mb-2">
                    {meta.title}
                  </h3>
                  <PostViews views={getPostViews(mainGallery, isEn)} size="xs" className="text-white/90" />
                </div>
                
                <div className="flex items-center gap-1 text-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                  </svg>
                  <span className="font-bold text-sm">{mainGallery.slides?.length || 0}</span>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Small Galleries Stack */}
        <div className="md:col-span-1 flex flex-col gap-4 h-[300px] md:h-[400px]">
          {sideGalleries.map((gallery) => {
            const meta = getPostMeta(gallery);
            return (
              <Link 
                key={gallery.id} 
                href={meta.href}
                className="relative group cursor-pointer rounded-sm overflow-hidden flex-1"
              >
                <Image 
                  src={getPostImage(gallery)} 
                  alt={meta.title} 
                  fill 
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                  <div className="w-4/5">
                    <h4 className="text-white font-bold text-[16px] md:text-[18px] leading-snug group-hover:text-yellow-400 transition-colors drop-shadow-md line-clamp-2 mb-1">
                      {meta.title}
                    </h4>
                    <PostViews views={getPostViews(gallery, isEn)} size="xs" className="text-white/90" />
                  </div>
                  
                  <div className="flex items-center gap-1 text-white/80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>
                    <span className="font-bold text-sm">{gallery.slides?.length || 0}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
