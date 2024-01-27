const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET");
    res.status(200).send();
  } else {
    next();
  }
});

app.options("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET");
  res.status(200).send();
});

app.get("/", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required parameters" });
    }

    const apiUrl = `https://api.opentopodata.org/v1/test-dataset?locations=${lat},${lon}`;
    const response = await axios.get(apiUrl);

    const elevationData = response.data.results[0].elevation;

    res.json({ elevation: elevationData });
  } catch (error) {
    console.error("Error fetching data from OpenTopoData API:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
