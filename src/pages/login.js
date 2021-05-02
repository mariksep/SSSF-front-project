import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MediaContext } from "../context/mediaContext";

import { login } from "../js/fetchGQL";

// MUI Stuff
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  form: {
    textAlign: "center",
    width: "90%",
    height: "90%",
    background: "#fff",
  },
  image: {
    margin: "20px, auto 20px auto",
  },
  pageTitle: {
    color: "#000",
    margin: "15px 0",
  },
  textField: {
    margin: "10px 0",
  },
  button: {
    marginTop: 20,
  },
  links: {
    color: "#000",
  },
}));
const Login = ({ history }) => {
  const classes = useStyles();

  const [user, setUser] = useContext(MediaContext);
  console.log("login");
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handlesubmit = async (event) => {
    if (event) {
      event.preventDefault();
      try {
        const userData = await login(inputs);
        if (userData.token !== undefined) {
          setUser(userData);
          localStorage.setItem("FBIdToken", `Bearer ${userData.token}`);
          history.push("/home");
        }
      } catch (e) {
        console.error(e);
        console.log(e.message);
      }
    }
  };

  const handleInputChange = (event) => {
    event.persist();

    setInputs((inputs) => {
      return {
        ...inputs,
        [event.target.name]: event.target.value,
      };
    });
  };
  console.log(inputs);
  return (
    <div className={classes.container}>
      <>
        <Grid
          container
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className={classes.form}
        >
          <Grid item xs={3}>
            <Typography variant="h2" className={classes.pageTitle}>
              Login
            </Typography>
            <form noValidate onSubmit={handlesubmit}>
              <TextField
                onChange={handleInputChange}
                fullWidth
                id="username"
                name="username"
                type="username"
                className={classes.textField}
                label="Username"
                type="text"
                autoComplete="current-Usernname"
                variant="outlined"
              />
              <TextField
                fullWidth
                onChange={handleInputChange}
                className={classes.textField}
                id="password"
                type="password"
                name="password"
                label="Password"
                autoComplete="current-Usernname"
                variant="outlined"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Login
              </Button>
              <br />
              <small className={classes.links}>
                Dont have an account ? sign up <Link to="/register">here</Link>
              </small>
            </form>
          </Grid>
        </Grid>
      </>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
