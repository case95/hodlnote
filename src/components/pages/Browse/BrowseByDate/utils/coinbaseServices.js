import coinbaseApi from "./coinbaseApi";

export const getCurrenciesPairs = async (baseCurrency) => {
  try {
    const res = await coinbaseApi().get("products");

    const usdQuotedCryptos = res.data.filter((pair) => {
      return pair.quote_currency === baseCurrency;
    });
    const sortedCryptos = usdQuotedCryptos.sort((a, b) => {
      if (a.base_currency < b.base_currency) {
        return -1;
      }
      if (a.base_currency > b.base_currency) {
        return 1;
      }
      return 0;
    });

    return usdQuotedCryptos;
  } catch (err) {
    window.alert("ERROR: " + err);
  }
};

export const getHistoricalData = async (baseCurrency, urlParams) => {
  try {
    const res = await coinbaseApi().get(`products/${urlParams}`);
  } catch (err) {}
};
