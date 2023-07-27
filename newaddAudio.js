const ffmpeg = require('fluent-ffmpeg');

const videoFilePath = 'new.mp4'; // Replace with your original video file path
const audioFilePath = 'test.mp3'; // Replace with your generated audio file path
const outputVideoPath = 'output-video.mp4';



ffmpeg.ffprobe(videoFilePath, (err, videoMetadata) => {
  if (err) {
    console.error('Error getting video duration:', err.message);
    return;
  }

  const videoDurationInSeconds = videoMetadata.format.duration;

  ffmpeg.ffprobe(audioFilePath, (err, audioMetadata) => {
    if (err) {
      console.error('Error getting audio duration:', err.message);
      return;
    }

    const audioDurationInSeconds = audioMetadata.format.duration;

    // Calculate how many times the audio needs to be repeated to match the video duration
    const trimDuration = Math.min(videoDurationInSeconds, audioDurationInSeconds);
    const audioSpeed = 1.1;
    const targetWidth = 1080;
    const targetHeight = 1920;
     const adjustedTrimDuration = trimDuration / audioSpeed; 
    const videoFilter = `scale=${targetWidth}:-1,pad=${targetWidth}:${targetHeight}:(ow-iw)/2:(oh-ih)/2:black`;
    const audioFilter = `atempo=${audioSpeed},aformat=sample_rates=44100:channel_layouts=stereo`;
      

    
    // Merge the audio with the video
    ffmpeg(videoFilePath)
    .inputOptions(`-t ${adjustedTrimDuration}`) 
      .input(audioFilePath)

      .videoFilter(videoFilter)
  .audioFilter(audioFilter)
  .outputOptions([
    '-map', '0:v',
    '-map', '1:a',
    '-c:v libx264',
    '-c:a aac',
  ])
      .output(outputVideoPath)
      .on('end', () => {
        console.log('Audio added to video complete!');
      })
      .on('error', (err) => {
        console.error('Error during audio adding to video:', err.message);
      })
      .run();
  });
});



// OLD WORKING

// ffmpeg(videoFilePath)
// .inputOptions(`-t ${audioDurationInSeconds}`) 
//   .input(audioFilePath)
//   .inputOptions(`-t ${trimDuration}`) // 
//   .outputOptions('-c:v', 'libx264')
//   .outputOptions('-c:a', 'aac')
// //   .outputOptions('-vf', 'scale=1080:1920,setsar=1:1')
//   .output(outputVideoPath)
//   .on('end', () => {
//     console.log('Audio added to video complete!');
//   })
//   .on('error', (err) => {
//     console.error('Error during audio adding to video:', err.message);
//   })
//   .run();\