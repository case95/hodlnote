import React from "react";
// @ts-ignore
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Importing layout components
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";

// Importing page components
import Home from "../components/pages/Home";
import Browse from "../components/pages/Browse";
import Login from "../components/pages/Login";
import Register from "../components/pages/Register";
import Wallets from "../components/pages/Wallets";

//Import style
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="responsive-container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/wallets" component={Wallets} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
