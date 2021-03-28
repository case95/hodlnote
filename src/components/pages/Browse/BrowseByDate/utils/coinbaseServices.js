import coinbaseApi from "./coinbaseApi";

export async function getCurrenciesPairs(baseCurrency) {
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

    return sortedCryptos;
  } catch (err) {
    window.alert("ERROR: " + err);
  }
}

export const getHistoricalData = async (crypto, start, end) => {
  const pair = `${crypto}-USD`;

  const dateStart = new Date(start);
  const dateEnd = new Date(end);

  let granularity = 86400;
  const millInDay = 86400000;
  const timerange = dateEnd - dateStart;

  if (timerange <= 0) {
    console.log("Dates are not valid.");
  } else if (timerange > millInDay * 300) {
    console.log("Choose a time range of 300 days or less.");
  } else if (timerange > millInDay * 75) {
    granularity = 86400;
  } else if (timerange > millInDay * 12.5) {
    granularity = 21600;
  } else {
    granularity = 3600;
  }

  try {
    const historicalDataURL = `${pair}/candles?start=${start}&end=${end}&granularity=${granularity}`;
    const res = await coinbaseApi().get(`products/${historicalDataURL}`);
    return res.data;
  } catch (err) {
    console.log("ERROR: ", err);
  }
};
