"use client";

import { useMediaQuery } from "react-responsive";
import { getImagePath, getJsonPath } from "@/utils/enviroment";
import Image from "next/image";
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
import { Sparkle, Star } from "lucide-react";

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
      <div className="flex justify-center items-center h-full w-full p-5 bg-[#F3F4F6]">
        {item.image && (
          <Image
            src={getImagePath(item.image)}
            alt={item.title}
            width={10}
            height={10}
            className="object-cover rounded-full h-full w-full max-h-[25vh] max-w-[25vh]"
          />
        )}
      </div>
    );
  } else if (item.type === "shop" || item.type === "event") {
    return (
      item.image && (
        <Image
          src={getImagePath(item.image)}
          alt={item.title}
          width={10}
          height={10}
          className="object-cover rounded-none h-full w-full max-h-[40vh]"
        />
      )
    );
  } else if (item.type === "video") {
    let embedUrl = item.link;
    const match = item.link?.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    if (match) {
      embedUrl = `https://www.youtube.com/embed/${match[1]}`;
    }
    return (
      <div className="w-full h-0 pb-[56.25%] relative">
        <iframe
          src={embedUrl}
          title={item.title}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  } else {
    return null;
  }
}

function renderCarousel(items: FeaturedItem[], itemsPerSlide: number = 1) {
  if (!items || items.length === 0) return null;
  return (
    <Carousel
      itemsPerSlide={itemsPerSlide}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {items.map((item) => {
          const content = getContent(item);
          if (!content) return null;
          return (
            <CarouselItem key={item.id}>
              <Card className="w-full p-0 rounded-none border-none shadow-none flex flex-col h-full">
                <CardHeader className="p-0 pb-3 border-b-[1px]">
                  <CardTitle className="text-md flex justify-between items-center gap-2">
                    {item.title}
                    <span
                      className={`px-2 py-1 text-xs capitalize ${getTypeBadgeClass(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center items-center p-0 m-0">
                  {content}
                </CardContent>
                {item.description && (
                  <CardFooter className="flex justify-start text-sm px-0 py-3 border-t-[1px]">
                    <span>{item.description}</span>
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-xs font-normal italic">
        <Sparkle size={10} />
        <span>Featured Items</span>
      </div>
      <div className="flex flex-col gap-1">
        {Object.entries(data).map(([group, groupData]) =>
          Array.isArray(groupData.items) && groupData.items.length > 0 ? (
            <div key={group}>
              {renderCarousel(
                groupData.items,
                isSm ? 1 : groupData.itemsPerSlide ?? 1 // <-- always fallback to 1 if not set
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
