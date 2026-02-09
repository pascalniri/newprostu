"use client";

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

export default function CreateUniversityDialog({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const {
    createUniversity,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    errors,
    isSubmitting,
  } = useUniversities();

  const isActive = watch("is_active");

  const onSubmit = async (data: UniversityFormData) => {
    const result = await createUniversity({
      ...data,
      is_active: data.is_active ?? true,
    });

    if (result?.success) {
      reset();
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
            <DialogTitle>Create University</DialogTitle>
            <DialogDescription>
              Add a new university to the platform. Include coordinates for map
              display.
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
              {isSubmitting ? "Creating..." : "Create University"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
