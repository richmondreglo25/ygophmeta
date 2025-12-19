import { getImagePath } from "@/utils/enviroment";
import Image from "next/image";
import { useEffect, useState } from "react";
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
        <div className="p-5">
          <Image
            src={getImagePath(item.image)}
            alt={item.title}
            width={32}
            height={32}
            className="object-cover rounded-full w-32 h-32"
          />
        </div>
      );
    } else if (item.type === "shop" || item.type === "event") {
      return (
        <Image
          src={getImagePath(item.image)}
          alt={item.title}
          width={32}
          height={32}
          className="object-cover rounded-none w-full max-h-[25vh]"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => {
        const content = getContent(item);

        if (!content) {
          return null;
        }

        return (
          <Card
            key={item.id}
            className="w-full p-0 rounded-none border-[1px] shadow-none flex flex-col h-full"
          >
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
        );
      })}
    </div>
  );
}
