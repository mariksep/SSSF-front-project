import React, { PropTypes, useState, useContext, useEffect } from "react";
import "../App.css";

import {
  addAttraction,
  login,
  getDestination,
  deleteAttraction,
  modifyAttraction,
} from "../js/fetchGQL";
import { MediaContext } from "../context/mediaContext";

// MUI Stuff
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import IconPlus from "@material-ui/core/Icon";

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
//ICONS
import IconFood from "./food-and-restaurant.png";
import IconPark from "./location.png";
import IconMuseum from "./placeholder (1).png";
import IconLandmark from "./placeholder (2).png";
import pin from "./pin.png";

let DefaultIcon = new Icon({
  iconUrl: pin,
  iconSize: [35, 35],
  className: "pinMarker",
});
const MarkerFoodIcon = new Icon({
  iconUrl: IconFood,
  iconSize: [35, 35],
  className: "pinMarker",
});
const MarkerParkIcon = new Icon({
  iconUrl: IconPark,
  iconSize: [35, 35],
  className: "pinMarker",
});
const MarkerMuseumIcon = new Icon({
  iconUrl: IconMuseum,
  iconSize: [35, 35],
  className: "pinMarker",
});
const MarkerLandmarkIcon = new Icon({
  iconUrl: IconLandmark,
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
  inputname: {
    display: "none",
  },
}));

const DestinationModal = (destinationId) => {
  const classes = useStyles();
  const [user, setUser] = useContext(MediaContext);
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState();
  const [addModal, setaddModal] = useState(false);
  const [modify, setModify] = useState(false);
  const [modifyItem, setModifyItem] = useState();

  const [inputs, setInputs] = useState({
    destinationID: destinationId.destination,
    name: "",
    AttractionLocation: {
      coordinates: [0, 0],
    },
    type: "",
  });
  const [modifyinputs, setModifyInputs] = useState({
    id: "",
    name: "",
    AttractionLocation: {
      coordinates: ["", ""],
    },
    type: "",
  });

  useEffect(async () => {
    if (user) {
      try {
        const destinationOne = await getDestination(destinationId.destination);
        await setDestination(destinationOne);
      } catch (e) {
        console.log(e.message);
      }
    }
  }, [destinationId]);

  let coords = [];
  let coordsModify = [];
  /*ADD*/
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
  /*MODIFY*/
  if (modifyinputs.AttractionLocation.coordinates[0].lenght == undefined) {
    if (destination) {
      coordsModify = [
        destination.DestinationLocation.coordinates[0],
        destination.DestinationLocation.coordinates[1],
      ];
    } else {
      coordsModify = [34, 40];
    }
  } else {
    coordsModify = [
      modifyinputs.AttractionLocation.coordinates[0],
      modifyinputs.AttractionLocation.coordinates[1],
    ];
  }
  /*ADD*/
  const handlesubmit = async (event) => {
    if (event) {
      event.preventDefault();
      await addAttraction(inputs, user.token);
      const destinationOne = await getDestination(destinationId.destination);

      setTimeout(async () => {
        await setDestination(destinationOne);
        await setaddModal(false);
        await setOpen(true);
      }, 500);
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
  /*MODIFY*/
  const handleModifySubmit = async (event) => {
    if (event) {
      event.preventDefault();
      await modifyAttraction(modifyinputs, user.token);
      const destinationOne = await getDestination(destinationId.destination);
      await setDestination(destinationOne);
      await setModify(false);
      await setOpen(true);
    }
  };

  const handleModifyInputChange = (event) => {
    event.persist();
    setModifyInputs((modifyinputs) => {
      return {
        ...modifyinputs,
        [event.target.name]: event.target.value,
      };
    });
  };
  /*DELETE*/
  const deleteObject = async (id) => {
    if (id) {
      await deleteAttraction(id, user.token);
      const destinationOne = await getDestination(destinationId.destination);

      setTimeout(async () => {
        await setDestination(destinationOne);
        await setaddModal(false);
        await setOpen(true);
      }, 500);
    }
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
                      setaddModal(true);
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
                          if (attraction.type === "Landmark") {
                            return (
                              <Marker
                                icon={MarkerLandmarkIcon}
                                position={[
                                  attraction.AttractionLocation.coordinates[0],
                                  attraction.AttractionLocation.coordinates[1],
                                ]}
                              >
                                <Popup>
                                  {attraction.name}
                                  <br></br>
                                  {attraction.type}
                                  <br></br>
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      setModifyItem({ attraction });
                                      setModify(true);
                                      setOpen(false);
                                    }}
                                  >
                                    Modify
                                  </Button>
                                  <Button
                                    color="secondary"
                                    onClick={() => {
                                      deleteObject(attraction.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Popup>
                              </Marker>
                            );
                          }
                          if (attraction.type === "Food") {
                            return (
                              <Marker
                                icon={MarkerFoodIcon}
                                position={[
                                  attraction.AttractionLocation.coordinates[0],
                                  attraction.AttractionLocation.coordinates[1],
                                ]}
                              >
                                <Popup>
                                  {attraction.name}
                                  <br></br>
                                  {attraction.type}
                                  <br></br>
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      setModifyItem({ attraction });
                                      setModify(true);
                                      setOpen(false);
                                    }}
                                  >
                                    Modify
                                  </Button>
                                  <Button
                                    color="secondary"
                                    onClick={() => {
                                      deleteObject(attraction.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Popup>
                              </Marker>
                            );
                          }
                          if (attraction.type === "Museum") {
                            return (
                              <Marker
                                icon={MarkerMuseumIcon}
                                position={[
                                  attraction.AttractionLocation.coordinates[0],
                                  attraction.AttractionLocation.coordinates[1],
                                ]}
                              >
                                <Popup>
                                  {attraction.name}
                                  <br></br>
                                  {attraction.type}
                                  <br></br>
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      setModifyItem({ attraction });
                                      setModify(true);
                                      setOpen(false);
                                    }}
                                  >
                                    Modify
                                  </Button>
                                  <Button
                                    color="secondary"
                                    onClick={() => {
                                      deleteObject(attraction.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Popup>
                              </Marker>
                            );
                          }
                          if (attraction.type === "Park") {
                            return (
                              <Marker
                                icon={MarkerParkIcon}
                                position={[
                                  attraction.AttractionLocation.coordinates[0],
                                  attraction.AttractionLocation.coordinates[1],
                                ]}
                              >
                                <Popup>
                                  {attraction.name}
                                  <br></br>
                                  {attraction.type}
                                  <br></br>
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      setModifyItem({ attraction });
                                      setModify(true);
                                      setOpen(false);
                                      setaddModal(false);
                                    }}
                                  >
                                    Modify
                                  </Button>
                                  <Button
                                    color="secondary"
                                    onClick={() => {
                                      deleteObject(attraction.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Popup>
                              </Marker>
                            );
                          }
                          if (attraction.type === "") {
                            return (
                              <Marker
                                icon={DefaultIcon}
                                position={[
                                  attraction.AttractionLocation.coordinates[0],
                                  attraction.AttractionLocation.coordinates[1],
                                ]}
                              >
                                <Popup>
                                  {attraction.name}
                                  <br></br>
                                  {attraction.type}
                                  <br></br>
                                  <Button
                                    color="primary"
                                    onClick={() => {
                                      setModifyItem({
                                        attraction,
                                      });
                                      setModify(true);
                                      setOpen(false);
                                      setaddModal(false);
                                    }}
                                  >
                                    Modify
                                  </Button>
                                  <Button
                                    color="secondary"
                                    onClick={() => {
                                      deleteObject(attraction.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </Popup>
                              </Marker>
                            );
                          }
                        })}
                      </>
                    )}
                  </MapContainer>
                </div>
              </Card>
            </div>
          </>
        )}
        {addModal && (
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
                      setaddModal(false);
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
        {modify && modifyItem && user && (
          <>
            <div className={classes.backdrop}>
              <Card className={classes.card}>
                <div className={classes.header}>
                  <Button
                    type="button"
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
                  <h2 className={classes.title}>Modify attraction</h2>
                </div>
                <form onSubmit={handleModifySubmit} className={classes.form}>
                  <div className={classes.formdiv}>
                    <TextField
                      fullWidth
                      className={classes.inputname}
                      label="id"
                      name="id"
                      value={(modifyinputs.id = modifyItem.attraction.id)}
                      onChange={handleModifyInputChange}
                      type="text"
                      autoComplete="current-Usernname"
                      variant="outlined"
                    />
                    <TextField
                      fullWidth
                      className={classes.inputs}
                      label="Attractions new name?"
                      name="name"
                      value={modifyinputs.name.lenght}
                      onChange={handleModifyInputChange}
                      type="text"
                      autoComplete="current-Usernname"
                      variant="outlined"
                    />
                    <div className={classes.selectContainer}>
                      <label className={classes.label}>
                        What is new type of attraction?
                      </label>
                      <select
                        className="formselect"
                        placeholder={modifyItem.type}
                        value={modifyinputs.type}
                        onChange={handleModifyInputChange}
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
                                modifyinputs.AttractionLocation.coordinates[0] =
                                  e.latlng.lat;
                                modifyinputs.AttractionLocation.coordinates[1] =
                                  e.latlng.lng;
                              },
                            }}
                            position={coordsModify}
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
                  >
                    Modify
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
