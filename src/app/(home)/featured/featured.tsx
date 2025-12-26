"use client";

import { useMediaQuery } from "react-responsive";
import { getImagePath, getJsonPath } from "@/utils/enviroment";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselSlideInfo,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTypeBadgeClass } from "@/utils/featured";
import { useJsonData } from "@/app/data/api";
import { Sparkle } from "lucide-react";
import Autoplay, { AutoplayType } from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export type FeaturedItem = {
  id: string;
  type: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
};

// Each group now has { itemsPerSlide, items }
type FeaturedGroup = {
  itemsPerSlide?: number;
  items: FeaturedItem[];
};
type FeaturedJson = Record<string, FeaturedGroup>;

function getContent(item: FeaturedItem) {
  if (item.type === "player" || item.type === "judge") {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E3E8F0] to-[#F3F5F8] h-full w-full p-5">
        {item.image && (
          <Avatar key={item.id} className="flex justify-center items-center">
            <AvatarImage
              src={getImagePath(item.image)}
              alt={item.title}
              loading="lazy"
              className="object-cover rounded-full h-[150px] w-[150px] border-4 border-white shadow-lg"
            />
            <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
              Unable to load image
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  } else if (item.type === "shop" || item.type === "event") {
    return (
      item.image && (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E3E8F0] to-[#F3F5F8] h-full w-full p-5 ">
          <Avatar key={item.id} className="flex justify-center items-center">
            <AvatarImage
              src={getImagePath(item.image)}
              alt={item.title}
              loading="lazy"
              className="object-cover rounded-full h-[150px] w-[150px] border-4 border-white shadow-lg"
            />
            <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
              Unable to load image
            </AvatarFallback>
          </Avatar>
        </div>
      )
    );
  } else if (item.type === "video") {
    let embedUrl = item.link;
    const match = item.link?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    if (match) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
    }
    return (
      <div className="w-full h-0 pb-[56.25%] relative">
        <iframe
          src={embedUrl}
          title={item.title}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; useautoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  } else {
    return null;
  }
}

function renderCarousel(
  items: FeaturedItem[],
  itemsPerSlide: number = 1,
  autoplayInstance: AutoplayType
) {
  if (!items || items.length === 0) return null;
  return (
    <Carousel
      plugins={[autoplayInstance]}
      opts={{
        align: "start",
        loop: true,
        startIndex: Math.floor(Math.random() * items.length),
      }}
      itemsPerSlide={itemsPerSlide}
    >
      <CarouselContent>
        {items.map((item) => {
          const content = getContent(item);
          if (!content) return null;

          const applyFooterBorder =
            item.type !== "video" && item.type !== "event";
          return (
            <CarouselItem key={item.id}>
              <Card className="w-full p-0 rounded-sm border-none shadow-none flex flex-col h-full">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-md flex justify-between items-center gap-2">
                    {item.title}
                    <span
                      className={`text-xs capitalize px-2 py-1 rounded-sm ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`flex-1 flex flex-col justify-center items-center p-0 m-0 ${
                    applyFooterBorder
                      ? "border-[1px] border-b-0 rounded-t-sm overflow-hidden"
                      : ""
                  }`}
                >
                  {content}
                </CardContent>
                {item.description && (
                  <CardFooter
                    className={`flex flex-col items-center text-sm p-3 ${
                      applyFooterBorder
                        ? "border-[1px] rounded-b-sm"
                        : "border-t-[1px]"
                    }`}
                  >
                    {Array.isArray(item.description) ? (
                      item.description.map((desc, idx) => (
                        <span key={idx}>{desc}</span>
                      ))
                    ) : (
                      <span>{item.description}</span>
                    )}
                  </CardFooter>
                )}
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselSlideInfo />
    </Carousel>
  );
}

export default function Featured() {
  const isSm = useMediaQuery({ maxWidth: 767 });
  const { data, loading } = useJsonData<FeaturedJson>(
    getJsonPath("featured.json")
  );

  if (loading || !data) {
    return null;
  }

  // Create a unique autoplay instance for each carousel group
  const autoplayRefs = Object.keys(data).reduce((acc, group) => {
    acc[group] = Autoplay({
      delay: 7000,
      playOnInit: true,
      stopOnInteraction: true,
    });
    return acc;
  }, {} as Record<string, AutoplayType>);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-xs font-normal italic">
        <Sparkle size={10} />
        <span>Featured</span>
      </div>
      <div className="flex flex-col gap-5">
        {Object.entries(data).map(([group, groupData]) =>
          Array.isArray(groupData.items) && groupData.items.length > 0 ? (
            <div key={group}>
              {renderCarousel(
                groupData.items,
                isSm ? 1 : groupData.itemsPerSlide ?? 1,
                autoplayRefs[group]
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
