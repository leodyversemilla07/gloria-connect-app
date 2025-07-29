import Logo from "@/components/logo";
import Link from "next/link";

interface FooterProps {
  language: string;
  messages: Record<string, string>;
}

export default function Footer({ language, messages }: FooterProps) {
  return (
    <footer className="bg-background text-foreground py-8 md:py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4 justify-center md:justify-start">
              <Logo size={40} />
              <h3 className="text-lg font-semibold">Gloria Local Connect</h3>
            </div>
            <p className="text-muted-foreground text-center md:text-left">
              {messages["footerDescription"] || (language === "en"
                ? "Connecting Gloria's community with local businesses since 2024."
                : "Nag-uugnay sa komunidad ng Gloria sa mga lokal na negosyo simula 2024.")}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">
              {messages["quickLinks"] || (language === "en" ? "Quick Links" : "Mga Mabilis na Link")}
            </h4>
            <ul className="space-y-2 text-muted-foreground text-center md:text-left">
              <li>
                <Link href="/" className="hover:text-foreground">
                  {messages["home"] || (language === "en" ? "Home" : "Tahanan")}
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-foreground">
                  {messages["allBusinesses"] || (language === "en" ? "All Businesses" : "Lahat ng Negosyo")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {messages["about"] || (language === "en" ? "About" : "Tungkol")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center md:text-left">{messages["contact"] || (language === "en" ? "Contact" : "Makipag-ugnayan")}</h4>
            <p className="text-muted-foreground text-center md:text-left">
              Gloria, Oriental Mindoro
              <br />
              Philippines
            </p>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; 2024 Gloria Local Connect{" "}
            {messages["rights"] || (language === "en" ? "All rights reserved." : "Lahat ng karapatan ay nakalaan.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
