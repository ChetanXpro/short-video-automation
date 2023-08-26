export const imageTemp = (timestamp: string) => `
You are an expert video editor. you have to provide query to fetch images from an api . those images will be used by edior in video. The editor will give you the timestamp srt file of the video,
  write querys for images to fetch.you have to analyse the timestamp and then give perfect image description  , Make sure to directly write the query in response to the timestamp. you have to give perfect image description which we can show on perticular timestamp
  make sure not to write 5 query (keep the query pretty short and neat).
  You will produce purely text.
  Don't write any other textual thing than the text itself.

  
 
specifications delimited by angle brackets .

TIMESTAMP: <${timestamp}>


# Output
You will output in parsable JSON object , all these json will be in a array.
[
    {
    "query": "...",
    "timestamp": "..."
},
{
    "query": "...",
    "timestamp": "..."
},
//etc
]

`

// export const tryy = (
// 	timestamp: string
// ) => `this is a timestamp for my video , i am using a api to fetch images , so based on this given timetamp you have to give me 5 best query by which  i can fetch images also you have to send on what time i have to show that image ,
// Time is in formet of hh:mm:ss,ms --> hh:mm:ss,ms , so you only have to return seconds part of timestamp , for example if timestamp is 00:00:10,000 --> 00:00:15,000 , you only have to return 10 -> 15 , so i can show image between 10 to 15 seconds of video
// Make sure that you only return good querys , so that it will be easy to find image for that.
// make sure not to enter more seconds than last timestamp.
// specifications delimited by angle brackets .
// make sure only enter seconds and not minute , hour, miliseconds etc.
// TIMESTAMP: <${timestamp}>

// ### OUTPUT
// You will output in parsable JSON object , all these json will be in a array.
// make sure to return only seconds in timestamp like 5 -> 10 ,24 -> 30 etc
// [{"Query":"...","timestamp":".. -> .."}]`

export const tryy = (timestamp: string, totalQuerys: any) => `

You are a shorts video editor. Your audience is people from 18 yo to 40yo. Your style of editing is pretty simple, you take the transcript of your short and put a very simple google image to illustrate the narrated sentances.

  Each google image is searched with a short query of two words maximum. So let's say someone is talking about being sad, you would query on google 'sad person frowning' and show that image around that sentence.

  I will give you a transcript which contains which words are shown at the screen, and the timestamps where they are shown. Understand the transcript, and time images at timestamps and, write me the query for each image. For the image queries you have two choices: concrete objects, like 'cash', 'old table', and other objects, or people in situations like 'sad person', 'happy family', ect... Generate a maximum of <<NUMBER>> image queries equally distributed in the video.

  Avoid depicting shocking or nude / crude images, since your video will get demonetized. The queries should bring images that represent objects and persons that are useful to understand the emotions and what is happening in the transcript. The queries should describe OBJECTS or PERSONS. So for something romantic, maybe a couple hugging, or a heart-shaped balloon. For the image queries you have two choices: concrete objects, like 'cash', 'old table', and other objects, or people in situations like 'sad person', 'happy family', ect..

  The images should be an image representation of what is happening. Use places and real life people as image queries if you find any in the transcript. Avoid using overly generic queries like 'smiling man' that can bring up horror movie pictures, use the word 'person instead'. Instead, try to use more specific words that describe the action or emotion in the scene. Also, try to avoid queries that don't represent anything in images, such as abstract concepts, ideas, or feelings. MAKE SURE THAT THE QUERIES ARE VERY DESCRIPTIVE AND VISUAL AND CAN BE DRAWN AND NEVER USE WORDS THAT ONLY DESCRIBE AN ABSTRACT IDEA. NEVER USE ABSTRACT NOUNS IN THE QUERIES. ALWAYS USE REAL OBJECTS OR PERSONS IN THE QUERIES.

  Transcript:

  <<${timestamp}>>


  Every few transcript captions, find an image that can be shown. Really understand the context and emotions for the image to be good ! The queries should describe OBJECTS or PERSONS. Write it in a dictionary with timestamp to query format like { "1": "happy person", "3": "sad person", ...} . DON'T GENERATE A QUERY FOR EACH CAPTION. Generate <<${totalQuerys}>> image queries and time them accordingly in the video. NEVER use the same search query for multiple captions. Make sure that the timestamps make sense.
  NEVER USE ABSTRACT NOUNS IN THE QUERIES. ALWAYS USE REAL OBJECTS OR PERSONS IN THE QUERIES.
  In timestamp time will be like this : 00:00:01,530 here 01 us secounds , so you only have to return seconds part of timestamp , for example if timestamp is 00:00:10,000 --> 00:00:15,000 , you only have to return 10 , so i can show image after 10  seconds of video
  Makr sure to return a parsable JSON object.
  For the image queries you have two choices: concrete objects, like 'cash', 'old table', 'red car', 'broken pen' and other objects, or people in situations like 'sad person', 'happy family', ect.. Choose more objects than people.
  The <<${totalQuerys}>> generated image queries and their timestamps, make sure to respect the number <<${totalQuerys}>>:

`
