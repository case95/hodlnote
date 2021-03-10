import React, { Component } from "react";
import Accordion from "../../reausable/Accordion/Accordion";

import "./Wallets.css";

export default class Wallets extends Component {
  sum = (wallet, pointer) => {
    var total = 0;
    wallet.transactions.map((transaction) => {
      total += transaction[pointer];
    });
    console.log(total);
    return parseFloat(total);
  };

  renderWallets = (wallets) => {
    return wallets.map((wallet, index) => {
      return (
        <Accordion
          key={`wallet-${wallet.cryptoCurrency}-${index}`}
          title={
            <div className="wallet-name">
              <h3 className="wallet-name-crypto">{wallet.cryptoCurrency}</h3>{" "}
              <span className="wallet-name-amount">
                {this.sum(wallet, "cryptoAmount")}
              </span>
            </div>
          }
        >
          <div className="wallet-content">
            <div className="wallet-content-left">
              <h4 className="fiat-invested">
                Invested: {this.sum(wallet, "fiatAmount")}${wallet.fiatCurrency}
              </h4>
              <h4 className="fiat-invested">
                Current Value: {this.sum(wallet, "fiatAmount")}$
                {wallet.fiatCurrency}
              </h4>
            </div>
            <div className="wallet-content-right">
              {wallet.transactions.map((transaction, id) => {
                return (
                  <div className="transaction" key={`transaction-${id}`}>
                    Bought ${transaction.cryptoAmount}${wallet.cryptoCurrency}{" "}
                    at ${transaction.fiatAmount}${wallet.fiatCurrency}
                  </div>
                );
              })}
            </div>
          </div>
        </Accordion>
      );
    });
  };

  render() {
    return (
      <div className="wallets">
        {Array.isArray(this.props.walletsList) &&
          this.props.walletsList.length > 0 &&
          this.renderWallets(this.props.walletsList)}
      </div>
    );
  }
}
