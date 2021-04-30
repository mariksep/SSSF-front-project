import React, { PropTypes, useEffect, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import { getUsersDestinations, addDestination } from "../js/fetchGQL";

import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { MediaContext } from "../context/mediaContext";
import DestinationModal from "../components/destinationModal";
// MUI Stuff
import { makeStyles } from "@material-ui/core/styles";
import { Card, Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

//LEAFLET
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import pin from "../components/pin.png";
let DefaultIcon = new Icon({
  iconUrl: pin,
  iconSize: [35, 35],
  className: "pinMarker",
});
const useStyles = makeStyles((theme) => ({
  conatiner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  conatinerHeader: {
    display: "flex",
    justifyContent: "space-around",
    width: "540px",
    color: "#000",
    margin: "1rem 0 0 0",
  },
  card: {
    margin: "2rem",
    display: "flex",
    flexDirection: "column",
    height: "300px",
    width: "540px",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    OObjectFit: "cover",
  },
  destinationHeader: {
    margin: "12px",

    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cardheader: {
    display: "flex",
    margin: "1rem",
    width: "100%",
    justifyContent: "space-evenly",
  },
  destinationName: {
    margin: "0",
  },
  map: {
    flex: "1",
    margin: "1em",
    height: "100%",
    width: "90%",
    borderRadius: "10px",
    zIndex: "0",
  },
  destinationContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  destination: {
    borderRadius: "10px",
    width: "90vw",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    color: "black",
    width: "40vw",
    border: "none",
    cursor: "pointer",
    borderRadius: "15px",
    padding: "1em",
    margin: "1em",
    outline: "none",
    fontSize: "medium",
    backgroundColor: "rgb(239, 239, 239)",
    "&:hover": {
      backgroundColor: "rgba(11, 58, 92, 0.7)",
      color: "white",
    },
    "&:active": {
      color: "white",
      backgroundColor: "rgba(11, 58, 92, 0.9)",
    },
  },
  backdrop: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: "1",
    height: "100vh",
    top: 0,
    right: 0,
  },
  cardAdd: {
    margin: "2rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    height: "500px",
    width: "600px",
  },
  form: {
    height: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  formdiv: {
    margin: "1rem",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  buttonAdd: {
    margin: "1rem 0",
  },
}));

const Home = ({ history }) => {
  const [user, setUser] = useContext(MediaContext);
  const [init, setInit] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  let token = localStorage.getItem("FBIdToken");
  let auth = false;
  console.log(user);
  if (token != null) {
    auth = true;
  }

  useEffect(() => {
    if (user) {
      const fetcData = async () => {
        try {
          console.log(user.id);
          const allUsersDestinations = await getUsersDestinations(user.id);
          console.log(allUsersDestinations);
          setInit(allUsersDestinations);
        } catch (e) {
          console.log(e.message);
        }
      };

      fetcData();
    }
  }, [setInit, user]);

  const [inputs, setInputs] = useState({
    userID: user.id,
    name: "",
    DestinationLocation: {
      coordinates: ["", ""],
    },
  });

  const handlesubmit = async (event) => {
    console.log(inputs);
    if (event) {
      event.preventDefault();

      await addDestination(inputs, user.token);

      setTimeout(async () => {
        const allUsersDestinations = await getUsersDestinations(user.id);
        console.log(allUsersDestinations);
        setInit(allUsersDestinations);
        await setOpen(false);
      }, 500);
    }
  };

  const handleInputChange = (event) => {
    event.persist();
    console.log(inputs);
    setInputs((inputs) => {
      return {
        ...inputs,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <>
      {auth !== false ? (
        <div className={classes.conatiner}>
          <div className={classes.conatinerHeader}>
            <h3 className={classes.destinationName}>
              Your destinations {user.username}
            </h3>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              +
            </Button>
          </div>
          {init.map((destination) => {
            console.log(destination);
            return (
              <Card key={destination.id} className={classes.card}>
                <div className={classes.cardheader}>
                  <div className={classes.destinationHeader}>
                    <h3 className={classes.destinationName}>
                      {destination.name}
                    </h3>
                  </div>
                  <DestinationModal
                    destination={destination.id}
                    user={{ user }}
                  ></DestinationModal>
                </div>
                <MapContainer
                  center={[
                    destination.DestinationLocation.coordinates[0],
                    destination.DestinationLocation.coordinates[1],
                  ]}
                  zoom={9}
                  scrollWheelZoom={false}
                  className={classes.map}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </MapContainer>
              </Card>
            );
          })}
          {open && init && (
            <>
              <div className={classes.backdrop}>
                <Card className={classes.cardAdd}>
                  <div className={classes.header}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Close
                    </Button>
                    <h2 className={classes.title}>Add destination</h2>
                  </div>
                  <form onSubmit={handlesubmit} className={classes.form}>
                    <div className={classes.formdiv}>
                      <TextField
                        required
                        fullWidth
                        className={classes.inputs}
                        label="Destination name?"
                        name="name"
                        value={inputs.name}
                        onChange={handleInputChange}
                        type="text"
                        autoComplete="current-Usernname"
                        variant="outlined"
                      />
                    </div>
                    <div id="mapid">
                      <MapContainer
                        className="map"
                        center={[0, 0]}
                        onClick={(e) => {
                          console.log(e);
                        }}
                        zoom={2}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {inputs.AttractionLocation !== 0 && (
                          <>
                            <Marker
                              draggable={true}
                              eventHandlers={{
                                drag: (e) => {
                                  console.log(e.latlng);
                                  inputs.DestinationLocation.coordinates[0] =
                                    e.latlng.lat;
                                  inputs.DestinationLocation.coordinates[1] =
                                    e.latlng.lng;
                                },
                              }}
                              position={[0, 0]}
                              icon={DefaultIcon}
                            ></Marker>
                          </>
                        )}
                      </MapContainer>
                    </div>
                    <Button
                      className={classes.buttonAdd}
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        //setOpen(false);
                      }}
                    >
                      Add destination
                    </Button>
                  </form>
                </Card>
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <Link to="/register">register</Link> or <Link to="/">login</Link>,
          please{}
        </div>
      )}
    </>
  );
};

export default withRouter(Home);
