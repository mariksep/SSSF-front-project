import "./App.css";
//REACT
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { MediaProvider } from "./context/mediaContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Home from "./pages/home.js";
import Login from "./pages/login.js";
import Register from "./pages/register.js";
const useStyles = makeStyles((theme) => ({
  app: {
    background: "#E5E5E5",
    minHeight: "100vh",
    minWidth: "100vw",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
        <div className={classes.app}>
          <Router>
            <MediaProvider>
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/home" component={Home} />
              </Switch>
            </MediaProvider>
          </Router>
        </div>
      </header>
    </div>
  );
}

export default App;
