"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useJsonData } from "../data/api";
import { getJsonPath } from "@/utils/enviroment";
import { AboutJson } from "@/types/json";
import { Loading } from "@/components/loading";
import { Facebook } from "@/components/facebook";

export default function About() {
  const { data, loading } = useJsonData<AboutJson[]>(getJsonPath("about.json"));

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Facebook Follow */}
      <Facebook />

      {/* About Accordion */}
      <Accordion type="multiple" className="w-full">
        {data.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="hover:no-underline">
              <span className="font-medium text-sm">{item.title}</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 dark:text-gray-300">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
