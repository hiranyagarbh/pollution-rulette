const axios = require("axios");
require("dotenv").config();

const OPENAQ_API_KEY = process.env.OPENAQ_API_KEY;
const API_KEY = process.env.OPENAQ_API_KEY;

// Function to fetch locations from OpenAQ API
async function getLocations() {
  try {
    const response = await axios.get("https://api.openaq.org/v3/locations", {
      headers: {
        "X-API-Key": API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching location data:", error.message);
    return [];
  }
}

// Function to fetch sensor details by sensor ID
async function getSensorDetails(sensorId) {
  try {
    const response = await axios.get(
      `https://api.openaq.org/v3/sensors/${sensorId}`,
      {
        headers: {
          "X-API-Key": API_KEY,
        },
      },
    );
    return response.data.results[0];
  } catch (error) {
    console.error(
      `Error fetching sensor details for sensor ${sensorId}:`,
      error.message,
    );
    return null;
  }
}

// Function to process and fetch details for all locations and their sensors
async function getLocationData() {
  const locations = await getLocations();

  if (locations.length === 0) {
    console.log("No locations found");
    return;
  }

  // Loop through each location and fetch sensors and sensor details for each
  for (const location of locations) {
    const locationData = {
      id: location.id,
      name: location.name,
      locality: location.locality,
      timezone: location.timezone,
      country: location.country.name,
      sensors: [],
    };

    // Fetch details for each sensor
    const sensors = location.sensors || [];
    for (const sensor of sensors) {
      const sensorDetails = await getSensorDetails(sensor.id);
      if (sensorDetails) {
        const sensorData = {
          id: sensorDetails.id,
          name: sensorDetails.name,
          parameter: sensorDetails.parameter,
          summary: sensorDetails.summary,
        };
        locationData.sensors.push(sensorData);
      }
    }

    console.log(locationData); // Outputs combined data for the location and its sensors
  }
}

// Start the process
getLocationData();
