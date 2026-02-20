export { default } from "@/app/(main)/business/[id]/page";

export default function BusinessDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { language, messages, setLanguage } = useI18n();

  const businessId = params.id as Id<"businesses">;
  const business = useQuery(api.businesses.getById, { id: businessId });

  if (business === undefined) {
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
          <h1 className="text-2xl font-bold mb-4">Business not found</h1>
          <Link href={`/${language}/business`}>
            <Button variant="outline">Back to Businesses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getName = (b: Doc<"businesses">) => typeof b.name === 'string' ? b.name : b.name?.english || "";
  const getDescription = (b: Doc<"businesses">) => typeof b.description === 'string' ? b.description : b.description?.english || "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: getName(business),
          text: getDescription(business),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header language={language} messages={messages} setLanguage={setLanguage} currentPath={`/business/${businessId}`} />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <Link href={`/${language}/business`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {messages["backToHome"] || "Back"}
            </Button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {business.imageUrl && business.imageUrl.length > 0 ? (
                <>
                  <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted mb-4">
                    <Image
                      src={business.imageUrl[selectedImage]}
                      alt={getName(business)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {business.imageUrl.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {business.imageUrl.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(idx)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                            idx === selectedImage ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`${getName(business)} ${idx}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">{messages["noImage"] || "No image"}</span>
                </div>
              )}

              <h1 className="text-4xl font-bold mb-4">{getName(business)}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {business.category?.primary && (
                  <Badge variant="secondary">{business.category.primary}</Badge>
                )}
                {business.rating && (
                  <Badge variant="outline">
                    ⭐ {business.rating.toFixed(1)}
                  </Badge>
                )}
              </div>

              <p className="text-lg text-muted-foreground mb-8">{getDescription(business)}</p>

              {business.website && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Globe className="h-5 w-5" />
                      {business.website}
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {business.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{messages["contact"] || "Contact"}</p>
                        <a href={`tel:${business.phone}`} className="text-primary hover:underline">
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{messages["email"] || "Email"}</p>
                        <a href={`mailto:${business.email}`} className="text-primary hover:underline break-all">
                          {business.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{messages["location"] || "Location"}</p>
                        <p className="text-sm">{business.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    {business.phone && (
                      <Button className="w-full" asChild>
                        <a href={`tel:${business.phone}`}>
                          {messages["callNow"] || "Call Now"}
                        </a>
                      </Button>
                    )}
                    {business.address && (
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          {messages["getDirections"] || "Directions"}
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {messages["share"] || "Share"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer language={language} messages={messages} />
    </div>
  );
}
