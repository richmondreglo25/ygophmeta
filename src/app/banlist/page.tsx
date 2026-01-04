"use client";

import { columns } from "@/columns/banlist";
import { DataTable } from "@/components/data-table";
import { Loading } from "@/components/loading";
import { Banlist, BanlistFormat } from "@/types/banlist";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info, TextAlignJustify } from "lucide-react";
import { useJsonData } from "../data/api";
import { getJsonPath } from "@/utils/enviroment";

export default function BanlistPage() {
  const formats: BanlistFormat[] = ["ocg", "tcg"];
  const { data: banlist = [], loading } = useJsonData<Banlist>(
    getJsonPath("banlist.json")
  );

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="info">
        <AlertDescription className="flex items-center gap-1.5 text-sm">
          <Info size={14} />
          <span>
            <span className="font-semibold">Click</span> on format to expand or
            collapse the respective banlist.
          </span>
        </AlertDescription>
      </Alert>
      <Accordion
        type="multiple"
        className="flex flex-col"
        defaultValue={formats}
      >
        {banlist.map(({ format, list }) => (
          <AccordionItem key={format} value={format}>
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <TextAlignJustify size={12} />
                <h2 className="text-sm font-semibold uppercase">{format}</h2>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-6">
                {list.map((section) => (
                  <div key={section.title} className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold">{section.title}</h3>
                    <DataTable
                      columns={columns}
                      data={section.cards}
                      compact={true}
                      pagination={false}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Alert variant="warning" className="p-4 mt-4">
        <AlertTitle className="flex items-center gap-2">
          <Info size={16} />
          Disclaimer
        </AlertTitle>
        <AlertDescription>
          This banlist is sourced from public Yu-Gi-Oh! data and community
          resources. Information may be outdated or incomplete. Always check
          official sources for the latest updates.
        </AlertDescription>
      </Alert>
    </div>
  );
}
