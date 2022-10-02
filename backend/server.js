const axios = require("axios");
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors")

app.use(cors());

const GOOGLE_KEY = "AIzaSyB-pdIZw7wXo118cJMwC91W1DS82AoxLvk";
const CARBON_KEY = "vZ7xY9ttmIpgMj4eIx0w";

app.get("/driving", (req, res) => {
  axios({
    method: "get",
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${req.query.origin}&destinations=${req.query.destination}&key=${GOOGLE_KEY}`,
  })
    .then((google) => {
      const meters = google.data.rows[0].elements[0].distance.value;
      axios({
        method: "post",
        url: "https://www.carboninterface.com/api/v1/estimates",
        data: {
          type: "vehicle",
          distance_unit: "km",
          distance_value: meters / 1000,
          vehicle_model_id: "7268a9b7-17e8-4c8d-acca-57059252afe9", // 1993 Toyota Corolla
        },
        headers: {
          Authorization: "Bearer " + CARBON_KEY,
        },
      })
        .then((carbon) => {
          return res.json(carbon.data.data.attributes.carbon_kg);
        })
        .catch((err) => {
          return res.json(err);
        });
    })
    .catch((err) => {
      return res.json(err);
    });
});

app.listen(port, () => {
  console.log(`Backend deployed on port ${port}`);
});
