// export const APP_URL = "http://localhost:4000/api/";
export const APP_URL = "https://app.mycryptotax.in/api/";
export const STOCK_APP_URL = "https://stockpalapi.glassball.app";
export const WAZIRX_API_DOMAIN = "https://api.wazirx.com";

export const headerKeys = [
  "securityName",
  "quantity",
  "feePaidIn",
  "tradeType",
  "platform",
  "transactionDate",
  "grossAmount",
  "costBasis",
  "currentValue",
  "difference",
  "TDS",
  // "expiryDate",
  // "optionStrike",
  // "optionType",
  // "settlementDate",
  // "serviceTax",
  // "stt",
  // "fees",
  // "otherCharges",
  // "fileRef",
];
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
