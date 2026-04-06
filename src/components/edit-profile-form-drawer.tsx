import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Drawer, EditDrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { X, Save, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Player } from "@/types/player";
import { Judge } from "@/types/judge";
import { Gender } from "@/enums/gender";
import { isDevelopment } from "@/utils/enviroment";

type Props = {
  profile: Player | Judge;
  profileType: "Player" | "Judge";
  onClose: () => void;
  onSuccess?: () => void;
};

export function EditProfileFormDrawer({
  profile,
  profileType,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<Player | Judge>(profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleGenderChange(value: string) {
    setForm((prev) => ({
      ...prev,
      gender: value as Gender,
    }));
  }

  function handleDeckChange(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      deck: prev.deck.map((d, i) => (i === index ? value : d)),
    }));
  }

  function handleAddDeck() {
    setForm((prev) => ({
      ...prev,
      deck: [...prev.deck, ""],
    }));
  }

  function handleRemoveDeck(index: number) {
    setForm((prev) => ({
      ...prev,
      deck: prev.deck.filter((_, i) => i !== index),
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

      const response = await fetch("/api/edit-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalName: profile.name,
          profileData: {
            ...form,
            deck: form.deck?.filter((d) => d.trim() !== "") || [],
          },
          profileType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to update ${profileType.toLowerCase()}`,
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to update ${profileType.toLowerCase()}`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <EditDrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle className="flex justify-between items-center p-4 text-sm font-medium border-b">
            <div className="flex items-center gap-2">
              Edit {profileType}: {profile.name}
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
                <AlertDescription>
                  {profileType} updated successfully!
                </AlertDescription>
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
                  Name
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={80}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  IGN (In-Game Name)
                  <Input
                    name="ign"
                    placeholder="IGN"
                    value={form.ign}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={80}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Gender
                  <Select
                    value={form.gender}
                    onValueChange={handleGenderChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      <SelectItem value={Gender.PREFER_NOT_TO_SAY}>
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  City
                  <Input
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={80}
                    required
                  />
                </label>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Team
                  <Input
                    name="team"
                    placeholder="Team Name"
                    value={form.team}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={80}
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-sm">Decks</div>
                  {form.deck?.map((deck, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={deck}
                        onChange={(e) => handleDeckChange(idx, e.target.value)}
                        placeholder="Deck name"
                        className="flex-1 text-gray-700 rounded-sm"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveDeck(idx)}
                        disabled={form.deck?.length === 1}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddDeck}
                    className="w-fit"
                  >
                    Add Deck
                  </Button>
                </div>

                <label className="flex flex-col gap-1 text-sm font-medium">
                  Others
                  <Textarea
                    name="others"
                    placeholder="Additional information..."
                    value={form.others}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm min-h-[80px]"
                  />
                </label>
              </fieldset>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={saving || success}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="submit"
                  disabled={saving || success}
                  className="flex-1 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
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
