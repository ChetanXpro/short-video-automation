const axios = require("axios");
require("dotenv").config();
const API = process.env.ELEVEN_LAB;
const fs = require("fs-extra");

const textToSpeech = async (text) => {
  const stabilityValue = 0;
  const similarityBoostValue = 0;
  const elevenLabsAPI = "https://api.elevenlabs.io/v1";
  const voiceURL = `${elevenLabsAPI}/text-to-speech/${"VR6AewLTigWG4xSOukaG"}`;

  const response = await axios({
    method: "POST",
    url: voiceURL,
    data: {
      text: text,
      voice_settings: {
        stability: stabilityValue,
        similarity_boost: similarityBoostValue,
      },
      model_id: "eleven_monolingual_v1",
    },
    headers: {
      Accept: "audio/mpeg",
      "xi-api-key": API,
      "Content-Type": "application/json",
    },
    responseType: "stream",
  });

  response.data.pipe(fs.createWriteStream("test.mp3"));
};
// textToSpeech(
//   "how are you guys"
// );
// textToSpeech(
//   "In 1919, a massive molasses tank burst in Boston, causing a sticky tidal wave that devastated the city, resulting in 21 fatalities and around 150 injuries. The event became known as the Molasses Flood"
// );

textToSpeech(
  "One of the essential lessons from the Bhagavad Gita is about performing one's duty without attachment to the results. Lord Krishna advises Arjuna to act selflessly, surrendering the fruits of his actions to the Divine. By doing so, one can attain a state of equanimity and inner peace, free from the anxieties of success or failure. This teaching emphasizes the importance of performing one's responsibilities diligently and with devotion, acknowledging that outcomes are beyond our control. It encourages us to focus on the present moment and perform our duty with sincerity, leaving the rest to the higher power, fostering a path to spiritual growth and contentment."
);

//'ErXwobaYiN019PkySvjV'
//'TxGEqnHWrfWFTfGW9XjX'
//VR6AewLTigWG4xSOukaG
