import exchangeratesApi from "./exchangeratesApi";

const fiatApiCall = async () => {
  try {
    const res = await exchangeratesApi().get("latest?base=USD");

    // Converts the object we got from the fetch to an array
    const cleanFiatPairs = [];
    for (const [key, value] of Object.entries(res.data.rates)) {
      cleanFiatPairs.push({ id: key, value });
    }

    // Adds EUR currency to the data array (only if there's no base in the query => base is automatically set to EUR and it doesn't appear in the values)
    // cleanFiatPairs.push({id:"EUR", value:1})

    // Sorts the data array by alphabetical order of id
    const sortedFiatPairs = cleanFiatPairs.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

    console.log(
      `%cPAIRS: `,
      "background: #222; color: #bada55",
      sortedFiatPairs
    );

    return sortedFiatPairs;
  } catch (err) {
    window.alert("ERROR: " + err);
  }
};

export default fiatApiCall;
