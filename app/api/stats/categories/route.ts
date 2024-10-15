import { SetTimeToMidnight } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }
  const { fromDate, toDate } = SetTimeToMidnight(
    queryParams.data.from,
    queryParams.data.to,
  );
  console.log("FROM", fromDate, "TO", toDate);
  const stats = await getCategoriesStats(user.id, fromDate, toDate);
  //   const stats = await getCategoriesStats(
  //     user.id,
  //     queryParams.data.from,
  //     queryParams.data.to,
  //   );
  return Response.json(stats);
}

export type getCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>;

const getCategoriesStats = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
};
