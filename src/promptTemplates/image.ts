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

Create a script for a video editor who makes brief, interactive, and illustrative shorts for an audience aged 18-40.

The task includes mapping timestamps of a video to relevant keywords or phrases (maximum two words) which can be used to search for fitting illustrations on Google Images. These queried images should serve as meaningful visual accompaniments to specific sentences in the video's transcript. For example, if a sentence mentions sadness, the corresponding image might be searched using the phrase 'frowning person'.

Below are some parameters to guide the image query selections:

Queries should focus on tangible objects (e.g., 'cash', 'old table') or individuals in distinct situations (e.g., 'sad person', 'happy family').
Avoid anything that could be deemed explicit, shocking, or inappropriate as this may lead to video demonetization.
Avoid overly generic or abstract words in queries that may yield unsuitable images.
The designated image should accurately depict the ongoing narrative in the video and help viewers understand the context.
The total number of image queries should not exceed <<${totalQuerys}>> and should be evenly distributed throughout the video's duration.
Here is the specific transcript to work with: <<${timestamp}>>

Please review the transcript and generate <<${totalQuerys}>> image queries corresponding to this content. The queries should be formatted in JSON object (Example: { "10": "happy person", "15": "sad person", ...}). The key should be the second part of the timestamp i.e., if timestamp is 00:00:10,000 --> 00:00:15,000, then key should be 10. Make sure that each query is unique and the total count is equal to <<${totalQuerys}>>."

Note: The emphasis here is on selecting image queries that are concrete, descriptive, visually representable, and relevant to the video's context. Abstract concepts or ideas should be converted into visual or tangible representations wherever possible.

ONLY RETURN THE PARSABLE JSON OBJECTS IN THE RESPONSE. DO NOT RETURN ANYTHING ELSE.

`
