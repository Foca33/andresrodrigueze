import { SiteProvider } from "@/components/Providers";
import { SiteNav } from "@/components/SiteNav";
import { MobileBuyBar } from "@/components/MobileBuyBar";
import { getCopy } from "@/content";
import { getAssets } from "@/lib/assets";
import { siteConfig } from "@/config/site";
import { books } from "@/config/books";
import { tiktok } from "@/config/social";
import { Hero } from "@/sections/Hero";
import { BookIntro } from "@/sections/BookIntro";
import { BookStats } from "@/sections/BookStats";
import { Editions } from "@/sections/Editions";
import { FirstChapterCTA } from "@/sections/FirstChapterCTA";
import { LagoDeFuego } from "@/sections/LagoDeFuego";
import { EricPreview } from "@/sections/EricPreview";
import { CrimeToks } from "@/sections/CrimeToks";
import { Testimonials } from "@/sections/Testimonials";
import { AuthorSection } from "@/sections/AuthorSection";
import { BuyStrip } from "@/sections/BuyStrip";
import { Faq } from "@/sections/Faq";
import { NewsletterCTA } from "@/sections/NewsletterCTA";
import { Footer } from "@/sections/Footer";
import { Analytics } from "@/components/Analytics";
import { PrivacyDialog } from "@/components/PrivacyDialog";
import { hasReviews } from "@/config/site";
import { resolveFaq } from "@/content/faq";

export default async function Page() {
  const copy = getCopy(siteConfig.locale);
  const assets = await getAssets();
  const hela = books[0];

  // Structured data. Nothing here that isn't in the dossier: no ISBN, offers, ratings or awards.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": `${siteConfig.url}/#hela`,
        name: "HELA",
        inLanguage: "es",
        genre: hela.genre,
        numberOfPages: hela.pages,
        author: { "@id": `${siteConfig.url}/#autor` },
        isPartOf: { "@type": "BookSeries", name: "Lago de Fuego" },
        position: 1,
        description: copy.meta.description,
        url: siteConfig.url,
        ...(assets.helaCover ? { image: `${siteConfig.url}${assets.helaCover.src}` } : {}),
      },
      {
        "@type": "FAQPage",
        mainEntity: resolveFaq(copy).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#autor`,
        name: siteConfig.author.name,
        jobTitle: "Escritor y guionista",
        homeLocation: { "@type": "Place", name: siteConfig.author.location },
        sameAs: [tiktok.url],
        ...(assets.portrait ? { image: `${siteConfig.url}${assets.portrait.src}` } : {}),
      },
    ],
  };

  return (
    <SiteProvider copy={copy} assets={assets}>
      <SiteNav />
      <main id="contenido">
        <Hero />
        <BookIntro />
        <BookStats />
        <Editions />
        <FirstChapterCTA />
        <LagoDeFuego />
        <BuyStrip />
        <EricPreview />
        <CrimeToks />
        {hasReviews && <Testimonials />}
        <AuthorSection />
        <Faq />
        <NewsletterCTA />
      </main>
      <Footer />
      <MobileBuyBar />
      <PrivacyDialog />
      <Analytics />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </SiteProvider>
  );
}
