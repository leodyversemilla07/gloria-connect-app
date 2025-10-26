"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useAuthToken } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Phone, Mail, Globe, Clock, Camera, CheckCircle, AlertCircle, Save, X } from "lucide-react";
import * as React from "react";

export default function EditBusinessPage() {
  const router = useRouter();
  const { id } = useParams();
  const token = useAuthToken();
  const isLoading = token === undefined;
  const isAuthenticated = !!token;
  const { isAdmin } = useQuery(api.users.getIsAdmin, {}) ?? { isAdmin: undefined };

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin === false) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  const business = useQuery(api.businesses.getById, { id: id as Id<"businesses"> });
  const updateBusiness = useMutation(api.businesses.update);

  type FormState = {
    nameEnglish: string;
    nameTagalog: string;
    categoryPrimary: string;
    categorySecondary: string[];
    phone: string;
    email: string;
    website: string;
    addressStreet: string;
    addressBarangay: string;
    addressLatitude: string;
    addressLongitude: string;
    descriptionEnglish: string;
    descriptionTagalog: string;
    operatingHours: {
      monday: { open: string; close: string; closed: boolean };
      tuesday: { open: string; close: string; closed: boolean };
      wednesday: { open: string; close: string; closed: boolean };
      thursday: { open: string; close: string; closed: boolean };
      friday: { open: string; close: string; closed: boolean };
      saturday: { open: string; close: string; closed: boolean };
      sunday: { open: string; close: string; closed: boolean };
    };
    photos: Array<{
      url: string;
      alt: string;
      isPrimary: boolean;
    }>;
    isVerified: boolean;
    status: string;
  };

  const [form, setForm] = React.useState<FormState | null>(null);

  React.useEffect(() => {
    if (business) {
      setForm({
        nameEnglish: business.name?.english ?? "",
        nameTagalog: business.name?.tagalog ?? "",
        categoryPrimary: business.category?.primary ?? "",
        categorySecondary: business.category?.secondary ?? [],
        phone: business.contact?.phone ?? "",
        email: business.contact?.email ?? "",
        website: business.contact?.website ?? "",
        addressStreet: business.address?.street ?? "",
        addressBarangay: business.address?.barangay ?? "",
        addressLatitude: business.address?.coordinates?.latitude?.toString() ?? "",
        addressLongitude: business.address?.coordinates?.longitude?.toString() ?? "",
        descriptionEnglish: business.description?.english ?? "",
        descriptionTagalog: business.description?.tagalog ?? "",
        operatingHours: business.operatingHours ?? {
          monday: { open: '', close: '', closed: false },
          tuesday: { open: '', close: '', closed: false },
          wednesday: { open: '', close: '', closed: false },
          thursday: { open: '', close: '', closed: false },
          friday: { open: '', close: '', closed: false },
          saturday: { open: '', close: '', closed: false },
          sunday: { open: '', close: '', closed: false },
        },
        photos: Array.isArray(business.photos) && business.photos.length > 0
          ? business.photos.map((p: { url?: string; alt?: string; isPrimary?: boolean }) => ({
            url: p.url ?? '',
            alt: p.alt ?? '',
            isPrimary: !!p.isPrimary,
          }))
          : [{ url: '', alt: '', isPrimary: true }],
        isVerified: !!business.metadata?.isVerified,
        status: business.metadata?.status ?? 'active',
      });
    }
  }, [business]);

  if (isLoading || !isAuthenticated || isAdmin === undefined || !business || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading business details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // Optionally, show a message or let useEffect handle redirect
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (!form) return;
    // Handle booleans (checkboxes only)
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setForm({ ...form, [name]: e.target.checked });
      return;
    }
    // Handle categorySecondary (comma separated)
    if (name === 'categorySecondary') {
      setForm({ ...form, categorySecondary: value.split(',').map(s => s.trim()) });
      return;
    }
    // Handle all other flat fields
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const updatedBusiness = {
      name: {
        english: form.nameEnglish,
        tagalog: form.nameTagalog,
      },
      category: {
        primary: form.categoryPrimary,
        secondary: form.categorySecondary,
      },
      contact: {
        phone: form.phone,
        email: form.email,
        website: form.website,
      },
      address: {
        street: form.addressStreet,
        barangay: form.addressBarangay,
        coordinates: {
          latitude: parseFloat(form.addressLatitude) || 0,
          longitude: parseFloat(form.addressLongitude) || 0,
        },
      },
      description: {
        english: form.descriptionEnglish,
        tagalog: form.descriptionTagalog,
      },
      operatingHours: form.operatingHours,
      photos: form.photos,
      metadata: {
        dateAdded: business.metadata?.dateAdded ?? "",
        isVerified: form.isVerified,
        status: (form.status as "active" | "inactive" | "pending"),
      },
    };
    try {
      await updateBusiness({ id: id as Id<"businesses">, ...updatedBusiness });
      router.push("/admin-businesses");
    } catch (err) {
      alert("Failed to update business: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="min-h-screen antialiased font-sans bg-background text-foreground flex flex-1 flex-col">
      <main className="@container/main flex flex-1 flex-col gap-2 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-8 w-full h-full">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                </div>
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Update the core details about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nameEnglish" className="text-sm font-medium">Business Name (English)</Label>
                  <Input
                    id="nameEnglish"
                    name="nameEnglish"
                    value={form.nameEnglish}
                    onChange={handleChange}
                    placeholder="Enter business name in English"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameTagalog" className="text-sm font-medium">Business Name (Tagalog)</Label>
                  <Input
                    id="nameTagalog"
                    name="nameTagalog"
                    value={form.nameTagalog}
                    onChange={handleChange}
                    placeholder="Pangalan ng negosyo sa Tagalog"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="categoryPrimary" className="text-sm font-medium">Primary Category</Label>
                  <Input
                    id="categoryPrimary"
                    name="categoryPrimary"
                    value={form.categoryPrimary}
                    onChange={handleChange}
                    placeholder="e.g., Restaurant, Retail, Services"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categorySecondary" className="text-sm font-medium">Secondary Categories</Label>
                  <Input
                    id="categorySecondary"
                    name="categorySecondary"
                    value={form.categorySecondary.join(", ")}
                    onChange={handleChange}
                    placeholder="Enter categories separated by commas"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span>Contact Information</span>
              </CardTitle>
              <CardDescription>
                How customers can reach your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(+63) 912 345 6789"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-sm font-medium flex items-center space-x-1">
                    <Globe className="h-3 w-3" />
                    <span>Website</span>
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>Address & Location</span>
              </CardTitle>
              <CardDescription>
                Physical location of your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="addressStreet" className="text-sm font-medium">Street Address</Label>
                  <Input
                    id="addressStreet"
                    name="addressStreet"
                    value={form.addressStreet}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressBarangay" className="text-sm font-medium">Barangay</Label>
                  <Input
                    id="addressBarangay"
                    name="addressBarangay"
                    value={form.addressBarangay}
                    onChange={handleChange}
                    placeholder="Barangay Name"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="addressLatitude" className="text-sm font-medium">Latitude</Label>
                  <Input
                    id="addressLatitude"
                    name="addressLatitude"
                    value={form.addressLatitude}
                    onChange={handleChange}
                    placeholder="14.5995"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLongitude" className="text-sm font-medium">Longitude</Label>
                  <Input
                    id="addressLongitude"
                    name="addressLongitude"
                    value={form.addressLongitude}
                    onChange={handleChange}
                    placeholder="120.9842"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">4</span>
                </div>
                <span>Business Description</span>
              </CardTitle>
              <CardDescription>
                Tell customers about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="descriptionEnglish" className="text-sm font-medium">Description (English)</Label>
                  <Textarea
                    id="descriptionEnglish"
                    name="descriptionEnglish"
                    value={form.descriptionEnglish}
                    onChange={handleChange}
                    placeholder="Describe your business in English..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionTagalog" className="text-sm font-medium">Description (Tagalog)</Label>
                  <Textarea
                    id="descriptionTagalog"
                    name="descriptionTagalog"
                    value={form.descriptionTagalog}
                    onChange={handleChange}
                    placeholder="Ilarawan ang inyong negosyo sa Tagalog..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Operating Hours</span>
              </CardTitle>
              <CardDescription>
                Set your business hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(form.operatingHours).map(([day, value]) => (
                  <Card key={day} className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold capitalize text-sm text-slate-900 dark:text-slate-100">{day}</h4>
                        <div className="space-y-2">
                          <div className="flex gap-4">
                            <div className="flex flex-col gap-1 flex-1">
                              <Label htmlFor={`${day}-from`} className="px-1 text-xs">
                                From
                              </Label>
                              <Input
                                type="time"
                                id={`${day}-from`}
                                step="1"
                                value={value.open}
                              onChange={e =>
                                setForm({
                                  ...form,
                                  operatingHours: {
                                    ...form.operatingHours,
                                    [day as keyof typeof form.operatingHours]: { ...form.operatingHours[day as keyof typeof form.operatingHours], open: e.target.value }
                                  }
                                })
                              }
                                disabled={value.closed}
                                className="bg-background appearance-none text-xs [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                              <Label htmlFor={`${day}-to`} className="px-1 text-xs">
                                To
                              </Label>
                              <Input
                                type="time"
                                id={`${day}-to`}
                                step="1"
                                value={value.close}
                                onChange={e =>
                                  setForm({
                                    ...form,
                                    operatingHours: {
                                      ...form.operatingHours,
                                      [day as keyof typeof form.operatingHours]: { ...form.operatingHours[day as keyof typeof form.operatingHours], close: e.target.value }
                                    }
                                  })
                                }
                                disabled={value.closed}
                                className="bg-background appearance-none text-xs [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              />
                            </div>
                          </div>
                          <Label className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={value.closed}
                              onCheckedChange={checked =>
                                setForm({
                                  ...form,
                                  operatingHours: {
                                    ...form.operatingHours,
                                    [day as keyof typeof form.operatingHours]: { ...form.operatingHours[day as keyof typeof form.operatingHours], closed: !!checked }
                                  }
                                })
                              }
                              aria-label={`Closed on ${day}`}
                            />
                            <span className="text-xs text-muted-foreground">Closed</span>
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                  <Camera className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <span>Business Photos</span>
              </CardTitle>
              <CardDescription>
                Add photos to showcase your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {form.photos.map((photo, idx) => (
                  <Card key={idx} className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Photo {idx + 1}</span>
                          {photo.isPrimary && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            value={photo.url}
                            onChange={e => {
                              const newPhotos = [...form.photos];
                              newPhotos[idx].url = e.target.value;
                              setForm({ ...form, photos: newPhotos });
                            }}
                            placeholder="Photo URL"
                            className="text-sm"
                          />
                          <Input
                            value={photo.alt}
                            onChange={e => {
                              const newPhotos = [...form.photos];
                              newPhotos[idx].alt = e.target.value;
                              setForm({ ...form, photos: newPhotos });
                            }}
                            placeholder="Alt text (accessibility)"
                            className="text-sm"
                          />
                          <Label className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={photo.isPrimary}
                              onCheckedChange={checked => {
                                const newPhotos = form.photos.map((p, i) => ({
                                  ...p,
                                  isPrimary: i === idx ? !!checked : false
                                }));
                                setForm({ ...form, photos: newPhotos });
                              }}
                              aria-label="Set as primary photo"
                            />
                            <span className="text-xs text-muted-foreground">Set as primary photo</span>
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status & Verification */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">6</span>
                </div>
                <span>Status & Verification</span>
              </CardTitle>
              <CardDescription>
                Manage business status and verification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">Business Status</Label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>Active</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                          <span>Inactive</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span>Pending</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verification Status</Label>
                  <div className="flex items-center space-x-4 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
                    <Label className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={form.isVerified}
                        onCheckedChange={checked => setForm({ ...form, isVerified: !!checked })}
                        aria-label="Mark as verified business"
                      />
                      <span className="text-sm">Mark as verified business</span>
                    </Label>
                    {form.isVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t p-6 mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end max-w-7xl mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button
                type="submit"
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
