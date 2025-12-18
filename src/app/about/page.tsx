"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useJsonData } from "../data/api";
import { getJsonPath } from "@/utils/enviroment";
import { AboutPageJson } from "@/types/json";
import { Loading } from "@/components/loading";

export default function About() {
  const { data, loading } = useJsonData<AboutPageJson[]>(
    getJsonPath("about.json")
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Accordion type="multiple" className="w-full">
      {data.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
