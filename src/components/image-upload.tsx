"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  onUploadComplete: (url: string, storageId: string) => void;
  onRemove?: () => void;
  defaultUrl?: string;
  label?: string;
}

export function ImageUpload({
  onUploadComplete,
  onRemove,
  defaultUrl,
  label = "Upload Image",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateUploadUrl = useMutation((api as any).files.generateUploadUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // 2. Post the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      // 3. Get the storageId from the response
      const { storageId } = await result.json();

      // 4. In Convex, we can use the storageId to get a public URL
      // But for the form, we'll just use a temporary preview and wait for the parent to handle it
      // Actually, Convex storageId can be converted to URL via ctx.storage.getUrl(storageId)
      // Since we are on client, we'll need to fetch the URL or just use a placeholder until saved
      // Let's assume the parent will handle getting the actual URL if needed, 
      // but for now we'll use a local preview.
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // We pass back the storageId. The parent might need the URL too.
      // We can't easily get the public URL synchronously on client without another query.
      // Let's just pass the storageId and the temporary objectUrl for preview.
      onUploadComplete(objectUrl, storageId);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {previewUrl && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleRemove}
            className="text-destructive hover:text-destructive/90 h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      <div 
        className={`relative aspect-video rounded-lg border-2 border-dashed transition-all flex items-center justify-center overflow-hidden
          ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'}
        `}
      >
        {previewUrl ? (
          <>
            <Image 
              src={previewUrl} 
              alt="Preview" 
              fill 
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <div className="bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer w-full h-full"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max. 5MB)</p>
              </>
            )}
          </div>
        )}
        
        <Input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
