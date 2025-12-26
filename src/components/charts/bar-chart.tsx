"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type BarChartDatum = {
  [key: string]: string | number;
};

type ChartBarProps = {
  data: BarChartDatum[];
  config: ChartConfig;
  dataKey: string;
  nameKey: string;
  title?: string;
  description?: string;
};

export function ChartBar({
  data,
  config,
  dataKey,
  nameKey,
  title,
  description = "",
}: ChartBarProps) {
  return (
    <Card className="flex flex-col p-0 text-sm rounded-sm border-[1px] shadow-none">
      <CardHeader className="items-center pt-5 pb-3">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey={nameKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "string" ? value.slice(0, 3) : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={dataKey} radius={8}>
              {data.map((entry) => (
                <Cell
                  key={`cell-${entry[nameKey]}`}
                  fill={config[entry[nameKey]]?.color || "var(--color-desktop)"}
                />
              ))}
              <LabelList
                position="top"
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
