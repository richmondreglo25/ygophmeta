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
  maxItems?: number;
};

const CHART_PIE_OTHER_COLOR = "#d3d3d3";

export function ChartPie({
  data,
  config,
  dataKey,
  nameKey,
  title,
  description,
  maxItems,
}: ChartPieProps) {
  // Dynamically group all items with the lowest value as "Other" if maxItems is set.
  let displayData = data;
  let displayConfig = config;

  if (typeof maxItems === "number" && data.length > maxItems) {
    const sorted = [...data].sort(
      (a, b) => Number(b[dataKey]) - Number(a[dataKey])
    );

    // Find the minimum and maximum value among the items.
    const minValue = Number(sorted[sorted.length - 1][dataKey]);
    const maxValue = Number(sorted[0][dataKey]);

    // If all values are equal, do not group them.
    if (minValue !== maxValue) {
      // Find all items with the minimum value.
      const itemsWithMinValue = sorted.filter(
        (item) => Number(item[dataKey]) === minValue
      );

      // If grouping all min-value items keeps us within maxItems, group them.
      if (sorted.length - itemsWithMinValue.length + 1 <= maxItems) {
        const mainItems = sorted.slice(
          0,
          sorted.length - itemsWithMinValue.length
        );
        const otherValue = itemsWithMinValue.reduce(
          (sum, item) => sum + Number(item[dataKey]),
          0
        );
        const otherLabel = otherValue > 1 ? "Others" : "Other";

        displayData = [
          ...mainItems,
          {
            [nameKey]: otherLabel,
            [dataKey]: otherValue,
          },
        ];

        displayConfig = {
          ...mainItems.reduce((acc, item) => {
            acc[item[nameKey]] = config[item[nameKey]];
            return acc;
          }, {} as ChartConfig),
          [otherLabel]: {
            color: CHART_PIE_OTHER_COLOR,
            label: `${otherLabel} (${otherValue})`,
          },
        };
      } else {
        // Otherwise, just group the last items to fit maxItems.
        const mainItems = sorted.slice(0, maxItems - 1);
        const otherItems = sorted.slice(maxItems - 1);
        const otherValue = otherItems.reduce(
          (sum, item) => sum + Number(item[dataKey]),
          0
        );
        const otherLabel = otherValue > 1 ? "Others" : "Other";

        displayData = [
          ...mainItems,
          {
            [nameKey]: otherLabel,
            [dataKey]: otherValue,
          },
        ];

        displayConfig = {
          ...mainItems.reduce((acc, item) => {
            acc[item[nameKey]] = config[item[nameKey]];
            return acc;
          }, {} as ChartConfig),
          [otherLabel]: {
            color: CHART_PIE_OTHER_COLOR,
            label: `${otherLabel} (${otherValue})`,
          },
        };
      }
    }
  }

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
          config={displayConfig}
          className="mx-auto w-full max-w-xs min-h-[320px]"
        >
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Pie
                  data={displayData}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  startAngle={0}
                  endAngle={360}
                  labelLine={false}
                  outerRadius="80%"
                >
                  {displayData.map((entry) => (
                    <Cell
                      key={`cell-${entry[nameKey]}`}
                      fill={displayConfig[entry[nameKey]]?.color ?? "#ccc"}
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
