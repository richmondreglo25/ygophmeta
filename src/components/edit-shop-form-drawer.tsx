import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Drawer, EditDrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { X, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { Shop } from "@/types/shop";
import { isDevelopment } from "@/utils/enviroment";

type Props = {
  shop: Shop;
  onClose: () => void;
  onSuccess?: () => void;
};

export function EditShopFormDrawer({ shop, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Shop>(shop);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm(shop);
  }, [shop]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "activePlayers" ? parseInt(value) || 0 : value,
    }));
  }

  function handleArrayChange(field: "accolades", index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  }

  function handleAddArrayItem(field: "accolades") {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  }

  function handleRemoveArrayItem(field: "accolades", index: number) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // In development mode, allow editing
      if (!isDevelopment()) {
        setError("Editing is only available in development mode");
        setSaving(false);
        return;
      }

      const response = await fetch("/api/edit-shop", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalName: shop.name,
          shopData: {
            ...form,
            accolades: form.accolades?.filter((a) => a.trim() !== "") || [],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update shop");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update shop");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <EditDrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-md">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle className="flex justify-between items-center p-4 text-sm font-medium border-b">
            <div className="flex items-center gap-2">
              Edit Shop: {shop.name}
            </div>
            <X
              size={18}
              className={`cursor-pointer ${
                saving || success
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-70"
              }`}
              onClick={() => {
                if (!saving && !success) {
                  onClose();
                }
              }}
            />
          </DrawerTitle>
          <div className="flex flex-col items-center flex-1 gap-4 overflow-auto p-4">
            {error && (
              <Alert variant="warning">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Shop updated successfully!</AlertDescription>
              </Alert>
            )}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
            >
              <fieldset
                disabled={saving || success}
                className="flex flex-col gap-5"
              >
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Shop Name
                  <Input
                    name="name"
                    placeholder="Shop Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={80}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Address
                  <Input
                    name="address"
                    placeholder="Full Address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={200}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Google Maps URL
                  <Input
                    name="googleMaps"
                    placeholder="Google Maps URL"
                    value={form.googleMaps}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={200}
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Open Hours
                  <Textarea
                    name="openHours"
                    placeholder="Mon-Fri: 10:00 AM - 10:00 PM"
                    value={form.openHours}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm min-h-[80px]"
                    required
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Active Players
                  <Input
                    name="activePlayers"
                    type="number"
                    placeholder="Number of active players"
                    value={form.activePlayers}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    min="0"
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  About
                  <Textarea
                    name="about"
                    placeholder="About the shop..."
                    value={form.about}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm min-h-[100px]"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-sm">Accolades</div>
                  {form.accolades?.map((accolade, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={accolade}
                        onChange={(e) =>
                          handleArrayChange("accolades", idx, e.target.value)
                        }
                        placeholder="Accolade"
                        className="flex-1 text-gray-700 rounded-sm"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveArrayItem("accolades", idx)}
                        disabled={form.accolades?.length === 1}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddArrayItem("accolades")}
                    className="w-fit"
                  >
                    Add Accolade
                  </Button>
                </div>
              </fieldset>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="cancel"
                  onClick={onClose}
                  disabled={saving || success}
                  className="rounded-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="submit"
                  disabled={saving || success}
                  className="rounded-sm flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </EditDrawerContent>
    </Drawer>
  );
}
