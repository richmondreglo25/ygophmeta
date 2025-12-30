"use client";

import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
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
    <Card className="flex flex-col p-0 text-sm h-full w-full rounded-sm border-[1px] shadow-none">
      <CardHeader className="items-center pt-5 pb-0">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-5">
        <ChartContainer
          config={config}
          className="mx-auto w-full max-w-xs min-h-[320px]"
        >
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  startAngle={0}
                  endAngle={360}
                  labelLine={false}
                  outerRadius="80%"
                >
                  {data.map((entry) => (
                    <Cell
                      key={`cell-${entry[nameKey]}`}
                      fill={config[entry[nameKey]]?.color ?? "#ccc"}
                    />
                  ))}
                </Pie>

                <ChartLegend
                  content={<ChartLegendContent nameKey={nameKey} />}
                  className="flex flex-wrap justify-center gap-3 gap-y-1.5 mx-auto text-xs"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
