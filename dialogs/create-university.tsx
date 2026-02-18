"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUniversities, UniversityFormData } from "@/hooks/useUniversities";
import FileUploader from "@/components/university-feed/FileUploader";
import { X } from "lucide-react";
import { University } from "@/types/database";

export default function CreateUniversityDialog({
  open,
  setOpen,
  onSuccess,
  initialData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: University | null;
}) {
  const {
    createUniversity,
    updateUniversity,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    errors,
    isSubmitting,
  } = useUniversities();

  const isActive = watch("is_active");

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Pre-fill form for editing
        setValue("name", initialData.name);
        setValue("abbreviation", initialData.abbreviation);
        setValue("color_primary", initialData.color_primary);
        setValue("color_secondary", initialData.color_secondary);
        setValue("latitude", initialData.latitude);
        setValue("longitude", initialData.longitude);
        setValue("is_active", initialData.is_active);
        setValue("logo_url", initialData.logo_url);
        setValue("gallery_urls", initialData.gallery_urls || []);
      } else {
        // Reset for creation
        reset({
          name: "",
          abbreviation: "",
          color_primary: "",
          color_secondary: "",
          latitude: undefined,
          longitude: undefined,
          is_active: true,
          logo_url: "",
          gallery_urls: [],
        });
      }
    }
  }, [open, initialData, setValue, reset]);

  const onSubmit = async (data: UniversityFormData) => {
    let result;

    if (initialData) {
      // Update existing
      result = await updateUniversity(initialData.id, {
        ...data,
        is_active: data.is_active ?? true,
      });
    } else {
      // Create new
      result = await createUniversity({
        ...data,
        is_active: data.is_active ?? true,
      });
    }

    if (result?.success) {
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit University" : "Create University"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Update university details and settings."
                : "Add a new university to the platform. Include coordinates for map display."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">
                University Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., University of Michigan"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Abbreviation */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="abbreviation">
                Abbreviation <span className="text-red-500">*</span>
              </Label>
              <Input
                id="abbreviation"
                placeholder="e.g., UMich"
                {...register("abbreviation")}
                disabled={isSubmitting}
              />
              {errors.abbreviation && (
                <p className="text-red-500 text-xs">
                  {errors.abbreviation.message}
                </p>
              )}
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="color_primary">Primary Color</Label>
                <Input
                  id="color_primary"
                  type="text"
                  placeholder="#00274C"
                  {...register("color_primary")}
                  disabled={isSubmitting}
                />
                {errors.color_primary && (
                  <p className="text-red-500 text-xs">
                    {errors.color_primary.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="color_secondary">Secondary Color</Label>
                <Input
                  id="color_secondary"
                  type="text"
                  placeholder="#FFCB05"
                  {...register("color_secondary")}
                  disabled={isSubmitting}
                />
                {errors.color_secondary && (
                  <p className="text-red-500 text-xs">
                    {errors.color_secondary.message}
                  </p>
                )}
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="42.2780"
                  {...register("latitude")}
                  disabled={isSubmitting}
                />
                {errors.latitude && (
                  <p className="text-red-500 text-xs">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-83.7382"
                  {...register("longitude")}
                  disabled={isSubmitting}
                />
                {errors.longitude && (
                  <p className="text-red-500 text-xs">
                    {errors.longitude.message}
                  </p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="grid gap-4 border-t pt-4">
              <h3 className="text-sm font-medium">Images</h3>

              {/* Logo */}
              <div className="flex flex-col gap-2">
                <Label>University Logo</Label>
                <div className="flex items-center gap-4">
                  {watch("logo_url") && (
                    <div className="relative w-16 h-16 border rounded-lg overflow-hidden">
                      <img
                        src={watch("logo_url") || ""}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setValue("logo_url", null)}
                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  <FileUploader
                    bucketName="university-media"
                    onFileSelect={(file) => {
                      if (file) setValue("logo_url", file.url);
                    }}
                    showPreview={false}
                  >
                    <Button variant="secondary" size="sm" type="button">
                      {watch("logo_url") ? "Change Logo" : "Upload Logo"}
                    </Button>
                  </FileUploader>
                </div>
                {errors.logo_url && (
                  <p className="text-red-500 text-xs">
                    {errors.logo_url.message}
                  </p>
                )}
              </div>

              {/* Gallery */}
              <div className="flex flex-col gap-2">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(watch("gallery_urls") || []).map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-video border rounded-lg overflow-hidden group"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch("gallery_urls") || [];
                          setValue(
                            "gallery_urls",
                            current.filter((_, i) => i !== index),
                          );
                        }}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <FileUploader
                    bucketName="university-media"
                    onFileSelect={(file) => {
                      if (file) {
                        const current = watch("gallery_urls") || [];
                        setValue("gallery_urls", [...current, file.url]);
                      }
                    }}
                    showPreview={false}
                  >
                    <div className="flex flex-col items-center justify-center w-full h-full min-h-[80px] border-2 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
                      <span className="text-xs text-gray-500">+ Add Image</span>
                    </div>
                  </FileUploader>
                </div>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked: boolean) =>
                  setValue("is_active", !!checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (visible to users)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? "Saving..."
                : initialData
                  ? "Update University"
                  : "Create University"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
