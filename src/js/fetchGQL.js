const fetchGraphql = async (query) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch(
      "https://env-3354092.jelastic.metropolia.fi/graphql",
      options
    );
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log("fetchgraphql", e);
    return false;
  }
};
const addGraphql = async (query, token) => {
  console.log(query, token);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(query),
  };
  try {
    const response = await fetch(
      "https://env-3354092.jelastic.metropolia.fi/graphql",
      options
    );
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.log("fetchgraphql", e);
    return false;
  }
};

export const getAllDestinations = async () => {
  const query = {
    query: `
         {
  Destinations {
    id
    name
    userID
    DestinationLocation {
      coordinates
    }
    Attractions {
      id
      destinationID
      name
      type
      AttractionLocation {
        coordinates
      }
    }
  }
}        
        `,
  };
  const data = await fetchGraphql(query);
  console.log(data);
  return data.Destinations;
};
export const getUsersDestinations = async (userId) => {
  const query = {
    query: `
 {
  specifyDestinations(id: "${userId}") {
    name
    id
    DestinationLocation {
      coordinates
    }
    Attractions {
      name
      type
      AttractionLocation {
        coordinates
      }
    }
  }
}
     
        `,
  };
  const data = await fetchGraphql(query);
  console.log(data);
  return data.specifyDestinations;
};

export const getDestination = async (id) => {
  const query = {
    query: `
{
  Destination(id: "${id}") {
    id
    name
    DestinationLocation {
      coordinates
    }
    Attractions {
      id
      destinationID
      name
      type
      AttractionLocation {
        coordinates
      }
    }
  }
}

     
        `,
  };
  const data = await fetchGraphql(query);
  console.log(data);

  return data.Destination;
};

export const login = async (user) => {
  console.log(user);

  const query = {
    query: `
     {
  login(username: "${user.username}", password: "${user.password}") {
    token
    id
    username
  }
} 
        `,
  };
  const data = await fetchGraphql(query);
  console.log(data);
  return data.login;
};

export const register = async (user) => {
  console.log(user);

  const query = {
    query: `
mutation {
  register(username: "${user.username}", password: "${user.password}") {
    token
    username
    id
  }
}
        `,
  };
  const data = await fetchGraphql(query);
  console.log(data);
  return data.register;
};
export const addAttraction = async (attraction, token) => {
  const query = {
    query: `
mutation {
  addAttraction(
    destinationID: "${attraction.destinationID}"
    name:  "${attraction.name}"
    type:  "${attraction.type}"
    AttractionLocation: { coordinates: [ ${attraction.AttractionLocation.coordinates[0]}, ${attraction.AttractionLocation.coordinates[1]}] }
  ) {
    name
    id
    AttractionLocation {
      coordinates
    }
  }
}

        `,
  };
  const data = await addGraphql(query, token);
  console.log(data);
  return data.addAttraction;
};

export const addDestination = async (destination, token) => {
  const query = {
    query: `
mutation {
  addDestination(
    name: "${destination.name}"
    userID:"${destination.userID}"
    DestinationLocation: { coordinates: [${destination.DestinationLocation.coordinates[0]}, ${destination.DestinationLocation.coordinates[1]}] }
  ) {
    name
    DestinationLocation {
      coordinates
    }
  }
}


        `,
  };
  const data = await addGraphql(query, token);
  console.log(data);
  return data.addDestination;
};

export const deleteDestination = async (destinationID, token) => {
  const query = {
    query: `
mutation {
  deleteDestination(id: "${destinationID}") {
    id
  }
}

        `,
  };
  const data = await addGraphql(query, token);
  console.log(data);
  return data.Destination;
};
//deleteAttraction

export const deleteAttraction = async (attID, token) => {
  const query = {
    query: `
mutation {
  deleteAttraction(id: "${attID}") {
    id
  }
}


        `,
  };
  const data = await addGraphql(query, token);
  console.log(data);
  return data.attraction;
};

export const modifyAttraction = async (modifyAttraction, token) => {
  const query = {
    query: `
mutation {
  modifyAttraction(
    id: "${modifyAttraction.id}"
    name: "${modifyAttraction.name}"
    type: "${modifyAttraction.type}"
      AttractionLocation: { coordinates: [ ${modifyAttraction.AttractionLocation.coordinates[0]}, ${modifyAttraction.AttractionLocation.coordinates[1]}] }
  ) {
    name
    type
  }
}
        `,
  };
  const data = await addGraphql(query, token);

  console.log(data);
  return data.modifyAttraction;
};
//modifyDestination
export const modifyDestination = async (modifyDest, token) => {
  const query = {
    query: `
mutation {
  modifyDestination(
    id: "${modifyDest.id}"
    name: "${modifyDest.name}"
      DestinationLocation: { coordinates: [ ${modifyDest.DestinationLocation.coordinates[0]}, ${modifyDest.DestinationLocation.coordinates[1]}] }
  ) {
    name
  }
}
        `,
  };
  const data = await addGraphql(query, token);

  console.log(data);
  return data.modifyAttraction;
};
