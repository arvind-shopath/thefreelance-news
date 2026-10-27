import Header from "@/components/layout/Header";
import BreakingNews from "@/components/home/BreakingNews";
import HeroSection from "@/components/home/HeroSection";
import MainSection from "@/components/home/MainSection";
import { getDbEn } from "@/lib/actions";
import { categoryEnMap } from "@/lib/constants";
import React from "react";
import dynamic from "next/dynamic";
import AdsterraAd from "@/components/ads/AdsterraAd";
import NativeBannerAd from "@/components/ads/NativeBannerAd";

import { getDeduplicatedHomepageSections } from "@/lib/homepage-dedup";

// Below-fold sections: dynamically imported for deferred JS, SSR still enabled for SEO
const TopicBasedBlock    = dynamic(() => import("@/components/home/TopicBasedBlock"),    { ssr: true });
const VisualStorySection = dynamic(() => import("@/components/home/VisualStorySection"), { ssr: true });
const CategoryGrid       = dynamic(() => import("@/components/home/CategoryGrid"),       { ssr: true });
const Sidebar            = dynamic(() => import("@/components/home/Sidebar"),            { ssr: true });
const SportsSection      = dynamic(() => import("@/components/home/SportsSection"),      { ssr: true });
const ReligionSection    = dynamic(() => import("@/components/home/ReligionSection"),    { ssr: true });
const PhotoGallerySection= dynamic(() => import("@/components/home/PhotoGallerySection"),{ ssr: true });
const EducationSection   = dynamic(() => import("@/components/home/EducationSection"),   { ssr: true });
const StateCategorySection = dynamic(() => import("@/components/home/StateCategorySection"), { ssr: true });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://news.thefreelance.in";

export const metadata = {
  title: "TheFreeLance - Independent Global Journalism & Insights",
  description: "Authentic, investigative and verified journalism in English covering National, World, Business, Tech, Culture and Sports.",
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      "en": `${SITE_URL}/en`,
      "hi": SITE_URL,
    },
  },
};

export default async function EnglishHome() {
  const db = await getDbEn();
  const { homepage, categories, ads, breakingNews, breakingPosts, trendingTags, posts } = db;

  // Prioritize International, World & Google Trends stories at the top of the English Portal
  const sortedPostsEn = [...(posts || [])].sort((a: any, b: any) => {
    const aPriority = (a.isGoogleTrends || a.categoryStr === 'world') ? 1 : 0;
    const bPriority = (b.isGoogleTrends || b.categoryStr === 'world') ? 1 : 0;
    if (aPriority !== bPriority) return bPriority - aPriority;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Deduplicate all sections across English homepage with International priority
  const { heroMain, heroSubs, mainPosts, topicBlockPosts, sidebarPosts, getCategoryPosts } = getDeduplicatedHomepageSections(sortedPostsEn, true);

  const getAd = (slot: string) => ads.find((a: any) => a.slotName === slot);

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />
      <BreakingNews post={breakingNews} posts={breakingPosts} tags={trendingTags as string[]} isEn={true} />
      
      {/* Top Banner - Header Ad */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-center">
        <AdsterraAd format="leaderboard" />
      </div>

      {/* Hero Section */}
      <HeroSection db={db} isEn={true} heroMain={heroMain} heroSubPosts={heroSubs} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <MainSection posts={mainPosts} isEn={true} />
        <TopicBasedBlock db={db} posts={topicBlockPosts} isEn={true} />
      </div>

      <div className="w-full bg-gradient-to-r from-[#002f87] via-[#004ec4] to-[#0080ff] py-10 mb-10 border-y border-white/15 shadow-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <VisualStorySection stories={db.visualStories} isEn={true} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[70%] flex flex-col gap-8">
            
            {homepage.filter((s: any) => s.isActive !== false && s.categorySlug !== 'states' && s.categorySlug !== 'jobs').map((section: any, idx: number) => {
              const category = categories.find((c: any) => c.slug === section.categorySlug);
              const englishTitle = categoryEnMap[section.categorySlug] || section.title || category?.name;
              // Insert In-feed Ad after 2nd and 5th sections
              const showAd = idx === 1 || idx === 4;

              return (
                <React.Fragment key={section.id}>
                  {section.sectionType === 'category-grid' && (
                    <CategoryGrid 
                      title={englishTitle} 
                      color={category?.color || "#ef4444"} 
                      categorySlug={section.categorySlug}
                      isEn={true}
                      posts={getCategoryPosts(section.categorySlug, 5)}
                    />
                  )}
                  {section.sectionType === 'sports-section' && (
                    <SportsSection posts={getCategoryPosts('sports', 6)} isEn={true} />
                  )}
                  {section.sectionType === 'religion-section' && (() => {
                    const relPosts = getCategoryPosts('religion', 3);
                    return (
                      <ReligionSection 
                        initialHoroscopes={db.horoscopes} 
                        posts={relPosts}
                        isEn={true}
                      />
                    );
                  })()}
                  {section.sectionType === 'photo-gallery' && (
                    <PhotoGallerySection 
                      posts={(db.photoGalleries && db.photoGalleries.length > 0 ? db.photoGalleries : db.posts.filter((p: any) => p.postType === 'gallery')).slice(0, 3)}
                      isEn={true}
                    />
                  )}
                  {section.sectionType === 'education-section' && (
                    <EducationSection posts={getCategoryPosts('education', 6)} isEn={true} />
                  )}

                  {showAd && (
                    <div className="my-6 w-full flex justify-center">
                      <AdsterraAd format="in-feed" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}

          </div>

          <aside className="lg:w-[30%] hidden lg:block self-stretch">
            <div className="sticky top-20">
              <Sidebar 
                adHtml={getAd('sidebar-rect')?.isActive ? getAd('sidebar-rect')?.adHtml : null} 
                posts={sidebarPosts}
                isEn={true}
              />
            </div>
          </aside>

          {/* Mobile Ad Placements (Equal ads for mobile readers) */}
          <div className="flex lg:hidden flex-col gap-4 my-6 w-full items-center">
            <AdsterraAd format="rectangle" />
            <AdsterraAd format="mobile" />
          </div>
        </div>
      </div>
    </main>
  );
}
