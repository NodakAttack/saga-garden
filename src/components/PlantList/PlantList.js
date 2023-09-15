import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function PlantList() {
  const dispatch = useDispatch();

  const reduxState = useSelector((store) => store.plantList);

  const plantList = useSelector((store) => store.plantList);

  useEffect(() => {
    console.log("component did mount");
    dispatch({ type: "FETCH_PLANTS" });
  }, []);

  return (
    <div>
      <h3>This is the plant list</h3>
      <pre>{JSON.stringify(reduxState)}</pre>
      <ul>
        {plantList.map(plant => (
          <li key={plant.id}>{plant.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlantList;
