import React, { useState, useEffect, useRef } from "react";

import coinbaseServices from "../Browse/BrowseByDate/utils/coinbaseServices";
import exchangeratesServices from "../Browse/utils/exchangeratesServices";

const requestService = () => {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const [price, setPrice] = useState(0.0);
  const [pastData, setPastData] = useState({});

  const webSocket = useRef(null);

  // Prevent API call on the first render
  var first = useRef(false);

  useEffect(() => {
    webSocket.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
  });

  return (
    <div>
      <button onClick={() => coinbaseServices()}>FETCH DATA</button>
      <button onClick={() => exchangeratesServices()}>FETCH fiat</button>
    </div>
  );
};

export default requestService;
