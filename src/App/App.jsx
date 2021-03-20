import React, { Component } from "react";
// @ts-ignore
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing layout components
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

// Importing page components
import Home from "../components/pages/Home/Home";
import Browse from "../components/pages/Browse/Browse";
import Login from "../components/pages/Login/Login";
import Register from "../components/pages/Register/Register";
import Wallets from "../components/pages/Wallets/Wallets";
import NotFound from "../components/pages/NotFound/NotFound";

//Import style
import "./App.css";

export default class App extends Component {
  state = {
    navLinksList: [
      { name: "Login", link: "/login" },
      { name: "Register", link: "/register" },
    ],
    userWallets: [],
    darkMode: undefined,
  };

  addMovement = (newState) => {
    this.setState({ userWallets: [...newState] });
  };

  onDarkMode = () => {
    if (this.state.darkMode === true) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("UIMode", "light");
    } else if (this.state.darkMode === false) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("UIMode", "dark");
    }
    this.setState({ darkMode: !this.state.darkMode });
  };

  componentDidMount() {
    const UIMode = localStorage.getItem("UIMode");
    if (UIMode) {
      if (localStorage.getItem("UIMode") === "dark") {
        this.setState({ darkMode: true });
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        this.setState({ darkMode: false }); // check
        document.documentElement.setAttribute("data-theme", "light");
      }
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("UIMode", "light");
      this.setState({ darkMode: false });
    }

    if (localStorage.getItem("wallets")) {
      const wallets = JSON.parse(localStorage.getItem("wallets"));
      if (wallets.length > 0) {
        this.setState({ userWallets: wallets });
      }
    }
  }

  // Mock login to display or not the Wallets page in the navigation bar
  handleLogin = () => {
    // Defines the object with the informations needed for the link to be created
    const walletLink = { name: "Wallets", link: "/wallets" };
    const browseLink = { name: "Browse", link: "/browse" };
    // Checks the current status of the nav links (if the wallets is in the nav links or not)
    const included = this.state.navLinksList.some((obj) => {
      return obj.name === walletLink.name || obj.name === browseLink.name;
    });
    // If Wallets is included in the nav links filter it out from the navLinksList and set the filtered list as state
    if (included) {
      const filteredNavLinksList = this.state.navLinksList.filter((obj) => {
        return obj.name !== walletLink.name && obj.name !== browseLink.name;
      });
      return this.setState({ navLinksList: filteredNavLinksList });
      // If Wallets isn't included in the navLinksList then add it to the state.
    } else {
      const updatedNavLinksList = [
        { name: "Browse", link: "/browse" },
        { name: "Wallets", link: "/wallets" },
        ...this.state.navLinksList,
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
              <Route
                exact
                path="/browse"
                render={(props) => (
                  <Browse
                    walletsList={this.state.userWallets}
                    setWalletList={this.addMovement}
                    {...props}
                  />
                )}
              />
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
              <Route component={NotFound} />
              {/* How to pass props to a route + {...props} copies all the props of the render method like history and much more */}
              {/*<Route path="/something" render={(props) => { <Register prop1="prop1" {...props}/>}} />*/}
            </Switch>
          </div>
          <Footer
            navLinksList={this.state.navLinksList}
            onLogin={this.handleLogin}
            checkState={this.state.darkMode}
            onCheck={this.onDarkMode}
          />
        </Router>
      </div>
    );
  }
}
