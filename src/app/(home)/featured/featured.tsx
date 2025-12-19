import { getImagePath } from "@/utils/enviroment";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

export type FeaturedItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  image: string;
  link: string;
};

export default function Featured() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/featured.json")
      .then((res) => res.json())
      .then((json) => setItems(json))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  }

  function getContent(item: FeaturedItem) {
    if (item.type === "player" || item.type === "judge") {
      return (
        <div className="flex justify-center items-center h-full w-full p-5 bg-[#F3F4F6]">
          <Image
            src={getImagePath(item.image)}
            alt={item.title}
            width={10}
            height={10}
            className="object-cover rounded-full h-full w-full max-h-[25vh] max-w-[25vh]"
          />
        </div>
      );
    } else if (item.type === "shop" || item.type === "event") {
      return (
        <Image
          src={getImagePath(item.image)}
          alt={item.title}
          width={10}
          height={10}
          className="object-cover rounded-none h-full w-full max-h-[40vh]"
        />
      );
    } else if (item.type === "video") {
      // Convert normal YouTube URL to embed URL if needed
      let embedUrl = item.link;
      const match = item.link.match(
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

  return (
    <div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item) => {
            const content = getContent(item);

            if (!content) {
              return null;
            }

            return (
              <CarouselItem key={item.id}>
                <Card className="w-full p-0 rounded-none border-[1px] shadow-none flex flex-col h-full">
                  <CardHeader className="p-5 py-3 border-b-[1px]">
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
                  <CardFooter className="flex justify-start text-sm p-5 py-3 border-t-[1px]">
                    <span>{item.description}</span>
                  </CardFooter>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselSlideInfo />
      </Carousel>
    </div>
  );
}
