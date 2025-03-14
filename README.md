# ----Dash.fm-improved----
This is a fork of [dash.fm](https://github.com/peterdconradie/dash.fm) i improved the index.html and css to have a way nicer look with a blurred background following the album's background and added a few other nicer touches. More will be added soon (check the roadmap below) Check the original README below for instructions.

# Roadmap:

* ✅ Fork Succesfully
* ✅ Drastically improve original UI
* ✅ Stats widget
* ⏩️ Weather widget (home assistant or openweathermap)
* ⏩️ Time widget
* ⏩️ Easy to configure widgets
* ⏩️ Community made widgets native support


# Stats widget instructions:
The stats widget requires for your host machine (the one giving the stats) to be running glances in the background, below i will instruct you on how to set this up.
The first step is to install Glances, for this use python with pip like so: </br>
```pip install glances[all]``` </br>
After this, run: </br>
```glances -w``` </br>
Or </br>
```python3 -m glances -w``` </br>
Which will start a web enviroment which also deploys the api for your LAN. It is a good idea to run this in the background, which i will not explain on how to do
since it differs per operating system. </br>
When the web enviroment is running, go over to get_data.js and head over to the glancesconfig (roughly around line 490) and change the baseURL to the IP address of your device. (DO NOT CHANGE THE PORT (:61208)) And if you then run the page it should show pc's stats! Enjoy!


# Original README:

# dash.fm: a now playing dashboard for last.fm
This dashboard displays album art and information about the artist and track currently playing on last.fm for a particular user. It fetches data from the last.fm, Wikipedia, Musicbrainz and Deezer APIs. It can run without a server or easily be deployed to a site using https://www.w3schools.com/spaces/ or netlify.com.

## Setup
Setup involves obtaining a last.fm API key and inserting it into the key.js file. The dashboard can display your own or another user’s information by changing the user "&user=xxx" to your own inside of get_data.js  ```const url_recent = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=xxx&api_key=${apiKey}&format=json&limit=1`; ``` 


It has three main views: album art with song details, artist bio with an option for full biography or full screen view, and images from the coverart archive. The dashboard’s accuracy depends on the correctness of your tags.

## Known Issues
* On some streaming platforms (i.e.: Tidal), collaborating artists get lumped together in a single artist tag (i.e.: see https://www.last.fm/music/Skrillex,+Missy+Elliott+&+Mr.+Oizo) when there are more than one performer on a track. This can cause issues when finding the correct info.
* The link to Genius Lyrics might break, depending on the formatting of the song title and the punctuation it contains. Google search is usually faster anyway and will always work, but Genius tends to give more detail, so I've kept both. 
* Some more obscure albums (mostly compilations) can be hard to find via the deezer api.


## Screenshots
### Just the album
![No detail](https://github.com/boreddevhq/dash.fm-improved/blob/main/screens/no_detail_view.png)



### Full artist bio
![Full artist bio](https://github.com/boreddevhq/dash.fm-improved/blob/main/screens/full_bio.png)

### Real use case:
![No detail](https://github.com/boreddevhq/dash.fm-improved/blob/main/screens/reallife.jpg)
