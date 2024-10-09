"use server";

import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { amount, category, date, description, type } = parsedBody.data;
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("category not found");
  }

  // NOTE: อย่าสับสนระหว่าง prisma.$transaction (method ของ prisma) และ prisma.transaction (table ของเรา)
  // ใช้ prisma.$transaction เพื่อรันหลายคำสั่งแบบเป็นกลุ่ม
  // หากคำสั่งใดล้มเหลว คำสั่งทั้งหมดจะถูก rollback
  await prisma.$transaction([
    //Create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // Update month aggregates table
    // ใช้ prisma.upsert เพื่อค้นหา record ที่ตรงกับ userId, day, month, year
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      // หากไม่พบ record จะสร้างใหม่ (ตามข้อมูลใน `create`)
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      // หากพบ record อยู่แล้ว จะทำการอัปเดตข้อมูล (ตามข้อมูลใน `update`)
      update: {
        expense: {
          // increment: เพิ่มค่าที่ระบุไปยังค่าเดิมในฐานข้อมูล (ไม่ใช่การแทนที่)
          // หาก type ตรงตามเงื่อนไขก็จะเพิ่มค่า amount เข้าไป แต่หากไม่จะเพิ่มค่า 0 (ไม่เพิ่มค่า)
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // Update year aggregates table
    // ใช้ prisma.upsert เพื่อค้นหา record ที่ตรงกับ userId, day, month, year
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      // หากไม่พบ record จะสร้างใหม่ (ตามข้อมูลใน `create`)
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      // หากพบ record อยู่แล้ว จะทำการอัปเดตข้อมูล (ตามข้อมูลใน `update`)
      update: {
        expense: {
          // increment: เพิ่มค่าที่ระบุไปยังค่าเดิมในฐานข้อมูล (ไม่ใช่การแทนที่)
          // หาก type ตรงตามเงื่อนไขก็จะเพิ่มค่า amount เข้าไป แต่หากไม่จะเพิ่มค่า 0 (ไม่เพิ่มค่า)
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
