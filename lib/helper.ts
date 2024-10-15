import { Currencies } from "./currencies";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );
}

export function GetFormatterForCurrency(currency: string) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}

export function SetTimeToMidnight(from: Date, to: Date) {
  const fromDate = new Date(
    Date.UTC(
      new Date(from).getUTCFullYear(),
      new Date(from).getUTCMonth(),
      new Date(from).getUTCDate(),
      0,
      0,
      0, // Set hours, minutes, seconds to 0
    ),
  );
  const toDate = new Date(
    Date.UTC(
      new Date(to).getUTCFullYear(),
      new Date(to).getUTCMonth(),
      new Date(to).getUTCDate(),
      0,
      0,
      0, // Set hours, minutes, seconds to 0
    ),
  );
  return {
    fromDate,
    toDate,
  };
}
