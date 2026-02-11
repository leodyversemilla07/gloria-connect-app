import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Phone, Clock } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

export interface BusinessCardProps {
    business: Doc<"businesses">;
    idx?: number;
    language: "en" | "fil";
    getName: (business: Doc<"businesses">) => string;
    getDescription: (business: Doc<"businesses">) => string;
    getCategory: (business: Doc<"businesses">) => string | undefined;
    getTodayHours: (business: Doc<"businesses">) => string;
    text: Record<string, string>;
}

export function BusinessCard({
    business,
    idx = 0,
    getName,
    getDescription,
    getCategory,
    getTodayHours,
    text,
}: BusinessCardProps) {
    type Photo = NonNullable<Doc<"businesses">["photos"]>[number];
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-background text-foreground flex flex-col h-full">
            <CardHeader className="p-0 relative">
                <div className="aspect-video relative w-full bg-card">
                    <Image
                        src="/placeholder.svg"
                        alt={getName(business)}
                        width={300}
                        height={170}
                        className="w-full h-full object-cover"
                        style={{ width: "100%", height: "auto" }}
                        priority={idx < 3}
                    />
                    {idx < 3 && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900">
                            {text["featured"]}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg text-foreground line-clamp-1">
                        {getName(business)}
                    </h4>
                </div>
                <Badge variant="secondary" className="mb-2">
                    {getCategory(business)}
                </Badge>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {getDescription(business)}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{getTodayHours(business)}</span>
                </div>
                <div className="flex-1" />
            </CardContent>
            <CardFooter className="pt-2 mt-auto">
                <div className="flex space-x-2 w-full">
                    <Button size="sm" className="flex-1 w-full" asChild>
                        <Link href={`/business/${business._id}`}>
                            {text["viewDetails"]}
                        </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${business.contact.phone ?? ""}`}>
                            <Phone className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default BusinessCard;
