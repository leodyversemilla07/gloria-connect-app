"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { useI18n } from "@/components/i18n-provider";

export default function AboutPage() {
  const { language, messages, setLanguage, t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      <Header
        language={language}
        messages={messages as Record<string, string>}
        setLanguage={setLanguage}
        currentPath="/about"
      />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {t("aboutTitle") || "About Gloria Local Connect"}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-center text-muted-foreground">
            {t("aboutDescription") ||
              "Gloria Local Connect is dedicated to bridging the community of Gloria, Oriental Mindoro with local businesses, fostering growth and connection since 2024."}
          </p>
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-2 text-primary text-center">
              {t("aboutMission") || "Our Mission"}
            </h2>
            <p className="text-base text-center text-muted-foreground">
              {t("aboutMissionText") ||
                "To empower local businesses and residents by providing a platform for discovery, engagement, and support."}
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-primary text-center">
              {t("aboutVision") || "Our Vision"}
            </h2>
            <p className="text-base text-center text-muted-foreground">
              {t("aboutVisionText") ||
                "A thriving, connected community where every local business is just a click away."}
            </p>
          </section>
        </div>
      </main>
      <Footer language={language} messages={messages as Record<string, string>} />
    </div>
  );
}
