import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const OverviewQuerySchema = z
  .object({
    // ฟิลด์ 'from' และ 'to' ต้องเป็นวันที่
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((args) => {
    // ใช้ refine เพื่อเพิ่มการตรวจสอบเงื่อนไขเพิ่มเติมให้กับ schema
    const { from, to } = args;
    const days = differenceInDays(to, from);
    // ตรวจสอบช่วงวันที่ (to >= from และไม่เกิน MAX_DATE_RANGE_DAYS)
    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange; // return true ถ้าช่วงวันที่ถูกต้อง
  });
