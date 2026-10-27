import Image from "next/image";
import AdBlock from "./AdBlock";

export default function TrendingSection({ posts = [] }: { posts?: any[] }) {
  if (!posts || posts.length === 0) return null;
  const leadPost = posts[0];
  const subLeadPost = posts[1] || leadPost;
  const superfastPosts = posts.slice(2, 8);
  const videoPosts = posts.slice(8, 10);

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (35%) - Lead Stories */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="group cursor-pointer">
            <h2 className="text-2xl font-black text-white mb-3 leading-tight group-hover:text-red-400 transition-colors">{leadPost.title}</h2>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
              <Image src={leadPost.image} alt={leadPost.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed">{leadPost.summary}</p>
          </div>
          <div className="flex gap-4 group cursor-pointer border-t border-gray-800 pt-4">
            <div className="relative w-28 h-20 flex-shrink-0 rounded overflow-hidden">
              <Image src={subLeadPost.image} alt={subLeadPost.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="text-gray-200 font-bold text-sm leading-snug group-hover:text-red-400 transition-colors">{subLeadPost.title}</h3>
          </div>
        </div>

        {/* Center Column (35%) - Superfast News */}
        <div className="lg:col-span-4 bg-[#12141c] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-red-600 p-3 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <h2 className="text-white font-black text-lg italic tracking-wider">सुपरफास्ट न्यूज़</h2>
          </div>
          <div className="p-4 flex flex-col gap-4 flex-1">
            {superfastPosts.map((post) => (
              <div key={post.id} className="flex gap-3 items-start group cursor-pointer border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <div className="relative w-16 h-12 flex-shrink-0 rounded overflow-hidden mt-1">
                  <Image src={post.image} alt={post.title} fill className="object-cover" />
                </div>
                <h3 className="text-gray-300 font-medium text-sm leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">{post.title}</h3>
              </div>
            ))}
          </div>
          <div className="p-3 bg-[#1a1d24] text-right">
            <span className="text-red-500 text-xs font-semibold cursor-pointer hover:underline">और भी &gt;</span>
          </div>
        </div>

        {/* Right Column (30%) - Sidebar & Media */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AdBlock width="300px" height="250px" />
          
          <div className="bg-[#12141c] border border-gray-800 rounded-xl p-4 flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <h2 className="text-lg font-bold text-white uppercase">शॉर्ट वीडियो</h2>
              </div>
              <div className="flex gap-1">
                <button className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 text-white">&lt;</button>
                <button className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 text-white">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {videoPosts.map((post) => (
                <div key={post.id} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer border border-gray-700">
                  <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold leading-tight drop-shadow-md line-clamp-2">{post.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer Accessory */}
      <div className="mt-6 bg-red-600 text-white font-bold text-center py-2 text-sm tracking-wider uppercase rounded shadow-lg">
        वीडियो वाला पेपर
      </div>
    </section>
  );
}
