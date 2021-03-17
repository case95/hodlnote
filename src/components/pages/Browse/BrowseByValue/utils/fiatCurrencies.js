import exchangeratesService from "../../utils/exchangeratesServices";

const myFiatCurrencies = [];

const fetchFiatCurrencies = async () => {
  const fetchedData = await exchangeratesService("USD");
  fetchedData.map((obj) => {
    myFiatCurrencies.push(obj.id);
  });
  return myFiatCurrencies;
};

fetchFiatCurrencies();

export default myFiatCurrencies;
