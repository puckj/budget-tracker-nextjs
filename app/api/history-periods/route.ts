/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(_request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const periods = await getHistoryPeriods(user.id);
  return Response.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

const getHistoryPeriods = async (userId: string) => {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId,
    },
    select: {
      year: true,
    },
    distinct: ["year"],
    orderBy: [
      {
        year: "asc",
      },
    ],
  });

  // ฟังก์ชัน map() จะวนผ่านแต่ละอ็อบเจ็กต์ใน result และดึงค่า year ออกมาเก็บในอาร์เรย์ years
  // ตัวอย่างเช่น หาก result เป็น [{ year: 2023 }, { year: 2024 }]
  // ผลลัพธ์จะเป็นอาร์เรย์ years = [2023, 2024]
  const years = result.map((el) => el.year);

  if (years.length === 0) {
    return [new Date().getFullYear()];
  }
  return years;
};
