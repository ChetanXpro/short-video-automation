const axios = require("axios");

const apiKey = process.env.PIXEL_KEY;
const query = "Siberia";
const perPage = 1;

const apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}&orientation=portrait&size=small`;

const req = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: apiUrl,

      headers: {
        Authorization: apiKey,
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log("error");
  }
};

// req();

axios({
  method: "GET",
  url: "https://api.pexels.com/v1/photos/10539876",
  headers: { Authorization: apiKey },
}).then((response) => {
  console.log(response.data);
});
