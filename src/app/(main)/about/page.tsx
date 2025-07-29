"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const defaultMessages: Record<string, string> = {
    aboutTitle: "About Gloria Local Connect",
    aboutDescription:
        "Gloria Local Connect is dedicated to bridging the community of Gloria, Oriental Mindoro with local businesses, fostering growth and connection since 2024.",
    aboutMission: "Our Mission",
    aboutMissionText:
        "To empower local businesses and residents by providing a platform for discovery, engagement, and support.",
    aboutVision: "Our Vision",
    aboutVisionText:
        "A thriving, connected community where every local business is just a click away.",
};


export default function AboutPage() {
    const [language, setLanguage] = useState("en");
    // You can add logic to switch messages based on language here
    const messages = defaultMessages;

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
            <Header language={language} messages={messages} setLanguage={setLanguage} />
            <main className="flex-1 py-12 md:py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">{messages.aboutTitle}</h1>
                    <p className="text-lg md:text-xl mb-8 text-center text-muted-foreground">{messages.aboutDescription}</p>
                    <section className="mb-10">
                        <h2 className="text-xl font-semibold mb-2 text-primary text-center">{messages.aboutMission}</h2>
                        <p className="text-base text-center text-muted-foreground">{messages.aboutMissionText}</p>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold mb-2 text-primary text-center">{messages.aboutVision}</h2>
                        <p className="text-base text-center text-muted-foreground">{messages.aboutVisionText}</p>
                    </section>
                </div>
            </main>
            <Footer language={language} messages={messages} />
        </div>
    );
}
