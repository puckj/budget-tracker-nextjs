"use client";

import { getCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helper";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

const CategoriesStats = ({ userSettings, from, to }: Props) => {
  const statsQuery = useQuery<getCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      ).then((res) => res.json()),
    refetchOnWindowFocus: false,
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          data={statsQuery.data || []}
          type="income"
          formatter={formatter}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          data={statsQuery.data || []}
          type="expense"
          formatter={formatter}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;

const CategoriesCard = ({
  data,
  type,
  formatter,
}: {
  data: getCategoriesStatsResponseType;
  type: TransactionType;
  formatter: Intl.NumberFormat;
}) => {
  const filteredData = data.filter((el) => el.type === type);
  //   console.log(filteredData, "filteredData");

  // ใช้ฟังก์ชัน reduce() ใช้สำหรับการรวบรวมข้อมูลในอาเรย์ไปเป็นค่าหนึ่งเดียว
  const total = filteredData.reduce(
    // ฟังก์ชันคอลแบ็กที่ใช้สำหรับการรวบรวมข้อมูล
    (acc, el) =>
      // acc: ค่าที่เก็บสะสมอยู่ (accumulator) เริ่มต้นที่ 0
      // el: อ็อบเจ็กต์ปัจจุบันในอาเรย์ filteredData
      // เพิ่มค่า amount จาก _sum ของอ็อบเจ็กต์ปัจจุบัน หรือ 0 ถ้าไม่มี
      acc + (el._sum?.amount || 0),
    0, // initial value เป็น 0
  );

  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Incomes" : "Expenses"} by category
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            No data for the selected period
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map((item, index) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};
