import React, { Component } from "react";
// @ts-ignore
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing layout components
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

// Importing page components
import Home from "../components/pages/Home/Home";
import Browse from "../components/pages/Browse/Browse";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import Wallets from "../components/pages/Wallets/Wallets";
import TestFetch from "../components/pages/TestFetch/TestFetch";

//Import style
import "./App.css";

export default class App extends Component {
  state = {
    navLinksList: [
      { name: "Browse", link: "/browse" },
      { name: "Login", link: "/login" },
      { name: "Register", link: "/register" },
    ],
    userWallets: [
      {
        fiatCurrency: "eur",
        cryptoCurrency: "btc",
        transactions: [
          { fiatAmount: 5000, cryptoAmount: 0.6 },
          { fiatAmount: 3000, cryptoAmount: 0.3 },
          { fiatAmount: 2200, cryptoAmount: 0.12 },
        ],
      },
      {
        fiatCurrency: "usd",
        cryptoCurrency: "eth",
        transactions: [
          { fiatAmount: 100, cryptoAmount: 0.2 },
          { fiatAmount: 1200, cryptoAmount: 1.2 },
        ],
      },
      {
        fiatCurrency: "aud",
        cryptoCurrency: "xrp",
        transactions: [
          { fiatAmount: 500, cryptoAmount: 800 },
          { fiatAmount: 200, cryptoAmount: 433 },
        ],
      },
    ],
  };

  // Mock login to display or not the Wallets page in the navigation bar
  handleLogin = () => {
    // Defines the object with the informations needed for the link to be created
    const walletLink = { name: "Wallets", link: "/wallets" };
    // Checks the current status of the nav links (if the wallets is in the nav links or not)
    const included = this.state.navLinksList.some((obj) => {
      return obj.name === walletLink.name;
    });
    // If Wallets is included in the nav links filter it out from the navLinksList and set the filtered list as state
    if (included) {
      const filteredNavLinksList = this.state.navLinksList.filter((obj) => {
        return obj.name !== walletLink.name;
      });
      return this.setState({ navLinksList: filteredNavLinksList });
      // If Wallets isn't included in the navLinksList then add it to the state.
    } else {
      const updatedNavLinksList = [
        ...this.state.navLinksList,
        { name: "Wallets", link: "/wallets" },
      ];
      return this.setState({ navLinksList: updatedNavLinksList });
    }
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Header
            navLinksList={this.state.navLinksList}
            onLogin={this.handleLogin}
          />
          <div className="responsive-container">
            <Switch>
              <Route exact path="/testfetch" component={TestFetch} />
              <Route exact path="/browse" component={Browse} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route
                exact
                path="/wallets"
                render={(props) => (
                  <Wallets walletsList={this.state.userWallets} {...props} />
                )}
              />
              {/* Home goes at the end because the "/" path might match the beginning of other routes */}
              <Route exact path="/" component={Home} />
              {/* How to pass props to a route + {...props} copies all the props of the render method like history and much more */}
              {/*<Route path="/something" render={(props) => { <Register prop1="prop1" {...props}/>}} />*/}
            </Switch>
          </div>
          <Footer
            navLinksList={this.state.navLinksList}
            onLogin={this.handleLogin}
          />
        </Router>
      </div>
    );
  }
}
