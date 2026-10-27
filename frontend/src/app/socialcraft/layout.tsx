import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "SocialCraft — Professional Social Media Management & Digital Growth Agency",
  },
  description: "SocialCraft provides comprehensive social media handling, viral content creation, product photography, video shoots, creator collaborations, and targeted follower growth strategies.",
  alternates: {
    canonical: "https://socialcraft.thefreelance.in",
  },
  openGraph: {
    title: "SocialCraft — Social Media Management & Brand Growth",
    description: "Scale your brand with professional social media handling, studio product shoots, viral reels, and strategic growth campaigns.",
    url: "https://socialcraft.thefreelance.in",
    siteName: "SocialCraft",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/socialcraft-favicon.svg", type: "image/svg+xml" },
      { url: "/socialcraft-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/socialcraft-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/socialcraft-icon.png" },
    ],
  },
};

const socialCraftSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://socialcraft.thefreelance.in/#website",
      "url": "https://socialcraft.thefreelance.in",
      "name": "SocialCraft",
      "description": "Professional Social Media Management, Creative Direction & Influencer Strategy Agency.",
      "publisher": {
        "@id": "https://socialcraft.thefreelance.in/#organization",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://socialcraft.thefreelance.in/#organization",
      "name": "SocialCraft",
      "url": "https://socialcraft.thefreelance.in",
      "logo": "https://socialcraft.thefreelance.in/socialcraft-icon.png",
      "image": "https://socialcraft.thefreelance.in/socialcraft-icon.png",
      "telephone": "+91-9723338321",
      "email": "thefreelancetfl@gmail.com",
      "priceRange": "₹₹",

      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Social Media Growth Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Social Media Management",
              "description": "30 custom graphics, 8 reels, ads handling, and 24/7 moderation.",
            },
            "price": "30000",
            "priceCurrency": "INR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Personalized Web Development",
              "description": "Custom modern website development with dedicated hosting, maintenance, SSL & WhatsApp lead integration.",
            },
            "price": "10000",
            "priceCurrency": "INR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Product Photo Shoot",
              "description": "Studio lighting, multi-angle compositions, and commercial retouching.",
            },
            "price": "5000",
            "priceCurrency": "INR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Product Video & Reel",
              "description": "4K vertical short-form product video and viral reel production.",
            },
            "price": "8000",
            "priceCurrency": "INR",
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Creator Collaboration",
              "description": "Niche influencer matchmaking, contract negotiation, and campaign management.",
            },
            "price": "12000",
            "priceCurrency": "INR",
          },
        ],
      },
    },
  ],
};

export default function SocialCraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(socialCraftSchema) }}
      />
      {children}
    </>
  );
}
