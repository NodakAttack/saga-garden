import React from "react";
import ReactDOM from "react-dom/client";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import axios from "axios";

import { takeEvery, put } from "redux-saga/effects";

import App from "./App";

const plantList = (state = [], action) => {
  switch (action.type) {
    case "SET_PLANTS":
      return action.payload;
    case "ADD_PLANT_REDUCER":
      return [...state, action.payload];
    case "DELETE_PLANT_REDUCER":
      return state.filter((plant) => plant.id !== action.payload);
    default:
      return state;
  }
};

function* fetchPlants() {
  try {
    const plantsResponse = yield axios.get("/api/plant");
    yield put({ type: "SET_PLANTS", payload: plantsResponse.data });
  } catch (error) {
    console.log("error fetching plants", error);
  }
}

function * addPlant(action) {
  try {
    const newPlantData = action.payload
    const plantsResponse = yield axios.post("/api/plant", newPlantData);
    yield put({ type: "ADD_PLANT_REDUCER" , payload: plantsResponse.data })
  } catch (error) {
    console.log("Error adding plant", error);
  }
}

function * deletePlant(action) {
  try {
    const id = action.payload;
    yield axios.delete(`/api/plant/${id}`);
    yield put ({ type: "DELETE_PLANT_REDUCER" , payload: id})
  } catch (error) {
    console.log("Error deleting plant", error);
  }
}

function* rootSaga() {
  yield takeEvery("FETCH_PLANTS", fetchPlants);
  yield takeEvery("ADD_PLANT", addPlant);
  yield takeEvery("DELETE_PLANT", deletePlant);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ plantList }),
  applyMiddleware(sagaMiddleware, logger)
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
