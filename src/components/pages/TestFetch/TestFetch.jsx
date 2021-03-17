import React, { useState, useEffect, useRef } from "react";

import {
  getCurrenciesPairs,
  getHistoricalData,
} from "../Browse/BrowseByDate/utils/coinbaseServices";
import exchangeratesServices from "../Browse/utils/exchangeratesServices";

const TestFetch = () => {
  const [currencies, setCurrencies] = useState([]);
  // REMOVE ALL HARDCODED VALUES
  const [pair, setPair] = useState("");
  const [price, setPrice] = useState(0.0);
  const [pastData, setPastData] = useState({});
  const [granularity, setGranularity] = useState(86400);
  const [start, setStart] = useState(
    encodeURIComponent(new Date("25 Janauary 2021 14:48 UTC").toISOString())
  );
  const [end, setEnd] = useState(encodeURIComponent(new Date().toISOString()));

  const webSocket = useRef(null);

  // Prevent API call on the first render
  var first = useRef(false);

  useEffect(() => {
    // Initializes the web socket that will be used to communicate with the API and receive real-time data.
    webSocket.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    const setCurrenciesState = async () => {
      await getCurrenciesPairs("USD").then((currencies) => {
        setCurrencies([...currencies]);
      });

      first.current = true;
    };
    setCurrenciesState();
  }, []);

  useEffect(() => {
    if (!first.current) {
      console.log("Returning on first render");
      return;
    }
    let msg = {
      type: "subscribe",
      // Fiat is always USD, crypto is to be set by the user.
      product_ids: [pair],
      channels: ["ticker"],
    };
    const jsonMsg = JSON.stringify(msg);
    // The Web Socket class instance we have in our useRef.current sends the request to the API for the real-time communication.
    // It is triggered only when dates are valid.
    webSocket.current.send(jsonMsg);

    var historicalDataURL = `${pair}/candles?start=${start}?end=${end}&?granularity=${granularity}`;
    getHistoricalData("USD", historicalDataURL);

    webSocket.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type !== "ticker") {
        console.log("Non ticker event: ", message);
        return;
      }

      if (data.product_id === pair) {
        console.log(data.price);
        setPrice(data.price);
      }
    };
  }, [pair]);

  return (
    <div>
      <button onClick={() => console.log(getCurrenciesPairs("USD"))}>
        FETCH CRYPTO
      </button>
      <button
        onClick={() =>
          getHistoricalData(
            "USD",

            `${pair}/candles?start=${start}&end=${end}&granularity=${granularity}`
          )
        }
      >
        {/* BTC-USD/candles?start=2021-01-25T14%3A48%3A00.000Z&?end=2021-03-13T14%3A48%3A00.000Z&?granularity=86400 */}
        {/*`BTC-USD/candles?start=2021-01-30T19%3A06%3A05%2B00%3A00&end=2021-02-06T19%3A06%3A05%2B00%3A00&granularity=86400`*/}
        FETCH CANDLES
      </button>
      <button onClick={() => console.log(exchangeratesServices("USD"))}>
        FETCH FIAT
      </button>
      <select
        name="pairs"
        id="pairs-selector"
        onChange={(e) => {
          setPair(e.target.value);
        }}
      >
        <option value="BTC-USD">BTC-USD</option>
        <option value="ETH-USD">ETH-USD</option>
      </select>
    </div>
  );
};

export default TestFetch;
