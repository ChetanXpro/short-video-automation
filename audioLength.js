const ffmpeg = require('fluent-ffmpeg');

const inputVideoPath = './output.mp4';
const generatedAudioPath = 'path/to/generated-audio.mp3';
const outputVideoPath = 'path/to/output-video.mp4';


const audioFilePath = './test.mp3'; // Replace with your audio file path

ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
  if (err) {
    console.error('Error getting audio length:', err.message);
  } else {
    const durationInSeconds = metadata.format.duration;
    console.log(`Audio length: ${durationInSeconds} seconds`);
  }
});


