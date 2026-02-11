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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Info,
  TextAlignJustify,
  Ban,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import { useJsonData } from "../data/api";
import { getJsonPath } from "@/utils/enviroment";

export default function BanlistPage() {
  const formats: BanlistFormat[] = ["ocg", "ae", "tcg"];
  const { data: banlist = [], loading } = useJsonData<Banlist>(
    getJsonPath("banlist.json"),
  );

  if (loading) return <Loading />;

  const getStatusIcon = (title: string) => {
    if (title.toLowerCase().includes("forbidden")) {
      return <Ban size={14} />;
    } else if (title.toLowerCase().includes("limited")) {
      return <ShieldAlert size={14} />;
    } else if (title.toLowerCase().includes("semi")) {
      return <AlertTriangle size={14} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="info" className="shadow-sm">
        <AlertDescription className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <Info size={14} className="text-blue-600" />
          <span>
            <span className="font-semibold">Click</span> on a format to expand,
            then use tabs to view different restriction levels.
          </span>
        </AlertDescription>
      </Alert>
      <Accordion
        type="multiple"
        className="flex flex-col gap-3"
        defaultValue={formats}
      >
        {banlist.map(({ format, effectiveFrom, list }) => (
          <AccordionItem key={format} value={format}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900">
                  <TextAlignJustify size={14} />
                </div>
                <div className="flex flex-col items-start gap-1">
                  <h2 className="text-sm font-medium tracking-wide uppercase text-blue-600 dark:text-blue-300">
                    {format}
                  </h2>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Effective From:{" "}
                    <span className="font-semibold">{effectiveFrom}</span>
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <Tabs
                defaultValue={list[0]?.title || "Forbidden"}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  {list.map((section) => (
                    <TabsTrigger
                      key={section.title}
                      value={section.title}
                      className="flex items-center gap-2"
                    >
                      {getStatusIcon(section.title)}
                      <span className="font-medium hidden xs:inline">
                        {section.title}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {list.map((section) => (
                  <TabsContent key={section.title} value={section.title}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(section.title)}
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {section.cards.length} {section.title} Card
                          {section.cards.length !== 1 ? "s" : ""}
                        </h3>
                      </div>
                      <DataTable
                        columns={columns}
                        searchColumn="name"
                        data={section.cards}
                        compact={true}
                        pagination={false}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
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
