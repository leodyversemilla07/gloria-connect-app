export { default } from "@/app/(main)/business/page";

function getCategoriesFromBusinesses(businesses: Doc<"businesses">[], messages: Record<string, string>) {
  const set = new Set<string>();
  businesses.forEach((b) => {
    if (b.category?.primary) set.add(b.category.primary);
  });
  const arr = Array.from(set);
  arr.sort();
  return [
    { id: "all", name: messages["category.all"], nameTagalog: messages["category.all"] },
    ...arr.map((id) => ({
      id,
      name: messages[`category.${id}`] || id.charAt(0).toUpperCase() + id.slice(1),
      nameTagalog: messages[`category.${id}`] || id.charAt(0).toUpperCase() + id.slice(1),
    })),
  ];
}

export default function BusinessesPage() {
  const businesses = useQuery(api.businesses.get);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { language, messages, setLanguage } = useI18n();

  if (!businesses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-lg">{messages["loading"] || "Loading..."}</span>
      </div>
    );
  }

  type Business = Doc<"businesses">;
  const categories = getCategoriesFromBusinesses(businesses, messages);
  const getName = (business: Business) => typeof business.name === 'string' ? business.name : business.name?.english || "";
  const getDescription = (business: Business) => typeof business.description === 'string' ? business.description : business.description?.english || "";
  const getCategory = (business: Business) => {
    const cat = categories.find((c) => c.id === business.category?.primary);
    return language === "en" ? cat?.name : cat?.nameTagalog;
  };
  const filteredBusinesses = businesses.filter((business: Business) => {
    const name = getName(business).toLowerCase();
    const description = getDescription(business).toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      description.includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || business.category?.primary === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  function getTodayHours(business: Business) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
    const today = days[new Date().getDay()];
    const hours = business.operatingHours?.[today as keyof typeof business.operatingHours];
    if (!hours) return "";
    if (hours.closed) return messages["closed"] || "Closed";
    return `${hours.open} - ${hours.close}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} messages={messages} setLanguage={setLanguage} currentPath="/business" />
      <main>
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/${language}`}>
                <Button variant="ghost" size="icon" className="hover:bg-primary/20">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold">{messages["allBusinesses"] || "All Businesses"}</h1>
            </div>
            <div className="max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={messages["searchPlaceholder"] || "Search businesses..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-foreground bg-card border border-border"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48 h-12 text-foreground bg-card border border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="bg-card text-foreground">
                        {language === "en" ? category.name : category.nameTagalog}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
        <section className="py-8 md:py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredBusinesses.map((business, idx) => (
                <BusinessCard
                  key={business._id}
                  business={business}
                  idx={idx}
                  language={language as "en" | "fil"}
                  getName={getName}
                  getDescription={getDescription}
                  getCategory={getCategory}
                  getTodayHours={getTodayHours}
                  text={messages}
                />
              ))}
            </div>
            {filteredBusinesses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{messages["noBusinessesFound"] || "No businesses found matching your search."}</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer language={language} messages={messages} />
    </div>
  );
}
