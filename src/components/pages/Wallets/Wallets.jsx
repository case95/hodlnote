import React, { Component } from "react";
import Accordion from "../../reusable/Accordion/Accordion";
import Container from "../../reusable/Container/Container";

import "./Wallets.css";

export default class Wallets extends Component {
  constructor(props) {
    super(props);
    this.first = React.createRef(false);
    this.webSocket = React.createRef(null);
  }

  state = {
    pair: "",
    walletOpenStatus: {},
    price: 1,
    currentValue: 1,
  };

  async componentDidMount() {
    this.webSocket.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    this.first.current = true;
    const walletOpenStatus = {};
    const setWalletOpenStatus = () => {
      this.props.walletsList.map((wallet) => {
        return (walletOpenStatus[
          `${wallet.cryptoCurrency}-${wallet.fiatCurrency}`
        ] = false);
      });
    };
    setWalletOpenStatus();

    this.setState({
      walletOpenStatus,
    });
  }

  componentWillUnmount() {
    const msg = {
      type: "unsubscribe",
      product_ids: [],
      channels: ["ticker"],
    };
    const jsonMsg = JSON.stringify(msg);
    this.webSocket.current.send(jsonMsg);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.pair !== this.state.pair) {
      if (!this.first.current) {
        return;
      }
      const msg = {
        type: "subscribe",
        // Fiat is always USD, crypto is to be set by the user.
        product_ids: [this.state.pair],
        channels: ["ticker"],
      };
      const jsonMsg = JSON.stringify(msg);
      // The Web Socket class instance we have in our useRef.current sends the request to the API for the real-time communication.
      // It is triggered only when dates are valid.
      this.webSocket.current.send(jsonMsg);
      this.webSocket.current.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type !== "ticker") {
          console.log("Non ticker event: ", message);
          return;
        }

        if (data.product_id === this.state.pair) {
          // console.log(data.price);
          this.setState({ price: data.price });
        }
      };
    }
  }

  handleChange = (e) => {
    const walletOpenStatus = { ...this.state.walletOpenStatus };

    Object.keys(walletOpenStatus).forEach(function (key) {
      walletOpenStatus[key] = false;
    });

    this.setState({
      walletOpenStatus: {
        ...walletOpenStatus,
        [e.currentTarget.getAttribute("name")]: !this.state.walletOpenStatus[
          e.currentTarget.getAttribute("name")
        ],
      },
    });

    this.setState({ pair: e.currentTarget.getAttribute("name") });
  };

  sum = (wallet, pointer) => {
    var total = 0;
    wallet.transactions.map((transaction) => {
      return (total += transaction[pointer]);
    });
    return parseFloat(total);
  };

  renderWallets = (wallets) => {
    return wallets.map((wallet, index) => {
      const currentValue = (
        parseFloat(this.sum(wallet, "cryptoAmount")) *
        parseFloat(this.state.price)
      ).toFixed(2);

      return (
        <Container className="wallet-container" key={`wallet-${index}`}>
          <Accordion
            className="wallet"
            accordionOpenState={
              this.state.walletOpenStatus[
                `${wallet.cryptoCurrency}-${wallet.fiatCurrency}`
              ]
            }
            name={`${wallet.cryptoCurrency}-${wallet.fiatCurrency}`}
            key={`wallet-${wallet.cryptoCurrency}-${index}`}
            id={wallet.cryptoCurrency}
            onClick={(e) => this.handleChange(e)}
            title={
              <div className="wallet-name">
                <h2 className="wallet-name-crypto">{wallet.cryptoCurrency}</h2>{" "}
                <span className="wallet-name-amount">
                  {this.sum(wallet, "cryptoAmount")}
                </span>
              </div>
            }
          >
            <div className="wallet-content">
              <div className="wallet-content-left">
                <h4 className="fiat-invested">
                  Invested: {this.sum(wallet, "fiatAmount")}{" "}
                  {wallet.fiatCurrency}
                </h4>
                <h4 className="fiat-invested">
                  Current Value:{" "}
                  <span
                    className={
                      currentValue >= this.sum(wallet, "fiatAmount")
                        ? `green`
                        : `red`
                    }
                  >
                    {currentValue}{" "}
                  </span>
                  {wallet.fiatCurrency}
                </h4>
              </div>
              <div className="wallet-content-right">
                {wallet.transactions.map((transaction, id) => {
                  return (
                    <div className="transaction" key={`transaction-${id}`}>
                      {transaction.cryptoAmount}
                      {wallet.cryptoCurrency} at {transaction.fiatAmount}
                      {wallet.fiatCurrency}
                    </div>
                  );
                })}
              </div>
            </div>
          </Accordion>
        </Container>
      );
    });
  };

  render() {
    if (this.props.walletsList.length === 0) {
      return (
        <div className="empty">
          <h1>You have no transactions registered.</h1>
        </div>
      );
    } else {
      return (
        <div className="wallets">
          {Array.isArray(this.props.walletsList) &&
            this.props.walletsList.length > 0 &&
            this.renderWallets(this.props.walletsList)}
        </div>
      );
    }
  }
}
