"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type PieChartDatum = {
  [key: string]: string | number;
};

type ChartPieProps = {
  data: PieChartDatum[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
};

export function ChartPie({
  data,
  config,
  dataKey,
  nameKey,
  title,
  description,
}: ChartPieProps) {
  return (
    <Card className="flex flex-col p-0 text-sm rounded-sm border-[1px] shadow-none">
      <CardHeader className="items-center pt-5 pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-5">
        <ChartContainer
          config={config}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-full w-full max-h-[500px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              startAngle={0}
              endAngle={360}
            >
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry[nameKey]}`}
                  fill={config[entry[nameKey]]?.color || "#ccc"}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey} />}
              className="flex flex-row flex-wrap gap-3 text-xs whitespace-nowrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
