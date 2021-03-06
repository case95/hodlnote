import React, { useState } from "react";
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
import Wallets from "../components/pages/Wallets";

//Import style
import "./App.css";

function App() {
  // eslint-disable-next-line
  const [navLinksList, setNavLinksList] = useState([
    { name: "Browse", link: "/browse" },
    { name: "Login", link: "/login" },
    { name: "Register", link: "/register" },
    { name: "Wallets", link: "/Wallets" },
  ]);

  return (
    <div className="App">
      <Router>
        <Header navLinksList={navLinksList} />
        <div className="responsive-container">
          <Switch>
            <Route exact path="/browse" component={Browse} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/wallets" component={Wallets} />
            {/* Home goes at the end because the "/" path might match the beginning of other routes */}
            <Route exact path="/" component={Home} />
            {/* How to pass props to a route + {...props} copies all the props of the render method like history and much more */}
            {/*<Route path="/something" render={(props) => { <Register prop1="prop1" {...props}/>}} />*/}
          </Switch>
        </div>
        <Footer navLinksList={navLinksList} />
      </Router>
    </div>
  );
}

export default App;
