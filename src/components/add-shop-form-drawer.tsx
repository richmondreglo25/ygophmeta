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
import { isDevelopment } from "@/utils/enviroment";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Shop } from "@/types/shop";

type Props = {
  onClose: () => void;
};

export function AddShopFormDrawer({ onClose }: Props) {
  const [form, setForm] = useState<Shop>({
    name: "",
    logo: "",
    images: [""],
    address: "",
    googleMaps: "",
    openHours: "",
    tournamentSchedule: [{ day: "", time: "", event: "" }],
    accolades: [""],
    activePlayers: 0,
    about: "",
  });

  const [openHoursRanges, setOpenHoursRanges] = useState<
    { startDay: string; endDay: string; startTime: string; endTime: string }[]
  >([{ startDay: "", endDay: "", startTime: "", endTime: "" }]);
  const [tournamentSchedule, setTournamentSchedule] = useState<
    { day: string; time: string; event: string; customEvent: string }[]
  >([{ day: "", time: "", event: "", customEvent: "" }]);
  const [accolades, setAccolades] = useState<string[]>([""]);
  const [copied, setCopied] = useState(false);
  const [shopId, setShopId] = useState<string>(uuidv4());

  // Auto-generate logo path from name
  function getLogoPath(name: string) {
    return `/shops/${name.toLowerCase().replace(/[^a-z0-9]/g, "")}logo.webp`;
  }

  // Convert 24-hour time to 12-hour format
  function formatTimeTo12Hour(time24: string): string {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  // Abbreviate day names
  function abbreviateDay(day: string): string {
    const abbrevs: { [key: string]: string } = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };
    return abbrevs[day] || day;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "activePlayers" ? parseInt(value) || 0 : value,
    }));
  }

  function handleOpenHoursChange(
    idx: number,
    key: "startDay" | "endDay" | "startTime" | "endTime",
    value: string,
  ) {
    setOpenHoursRanges((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    );
  }

  function handleAddOpenHours() {
    setOpenHoursRanges((prev) => [
      ...prev,
      { startDay: "", endDay: "", startTime: "", endTime: "" },
    ]);
  }

  function handleRemoveOpenHours(idx: number) {
    setOpenHoursRanges((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleScheduleChange(
    idx: number,
    key: "day" | "time" | "event" | "customEvent",
    value: string,
  ) {
    setTournamentSchedule((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
    );
  }

  function handleAddSchedule() {
    setTournamentSchedule((prev) => [
      ...prev,
      { day: "", time: "", event: "", customEvent: "" },
    ]);
  }

  function handleRemoveSchedule(idx: number) {
    setTournamentSchedule((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAccoladeChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { value } = e.target;
    setAccolades((prev) => prev.map((acc, i) => (i === idx ? value : acc)));
  }

  function handleAddAccolade() {
    setAccolades((prev) => [...prev, ""]);
  }

  function handleRemoveAccolade(idx: number) {
    setAccolades((prev) => prev.filter((_, i) => i !== idx));
  }

  function getShopJson() {
    // Trim all string fields in form.
    const trimmedForm = Object.fromEntries(
      Object.entries(form).map(([k, v]) =>
        typeof v === "string" ? [k, v.trim()] : [k, v],
      ),
    );

    // Format open hours
    const formattedRanges = openHoursRanges
      .map((range) => {
        const startDay = range.startDay ? abbreviateDay(range.startDay) : "";
        const endDay = range.endDay ? abbreviateDay(range.endDay) : "";
        const startTime = range.startTime
          ? formatTimeTo12Hour(range.startTime)
          : "";
        const endTime = range.endTime ? formatTimeTo12Hour(range.endTime) : "";
        return startDay && endDay && startTime && endTime
          ? `${startDay}-${endDay}: ${startTime} - ${endTime}`
          : "";
      })
      .filter((range) => range !== "");
    const openHours = formattedRanges.join("\n");

    return {
      id: shopId,
      ...trimmedForm,
      openHours,
      tournamentSchedule: tournamentSchedule
        .map((item) => ({
          day: item.day.trim(),
          time: formatTimeTo12Hour(item.time),
          event:
            item.event === "Other"
              ? item.customEvent.trim()
              : item.event.trim(),
        }))
        .filter((item) => item.day && item.time && item.event),
      accolades: accolades.map((acc) => acc.trim()).filter((acc) => acc !== ""),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const jsonData = JSON.stringify(getShopJson(), null, 2);

    const subject = "Shop Listing Request: ygophmeta";
    const body = encodeURIComponent(
      `I consent to my data being used and displayed publicly on ygophmeta.\n\nShop Data:\n${jsonData}`,
    );
    const mailto = `mailto:richmondreglo25@gmail.com?subject=${encodeURIComponent(
      subject,
    )}&body=${body}`;
    window.open(mailto, "_blank");
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <DrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle className="flex justify-between items-center p-4 text-sm font-medium border-b">
            <div className="flex items-center gap-2">Submit Shop Profile</div>
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </DrawerTitle>
          <div className="flex flex-col items-center flex-1 gap-4 overflow-auto p-4">
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
                Logo Path (auto-generated)
                <Input
                  name="logo"
                  placeholder="Auto-generated"
                  value={getLogoPath(form.name)}
                  disabled
                  className="w-full text-gray-700 rounded-sm"
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
                Google Maps
                <Input
                  name="googleMaps"
                  placeholder="Google Maps URL"
                  value={form.googleMaps}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  maxLength={200}
                />
              </label>
              <div>
                <div className="font-semibold mb-2 text-sm">Open Hours</div>
                <div className="flex flex-col gap-3">
                  {openHoursRanges.map((range, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 bg-gray-50 p-4 border border-gray-200 rounded-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          Hours Range {idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="flex items-center justify-center text-xs rounded-full"
                          onClick={() => handleRemoveOpenHours(idx)}
                          disabled={openHoursRanges.length === 1}
                        >
                          <Trash2 size={10} className="text-red-600" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <Select
                            value={range.startDay}
                            onValueChange={(value) =>
                              handleOpenHoursChange(idx, "startDay", value)
                            }
                          >
                            <SelectTrigger className="flex-1 bg-white">
                              <SelectValue placeholder="Start Day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">
                                Wednesday
                              </SelectItem>
                              <SelectItem value="Thursday">Thursday</SelectItem>
                              <SelectItem value="Friday">Friday</SelectItem>
                              <SelectItem value="Saturday">Saturday</SelectItem>
                              <SelectItem value="Sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm">-</span>
                          <Select
                            value={range.endDay}
                            onValueChange={(value) =>
                              handleOpenHoursChange(idx, "endDay", value)
                            }
                          >
                            <SelectTrigger className="flex-1 bg-white">
                              <SelectValue placeholder="End Day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">
                                Wednesday
                              </SelectItem>
                              <SelectItem value="Thursday">Thursday</SelectItem>
                              <SelectItem value="Friday">Friday</SelectItem>
                              <SelectItem value="Saturday">Saturday</SelectItem>
                              <SelectItem value="Sunday">Sunday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="time"
                            value={range.startTime}
                            onChange={(e) =>
                              handleOpenHoursChange(
                                idx,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className="flex-1 text-gray-700 bg-white rounded-sm"
                          />
                          <span className="text-sm">-</span>
                          <Input
                            type="time"
                            value={range.endTime}
                            onChange={(e) =>
                              handleOpenHoursChange(
                                idx,
                                "endTime",
                                e.target.value,
                              )
                            }
                            className="flex-1 text-gray-700 bg-white rounded-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="submit"
                    className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-sm"
                    onClick={handleAddOpenHours}
                  >
                    <Plus size={14} />
                    <span>Add Hours Range</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2 text-sm">
                  Tournament Schedule
                </div>
                <div className="flex flex-col gap-3">
                  {tournamentSchedule.map((schedule, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 bg-gray-50 p-4 border border-gray-200 rounded-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          Schedule {idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="flex items-center justify-center text-xs rounded-full"
                          onClick={() => handleRemoveSchedule(idx)}
                          disabled={tournamentSchedule.length === 1}
                        >
                          <Trash2 size={10} className="text-red-600" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Select
                          value={schedule.day}
                          onValueChange={(value) =>
                            handleScheduleChange(idx, "day", value)
                          }
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select Day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="time"
                          value={schedule.time}
                          onChange={(e) =>
                            handleScheduleChange(idx, "time", e.target.value)
                          }
                          className="w-full text-gray-700 bg-white rounded-sm"
                        />
                        <Select
                          value={schedule.event}
                          onValueChange={(value) =>
                            handleScheduleChange(idx, "event", value)
                          }
                        >
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="Select Event" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OCG Pod">OCG Pod</SelectItem>
                            <SelectItem value="AE Pod">AE Pod</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {schedule.event === "Other" && (
                          <div className="ml-4">
                            <label className="text-sm font-medium">
                              Custom Event
                            </label>
                            <Input
                              placeholder=""
                              value={schedule.customEvent}
                              onChange={(e) =>
                                handleScheduleChange(
                                  idx,
                                  "customEvent",
                                  e.target.value,
                                )
                              }
                              className="w-full text-gray-700 bg-white rounded-sm mt-1"
                              maxLength={50}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="submit"
                    className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-sm"
                    onClick={handleAddSchedule}
                  >
                    <Plus size={14} />
                    <span>Add Schedule</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2 text-sm">Accolades</div>
                {accolades.map((accolade, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      placeholder="Accolade"
                      value={accolade}
                      onChange={(e) => handleAccoladeChange(idx, e)}
                      className="flex-1 text-gray-700 rounded-sm"
                      maxLength={100}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center justify-center text-xs rounded-full"
                      onClick={() => handleRemoveAccolade(idx)}
                      disabled={accolades.length === 1}
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
                    onClick={handleAddAccolade}
                  >
                    <Plus size={14} />
                    <span>Add Accolade</span>
                  </Button>
                </div>
              </div>
              <label className="flex flex-col gap-1 text-sm font-medium">
                About
                <Textarea
                  name="about"
                  placeholder="About the shop"
                  value={form.about}
                  onChange={handleChange}
                  className="w-full text-sm font-normal text-gray-700 rounded-sm shadow-none max-h-[150px]"
                  maxLength={500}
                />
              </label>
              {/* Image Upload Info Alert */}
              <Alert variant="info">
                <AlertTitle className="font-semibold flex items-center gap-2">
                  <Megaphone size={14} />
                  <span>Optional Image Upload</span>
                </AlertTitle>
                <AlertDescription className="text-sm pt-1">
                  You may upload shop images.
                  <br />
                  For best display, use a <b>1:1 aspect ratio</b>.
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
                  your shop data.
                  <br />
                  <span className="font-semibold">
                    If this does not work, you can manually email your shop data
                    to:
                  </span>
                  <div className="mt-2">
                    <b>Email:</b> richmondreglo25@gmail.com
                    <br />
                    <b>Subject:</b> Shop Listing Request: ygophmeta
                  </div>
                  <div className="mt-2">
                    Please include your consent and the shop JSON data shown
                    below.
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
                          const json = JSON.stringify(getShopJson(), null, 2);
                          navigator.clipboard.writeText(json);
                          setCopied(true);
                          setTimeout(() => {
                            if (isDevelopment()) {
                              setShopId(uuidv4());
                            }
                            setCopied(false);
                          }, 1500);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <div className="bg-gray-100 border border-gray-300 text-xs font-mono p-4 whitespace-pre-wrap rounded-sm">
                        {JSON.stringify(getShopJson(), null, 2)}
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
