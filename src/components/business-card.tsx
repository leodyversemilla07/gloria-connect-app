import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Phone, Clock, MapPin } from "lucide-react";
import { getPhotoUrl } from "@/lib/utils";

export interface PublicBusinessDigest {
    _id: string;
    name:
        | string
        | {
            english: string;
            tagalog: string;
        };
    description:
        | string
        | {
            english: string;
            tagalog: string;
        };
    categoryPrimary: string;
    barangay: string;
    phone: string;
    operatingHours: {
        monday: { open: string; close: string; closed: boolean };
        tuesday: { open: string; close: string; closed: boolean };
        wednesday: { open: string; close: string; closed: boolean };
        thursday: { open: string; close: string; closed: boolean };
        friday: { open: string; close: string; closed: boolean };
        saturday: { open: string; close: string; closed: boolean };
        sunday: { open: string; close: string; closed: boolean };
    };
    primaryPhoto: {
        url: string;
        alt: string;
    } | null;
}

export interface BusinessCardProps {
    business: PublicBusinessDigest;
    idx?: number;
    language: "en" | "fil";
    getName: (business: PublicBusinessDigest) => string;
    getDescription: (business: PublicBusinessDigest) => string;
    getCategory: (business: PublicBusinessDigest) => string | undefined;
    getTodayHours: (business: PublicBusinessDigest) => string;
    getBarangay: (business: PublicBusinessDigest) => string;
    text: Record<string, string>;
}

export function BusinessCard({
    business,
    idx = 0,
    language,
    getName,
    getDescription,
    getCategory,
    getTodayHours,
    getBarangay,
    text,
}: BusinessCardProps) {
    const photoUrl = getPhotoUrl(business.primaryPhoto);

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all bg-background text-foreground flex flex-col h-full group">
            <CardHeader className="p-0 relative">
                <div className="aspect-video relative w-full bg-card overflow-hidden">
                    <Image
                        src={photoUrl}
                        alt={getName(business)}
                        width={300}
                        height={170}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        style={{ width: "100%", height: "auto" }}
                        priority={idx < 3}
                    />
                    {idx < 3 && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 border-none shadow-sm">
                            {text["featured"]}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {getName(business)}
                    </h4>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-5">
                        {getCategory(business)}
                    </Badge>
                    <span className="flex items-center text-[10px] text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {getBarangay(business)}
                    </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                    {getDescription(business)}
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3 mt-auto">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{getTodayHours(business)}</span>
                </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto p-4 border-t bg-muted/5 group-hover:bg-muted/10 transition-colors">
                <div className="flex space-x-2 w-full">
                    <Button size="sm" className="flex-1 w-full" asChild>
                        <Link href={`/${language}/business/${business._id}`}>
                            {text["viewDetails"]}
                        </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="shadow-sm px-3" asChild title={text["callNow"]}>
                        <a href={`tel:${business.phone}`}>
                            <Phone className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default BusinessCard;
