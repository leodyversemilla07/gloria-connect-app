"use client"

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { useI18n } from "../../i18n-provider";
import LanguageToggle from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Globe,
  Share2,
  Navigation,
  Mail,
  Tag,
  CheckCircle,
  Calendar,
} from "lucide-react";

export default function BusinessDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { language, messages, setLanguage } = useI18n();

  const businessId = params.id as Id<"businesses">;
  const business = useQuery(api.businesses.getById, { id: businessId });

  if (business === undefined) {
    // Still loading
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground text-lg">Loading...</span>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Business Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getName = (b: Doc<"businesses">) => typeof b.name === 'string' ? b.name : b.name?.english || "";
  const getDescription = (b: Doc<"businesses">) => typeof b.description === 'string' ? b.description : b.description?.english || "";
  const getCategory = (b: Doc<"businesses">) => b.category?.primary || "";
  const getPhotos = (b: Doc<"businesses">) => b.photos || [];
  const getSpecialties = (b: Doc<"businesses">) => b.category?.secondary || [];

  const handleGetDirections = () => {
    const lat = business.address?.coordinates?.latitude;
    const lng = business.address?.coordinates?.longitude;
    if (!lat || !lng) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getName(business),
          text: getDescription(business),
          url: window.location.href,
        });
        toast.success(language === "en" ? "Link shared successfully!" : "Matagumpay na na-share ang link!");
      } catch {
        toast.error(language === "en" ? "Failed to share link." : "Hindi na-share ang link.");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(language === "en" ? "Link copied to clipboard!" : "Link na-copy sa clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-4 md:py-0 gap-4 md:gap-0">
            <Button asChild variant="link" className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">{messages["backToHome"] || "Back to Home"}</span>
              </Link>
            </Button>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-end">
              <LanguageToggle language={language} setLanguage={setLanguage} />
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="aspect-video relative">
            <Image
              src={getPhotos(business)[selectedImage]?.url || "/placeholder.svg"}
              alt={getName(business)}
              width={800}
              height={450}
              className="w-full h-full object-cover"
              style={{ width: '100%', height: 'auto' }}
              priority={true}
            />
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 md:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {getName(business)}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {/* No rating in schema, so omit or use a placeholder if needed */}
                  <Badge variant="secondary">
                    {getCategory(business)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" asChild>
                <a href={`tel:${business.contact?.phone ?? ""}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  {messages["callNow"] || "Call Now"}
                </a>
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleGetDirections}>
                <Navigation className="h-4 w-4 mr-2" />
                {messages["getDirections"] || "Get Directions"}
              </Button>
            </div>
            {/* Website and Email */}
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              {business.contact?.website && (
                <Button className="flex-1" asChild variant="outline">
                  <a href={business.contact.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    {business.contact.website.replace(/^https?:\/\//, "")}
                  </a>
                </Button>
              )}
              {business.contact?.email && (
                <Button className="flex-1" asChild variant="outline">
                  <a href={`mailto:${business.contact.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    {business.contact.email}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Photo Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">{messages["gallery"] || "Photo Gallery"}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  {getPhotos(business).map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-muted"}`}
                    >
                      <Image
                        src={
                          photo.url ||
                          `https://placehold.co/300x170.png?text=${encodeURIComponent(getName(business) || 'Business')}`
                        }
                        alt={`${getName(business)} ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">{messages["about"] || "About"}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {getDescription(business)}
                </p>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">{messages["specialties"] || "Specialties"}</h2>
                <div className="flex flex-wrap gap-2">
                  {getSpecialties(business).length > 0 ? (
                    getSpecialties(business).map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">{language === "en" ? "No specialties listed." : "Walang nakalistang specialty."}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">{messages["contact"] || "Contact Information"}</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">{`${business.address?.street || ""}, ${business.address?.barangay || ""}`}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Phone</p>
                      <a href={`tel:${business.contact?.phone ?? ""}`} className="text-sm text-primary hover:text-primary/80">
                        {business.contact?.phone ?? ""}
                      </a>
                    </div>
                  </div>

                  {business.contact?.email && (
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <a href={`mailto:${business.contact.email}`} className="text-sm text-primary hover:text-primary/80">
                          {business.contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.contact?.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Website</p>
                        <a href={business.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary/80">
                          {business.contact.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{messages["hours"] || "Operating Hours"}</p>
                      <p className="text-sm text-muted-foreground">
                        {(() => {
                          // Show today's hours if available
                          const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
                          const today = days[new Date().getDay()];
                          const hours = business.operatingHours?.[today];
                          if (!hours) return "";
                          if (hours.closed) return messages["closed"] || (language === "en" ? "Closed" : "Sarado");
                          return `${hours.open} - ${hours.close}`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Business Info</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Status</p>
                      <p className="text-sm text-muted-foreground capitalize">{business.metadata?.status || "unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Verified</p>
                      <p className="text-sm text-muted-foreground">{business.metadata?.isVerified ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date Added</p>
                      <p className="text-sm text-muted-foreground">{business.metadata?.dateAdded ? new Date(business.metadata.dateAdded).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Last Updated</p>
                      <p className="text-sm text-muted-foreground">{business.metadata?.lastUpdated ? new Date(business.metadata.lastUpdated).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">{messages["location"] || "Location"}</h2>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Interactive Map</p>
                    <Button size="sm" onClick={handleGetDirections}>
                      <Navigation className="h-4 w-4 mr-2" />
                      {messages["getDirections"] || "Get Directions"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
