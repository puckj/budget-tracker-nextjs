export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "THB", label: "฿ Baht", locale: "th-TH" },
];

//*trick* dynamically deriving the type from the structure of the array rather than manually defining the type
export type Currency = (typeof Currencies)[0];
