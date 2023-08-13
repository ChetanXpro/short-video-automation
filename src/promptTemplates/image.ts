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

export const tryy = (
	timestamp: string
) => `this is a timestamp for my video , i am using a api to fetch images , so based on this given timetamp you have to give me 5 best query by which  i can fetch images also you have to send on what time i have to show that image , 
Time is in formet of hh:mm:ss,ms --> hh:mm:ss,ms , so you only have to return seconds part of timestamp , for example if timestamp is 00:00:10,000 --> 00:00:15,000 , you only have to return 10 -> 15 , so i can show image between 10 to 15 seconds of video

specifications delimited by angle brackets .
TIMESTAMP: <${timestamp}>


### OUTPUT 
[{"Query":"...","timestamp":".. -> .."}]`
