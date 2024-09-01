"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
}

const generateNextMonthsData = (currentMonth: number) => {
  let nextMonthsData = [];
  for (let i = 0; i < 5; i++) {
    let monthNumber = (currentMonth + i) % 12 || 12;
    let monthName = getMonthName(monthNumber);
    nextMonthsData.push({ month: monthName, desktop: 0 });
  }
  return nextMonthsData;
}

export default function Chart({ className }: { className?: string }) {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    const getChartDetails = async () => {
      try {
        const response = await axios.get('/api/get-chart-details');
        const { data } = response.data;
        console.log(data);
        

        if (data && data.length > 0) {
          const chartDetails = data.map((item: any) => ({
            month: getMonthName(item.month),
            desktop: item.count,
          }));

          const currentMonth = new Date().getMonth() + 1;
          const nextMonthsData = generateNextMonthsData(currentMonth);

          setChartData([...chartDetails, ...nextMonthsData]);
        }

      } catch (error) {
        console.log(error);
      }
    }
    getChartDetails();
  }, []);

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig