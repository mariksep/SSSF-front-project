import React, { PropTypes, useState, useContext, useEffect } from "react";
import "../App.css";

import { addAttraction, login, getDestination } from "../js/fetchGQL";
import { MediaContext } from "../context/mediaContext";

// MUI Stuff
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

//LEAFLET
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import pin from "./pin.png";

let DefaultIcon = new Icon({
  iconUrl: pin,
  iconSize: [35, 35],
  className: "pinMarker",
});

const useStyles = makeStyles((theme) => ({
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
  map__container: {
    width: "100vw",
  },
  card: {
    margin: "2rem",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    height: "500px",
    width: "600px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    margin: "0",
  },
  button: {
    margin: "10px 0",
  },
  map: {
    flex: "1",
    margin: "1em",
    height: "100%",
    width: "100%",
    borderRadius: "10px",
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
  selectContainer: {
    width: "100%",
    display: "flex",
    margin: "1rem",
    alignItems: "center",
    justifyContent: "space-around",
  },
  label: {
    fontSize: "16px",
  },
}));

const DestinationModal = (destinationId) => {
  const classes = useStyles();
  const [user, setUser] = useContext(MediaContext);
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState();
  const [modify, setModify] = useState(false);
  console.log(destinationId);

  const [inputs, setInputs] = useState({
    destinationID: destinationId.destination,
    name: "",
    AttractionLocation: {
      coordinates: ["", ""],
    },
    type: "",
  });

  useEffect(async () => {
    if (user) {
      try {
        console.log(destinationId);
        const destinationOne = await getDestination(destinationId.destination);
        console.log(destination);
        setDestination(destinationOne);
      } catch (e) {
        console.log(e.message);
      }
    }
  }, [destinationId]);

  let coords = [];

  if (inputs.AttractionLocation.coordinates[0].lenght == undefined) {
    if (destination) {
      coords = [
        destination.DestinationLocation.coordinates[0],
        destination.DestinationLocation.coordinates[1],
      ];
    } else {
      coords = [34, 40];
    }
  } else {
    coords = [
      inputs.AttractionLocation.coordinates[0],
      inputs.AttractionLocation.coordinates[1],
    ];
  }

  const handlesubmit = async (event) => {
    console.log(inputs);
    if (event) {
      event.preventDefault();
      await addAttraction(inputs, user.token);
      const destinationOne = await getDestination(destinationId.destination);
      console.log("uusdestaan", destination);
      setTimeout(async () => {
        await setDestination(destinationOne);
        await setModify(false);
        await setOpen(true);
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <>
        {open && destination && (
          <>
            <div className={classes.backdrop}>
              <Card className={classes.card}>
                <div className={classes.header}>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    close
                  </Button>
                  <h2 className={classes.title}>{destination.name}</h2>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpen(false);
                      setModify(true);
                    }}
                  >
                    Add Attraction
                  </Button>
                </div>
                <div id="mapid">
                  <MapContainer
                    className="map"
                    center={[
                      destination.DestinationLocation.coordinates[0],
                      destination.DestinationLocation.coordinates[1],
                    ]}
                    zoom={11}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {destination.Attractions && (
                      <>
                        {destination.Attractions.map((attraction) => {
                          return (
                            <Marker
                              key={destination.Attractions.id}
                              position={[
                                attraction.AttractionLocation.coordinates[0],
                                attraction.AttractionLocation.coordinates[1],
                              ]}
                              icon={DefaultIcon}
                            >
                              <Popup>
                                {attraction.name}
                                <br></br>
                                {attraction.type}
                              </Popup>
                            </Marker>
                          );
                        })}
                      </>
                    )}
                  </MapContainer>
                </div>
              </Card>
            </div>
          </>
        )}
        {modify && (
          <>
            <div className={classes.backdrop}>
              <Card className={classes.card}>
                <div className={classes.header}>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpen(true);
                      setModify(false);
                    }}
                  >
                    Close
                  </Button>
                  <h2 className={classes.title}>Add attraction</h2>
                </div>
                <form onSubmit={handlesubmit} className={classes.form}>
                  <div className={classes.formdiv}>
                    <TextField
                      required
                      fullWidth
                      className={classes.inputs}
                      label="Attractions name?"
                      name="name"
                      value={inputs.name}
                      onChange={handleInputChange}
                      type="text"
                      autoComplete="current-Usernname"
                      variant="outlined"
                    />
                    <div className={classes.selectContainer}>
                      <label className={classes.label}>
                        What type attraction is it?
                      </label>
                      <select
                        className="formselect"
                        required
                        value={inputs.type}
                        onChange={handleInputChange}
                        name="type"
                      >
                        <option value="" defaultValue disabled hidden></option>
                        <option className="formselectoption" value="Food">
                          Food
                        </option>
                        <option className="formselectoption" value="Museum">
                          Museum
                        </option>
                        <option className="formselectoption" value="Park">
                          Park
                        </option>
                        <option className="formselectoption" value="Landmark">
                          Landmark
                        </option>
                      </select>
                    </div>
                  </div>
                  <div id="mapid">
                    <MapContainer
                      className="map"
                      center={[
                        destination.DestinationLocation.coordinates[0],
                        destination.DestinationLocation.coordinates[1],
                      ]}
                      onClick={(e) => {
                        console.log(e);
                      }}
                      zoom={11}
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
                                inputs.AttractionLocation.coordinates[0] =
                                  e.latlng.lat;
                                inputs.AttractionLocation.coordinates[1] =
                                  e.latlng.lng;
                              },
                            }}
                            position={coords}
                            icon={DefaultIcon}
                          ></Marker>
                        </>
                      )}
                    </MapContainer>
                  </div>
                  <Button
                    type="submit"
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Add Attraction
                  </Button>
                </form>
              </Card>
            </div>
          </>
        )}
      </>
    </>
  );
};

DestinationModal.propTypes = {};

export default DestinationModal;
