import Header from "@/components/layout/Header";
import BreakingNews from "@/components/home/BreakingNews";
import HeroSection from "@/components/home/HeroSection";
import MainSection from "@/components/home/MainSection";
import AdsterraAd from "@/components/ads/AdsterraAd";
import NativeBannerAd from "@/components/ads/NativeBannerAd";
import { getDb } from "@/lib/actions";
import React from "react";
import dynamic from "next/dynamic";

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
const ElectionResultsSection = dynamic(() => import("@/components/election/ElectionResultsSection"), { ssr: true });


// News Portal Best Practice: 60s ISR with On-Demand Revalidation
export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://news.thefreelance.in";

export const metadata = {
  title: "द फ्रीलांस (The FreeLance) - स्वतंत्र और निष्पक्ष डिजिटल न्यूज़ पोर्टल",
  description: "द फ्रीलांस (The FreeLance) - भारत का अग्रणी निष्पक्ष व स्वतंत्र डिजिटल न्यूज़ पोर्टल। देश, दुनिया, राजनीति, अपराध, शिक्षा, खेल, मनोरंजन और व्यापार की प्रामाणिक व खोजी पत्रकारिता।",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "hi": SITE_URL,
      "en": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: "द फ्रीलांस (The FreeLance) - स्वतंत्र और निष्पक्ष डिजिटल न्यूज़ पोर्टल",
    description: "देश, दुनिया, राजनीति, अपराध, शिक्षा, खेल, मनोरंजन और व्यापार की प्रामाणिक व खोजी पत्रकारिता।",
    url: SITE_URL,
    siteName: "द फ्रीलांस",
    locale: "hi_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "द फ्रीलांस (The FreeLance) - स्वतंत्र और निष्पक्ष डिजिटल न्यूज़ पोर्टल",
    description: "देश, दुनिया, राजनीति, अपराध, शिक्षा, खेल, मनोरंजन और व्यापार की प्रामाणिक व खोजी पत्रकारिता।",
  },
};

export default async function Home() {
  const db = await getDb();
  const { homepage, categories, ads, breakingNews, breakingPosts, trendingTags, posts } = db;

  // Deduplicate all sections across homepage
  const { heroMain, heroSubs, mainPosts, topicBlockPosts, sidebarPosts, getCategoryPosts } = getDeduplicatedHomepageSections(posts, false);

  const getAd = (slot: string) => ads.find((a: any) => a.slotName === slot);

  return (
    <main className="min-h-screen bg-[#0b0c10] text-gray-200">
      <Header />
      {/* Election Results Widget — shows above breaking news when isActive=true in dashboard */}
      <ElectionResultsSection />
      <BreakingNews post={breakingNews} posts={breakingPosts} tags={trendingTags as string[]} />

      {/* Top Banner - Header Ad */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-center">
        <AdsterraAd format="leaderboard" />
      </div>

      <HeroSection db={db} heroMain={heroMain} heroSubPosts={heroSubs} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <MainSection posts={mainPosts} />
        <TopicBasedBlock db={db} posts={topicBlockPosts} />
      </div>

      <div className="w-full bg-gradient-to-r from-[#002f87] via-[#004ec4] to-[#0080ff] py-6 mb-6 border-y border-white/15 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <VisualStorySection stories={db.visualStories} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] flex flex-col gap-6">
            
            {homepage.filter((s: any) => s.isActive !== false).map((section: any, idx: number) => {
              const category = categories.find((c: any) => c.slug === section.categorySlug);
              const displayTitle = section.categorySlug === 'national' 
                ? "देश" 
                : (section.title || category?.name);
              
              // Insert In-feed Ad after 2nd and 5th sections
              const showAd = idx === 1 || idx === 4;

              return (
                <React.Fragment key={section.id}>
                  {section.categorySlug === 'states' ? (
                    <StateCategorySection 
                      posts={getCategoryPosts('states', 8)} 
                      title={section.title || "राज्य समाचार"} 
                      color={category?.color || "#eab308"} 
                    />
                  ) : (section.sectionType === 'category-grid' || section.sectionType === 'category-block') && section.categorySlug !== 'sports' ? (
                    <CategoryGrid 
                      title={displayTitle} 
                      color={category?.color || "#ef4444"} 
                      categorySlug={section.categorySlug}
                      posts={getCategoryPosts(section.categorySlug, 5)}
                    />
                  ) : null}
                  {(section.sectionType === 'sports-section' || (section.sectionType === 'category-block' && section.categorySlug === 'sports')) && (
                    <SportsSection posts={getCategoryPosts('sports', 6)} />
                  )}
                  {section.sectionType === 'religion-section' && (() => {
                    const relPosts = getCategoryPosts('religion', 3);
                    return (
                      <>
                        {/* Banner Ad above Religion & Horoscope Section */}
                        <div className="my-3 w-full flex justify-center">
                          <AdsterraAd format="leaderboard" />
                        </div>
                        <ReligionSection 
                          initialHoroscopes={db.horoscopes} 
                          posts={relPosts}
                        />
                      </>
                    );
                  })()}
                  {section.sectionType === 'photo-gallery' && (
                    <PhotoGallerySection 
                      posts={(db.photoGalleries && db.photoGalleries.length > 0 ? db.photoGalleries : db.posts.filter((p: any) => p.postType === 'gallery')).slice(0, 3)}
                    />
                  )}
                  {(section.sectionType === 'education-section' || section.categorySlug === 'jobs' || section.categorySlug === 'education') && (
                    <EducationSection posts={getCategoryPosts('jobs', 6)} />
                  )}
                  
                  {showAd && (
                    <div className="my-3 w-full flex justify-center">
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
