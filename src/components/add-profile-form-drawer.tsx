import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { X, Megaphone, Heart, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { v4 as uuidv4 } from "uuid";
import { Gender } from "@/enums/gender";
import { isDevelopment } from "@/utils/enviroment";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Player } from "@/columns/players";

type Props = {
  onClose: () => void;
};

type ProfileType = "Player" | "Judge";

export function AddProfileFormDrawer({ onClose }: Props) {
  const [profileType, setProfileType] = useState<ProfileType>("Player");
  const [form, setForm] = useState<Player>({
    name: "",
    ign: "",
    imagePath: "",
    gender: Gender.MALE,
    city: "",
    team: "",
    deck: [],
    others: "",
  });

  const [decks, setDecks] = useState<string[]>([""]);
  const [copied, setCopied] = useState(false);
  const [profileId, setProfileId] = useState<string>(uuidv4());

  // Auto-generate image path from name
  function getImagePath(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .concat(".webp");
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleDeckChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { value } = e.target;
    setDecks((prev) => prev.map((deck, i) => (i === idx ? value : deck)));
  }

  function handleAddDeck() {
    setDecks((prev) => [...prev, ""]);
  }

  function handleRemoveDeck(idx: number) {
    setDecks((prev) => prev.filter((_, i) => i !== idx));
  }

  function getProfileJson() {
    const gender = Object.entries(Gender).find(
      ([, value]) => value === form.gender
    )?.[0];

    return {
      id: profileId,
      ...form,
      imagePath: getImagePath(form.name),
      gender,
      deck: decks.filter((d) => d.trim() !== ""),
      type: profileType,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const jsonData = JSON.stringify(getProfileJson(), null, 2);

    const subject =
      profileType === "Judge"
        ? "Judge Listing Request: ygophmeta"
        : "Player Listing Request: ygophmeta";
    const body = encodeURIComponent(
      `I consent to my data being used and displayed publicly on ygophmeta.\n\n${profileType} Data:\n${jsonData}`
    );
    const mailto = `mailto:richmondreglo25@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
    window.open(mailto, "_blank");
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <DrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle className="flex justify-between items-center p-4 text-sm font-medium border-b">
            <div className="flex items-center gap-2">
              Submit {profileType} Profile
            </div>
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </DrawerTitle>
          <div className="flex flex-col items-center flex-1 gap-4 overflow-auto p-4 ">
            <Alert variant="info">
              <AlertTitle className="font-semibold flex items-center gap-2">
                <Megaphone size={14} />
                <span>Notice</span>
              </AlertTitle>
              <AlertDescription className="text-sm pt-1">
                By submitting this form, you permit this site to use and display
                your submitted data publicly.
              </AlertDescription>
            </Alert>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              {/* Profile Type Select */}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Profile Type
                <Select
                  value={profileType}
                  onValueChange={(value) =>
                    setProfileType(value as ProfileType)
                  }
                  required
                >
                  <SelectTrigger className="w-full text-gray-700 rounded-sm shadow-none">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Player">Player</SelectItem>
                    <SelectItem value="Judge">Judge</SelectItem>
                  </SelectContent>
                </Select>
              </label>
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
                IGN
                <Input
                  name="ign"
                  placeholder="In-Game Name"
                  value={form.ign}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  maxLength={80}
                  required={profileType === "Player"}
                  disabled={profileType === "Judge"}
                />
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
                  placeholder="Team (optional)"
                  value={form.team}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  maxLength={80}
                  disabled={profileType === "Judge"}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Gender
                <Select
                  name="gender"
                  value={form.gender}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      gender: value as Gender,
                    }))
                  }
                  required
                >
                  <SelectTrigger className="w-full text-gray-700 rounded-sm shadow-none">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Gender).map((g) => (
                      <SelectItem key={g} value={g}>
                        {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Image Path (auto-generated)
                <Input
                  name="imagePath"
                  placeholder="Auto-generated"
                  value={getImagePath(form.name)}
                  disabled
                  className="w-full text-gray-700 rounded-sm"
                />
              </label>

              {/* Decks Section (Player only) */}
              {profileType === "Player" && (
                <div>
                  <div className="font-semibold mb-2 text-sm">
                    Decks Played (add at least one)
                  </div>
                  {decks.map((deck, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        name="deck"
                        placeholder="Deck Name"
                        value={deck}
                        onChange={(e) => handleDeckChange(idx, e)}
                        className="flex-1 text-gray-700 rounded-sm"
                        maxLength={80}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex items-center justify-center text-xs rounded-full"
                        onClick={() => handleRemoveDeck(idx)}
                        disabled={decks.length === 1}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-end mt-2">
                    <Button
                      type="button"
                      variant="submit"
                      className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-sm"
                      onClick={handleAddDeck}
                    >
                      <Plus size={14} />
                      <span>Add Deck</span>
                    </Button>
                  </div>
                </div>
              )}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Others / Notes
                <Textarea
                  name="others"
                  placeholder={
                    profileType === "Judge"
                      ? "Judge info, certifications, notes"
                      : "Other info, notes, or achievements"
                  }
                  value={form.others}
                  onChange={handleChange}
                  className="w-full text-sm font-normal text-gray-700 rounded-sm shadow-none max-h-[150px]"
                  maxLength={200}
                />
              </label>
              {/* Image Upload Info Alert */}
              <Alert variant="info">
                <AlertTitle className="font-semibold flex items-center gap-2">
                  <Megaphone size={14} />
                  <span>Optional Image Upload</span>
                </AlertTitle>
                <AlertDescription className="text-sm pt-1">
                  You may upload a profile image.
                  <br />
                  For best display, use a <b>1:1 aspect ratio</b> and{" "}
                  <b>.webp</b> format.
                  <br />
                  <span className="italic">
                    This helps the site load images faster and look better on
                    all devices.
                  </span>
                </AlertDescription>
              </Alert>
              {/* Contribution Thanks */}
              <Alert variant="info">
                <AlertTitle className="font-semibold flex items-center gap-2">
                  <Heart size={14} />
                  <span>Thank you for your contribution!</span>
                </AlertTitle>
                <AlertDescription className="text-sm pt-1">
                  We appreciate your support for the community!
                </AlertDescription>
              </Alert>
              {/* Submit Email Danger Alert */}
              <Alert variant="warning">
                <AlertTitle className="font-semibold">
                  Important: Email Submission Required
                </AlertTitle>
                <AlertDescription className="text-sm pt-2 select-text">
                  Clicking <b>Submit</b> will open your email client to send
                  your {profileType.toLowerCase()} data.
                  <br />
                  <span className="font-semibold">
                    If this does not work, you can manually email your{" "}
                    {profileType.toLowerCase()} data to:
                  </span>
                  <div className="mt-2">
                    <b>Email:</b> richmondreglo25@gmail.com
                    <br />
                    <b>Subject:</b>{" "}
                    {profileType === "Judge"
                      ? "Judge Listing Request: ygophmeta"
                      : "Player Listing Request: ygophmeta"}
                  </div>
                  <div className="mt-2">
                    Please include your consent and the{" "}
                    {profileType.toLowerCase()} JSON data shown below.
                  </div>
                </AlertDescription>
              </Alert>
              {/* Sample JSON Preview */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="json-preview">
                  <AccordionTrigger className="text-sm font-medium px-0 py-2 rounded-sm">
                    Show JSON Preview
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        className="absolute top-2 right-2 z-10 rounded-sm"
                        onClick={() => {
                          const json = JSON.stringify(
                            getProfileJson(),
                            null,
                            2
                          );
                          navigator.clipboard.writeText(json);
                          setCopied(true);
                          setTimeout(() => {
                            if (isDevelopment()) {
                              setProfileId(uuidv4());
                            }
                            setCopied(false);
                          }, 1500);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <div className="bg-gray-100 border border-gray-300 text-xs font-mono p-4 whitespace-pre-wrap rounded-sm">
                        {JSON.stringify(getProfileJson(), null, 2)}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="cancel"
                  className="rounded-sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button variant="submit" type="submit" className="rounded-sm">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
