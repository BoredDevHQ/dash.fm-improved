# dash.fm V1.1 🎉
🎉🎉The first release of dash.fm-improved! Enjoy and support me for future updates with feedback and by starring this repo! 🎉

This is a fork of [dash.fm](https://github.com/peterdconradie/dash.fm) It is a dashboard that displays album art and information about the artist and track currently playing on last.fm for a particular user. It fetches data from the last.fm, Wikipedia, Musicbrainz and Deezer APIs. It can run without a server or easily be deploed to a site using [w3schools](https://www.w3schools.com/spaces/) or [netlify](https://netlify.com). </br>
[![Release video](https://img.youtube.com/vi/U_x5WpvVOz4/0.jpg)](https://www.youtube.com/watch?v=U_x5WpvVOz4)

# Roadmap:

* ✅ Fork Succesfully
* ✅ Drastically improve original UI
* ✅ Stats widget
* ⏩️ Weather widget (home assistant or openweathermap)
* ⏩️ Time widget
* ⏩️ Easy to configure widgets
* ⏩️ Community made widgets native support


## Setup

For this to work you need to have some kind of way to start a PHP server. Here are the instructions for different operating systems:

### macOS

1. Using built-in PHP (if installed):
```bash
php -S localhost:8000
```

### Windows

1. Using built-in PHP (if installed):
```cmd
php -S localhost:8000
```

2. Using XAMPP:
- Download XAMPP from [apachefriends.org](https://www.apachefriends.org)
- Install XAMPP
- Start Apache from the XAMPP Control Panel
- Your server will be available at `http://localhost`

3. Using PHP on Windows Subsystem for Linux (WSL):
```bash
# Install PHP in WSL
sudo apt update
sudo apt install php

# Start PHP server
php -S localhost:8000
```

### Linux

1. Ubuntu/Debian:
```bash
# Install PHP
sudo apt update
sudo apt install php

# Start PHP server
php -S localhost:8000
```

2. Fedora:
```bash
# Install PHP
sudo dnf install php

# Start PHP server
php -S localhost:8000
```

3. Arch Linux:
```bash
# Install PHP
sudo pacman -S php

# Start PHP server
php -S localhost:8000
```

### BSD

1. FreeBSD:
```bash
# Install PHP
pkg install php

# Start PHP server
php -S localhost:8000
```

2. OpenBSD:
```bash
# Install PHP
pkg_add php

# Start PHP server
php -S localhost:8000
```

3. NetBSD:
```bash
# Install PHP
pkgin install php

# Start PHP server
php -S localhost:8000
```

### Notes:
- After starting the PHP server, make sure to keep the terminal window open
- Access your dash.fm installation at `http://localhost:8000`
- If you're using a different port, replace 8000 with your preferred port number
- For production environments, consider using a proper web server like Apache or Nginx
- If you mess up during your setup (wrong IP/API) open up the folder and clear the api key in apikey.js ```const ApiKey = "API_KEY_HERE";``` then reload the website, otherwise manually change it in apikey.js and get_data.js ```const glancesconfig = {
    baseURL: 'http://IP_ADDRESS_HERE:61208'
};``` Keep in mind that you should keep the port :61208 unless you have manually changed that in Glances.


### Troubleshooting:
- If you get a "port already in use" error, try a different port number
- Make sure PHP is in your system's PATH
- For permission errors, try running the commands with sudo (Linux/BSD) or as administrator (Windows)
- Check that PHP is installed by running `php -v`

A setup window should automatically open up on first startup, where you will fill in all your information (api key, IP address, user etc.) and then you will be good to go!
Here is said setup window:


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
