let lastPlayedTrack = null;
const myUrl1 = new URL(window.location.toLocaleString());
const myUrl2 = new URL(myUrl1);
const user = myUrl2.searchParams.get('u');
const url_recent = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=christiaansp&api_key=${apiKey}&format=json&limit=1`;

function updateNowPlaying() {
    // the first, original fetch for raw last.fm data
    fetch(url_recent).then(response => response.json()).then(data => {
        const track = data.recenttracks.track[0];
        let artist = track.artist['#text'];
        const song = track.name;
        let album = track.album['#text'];
        //const albumArtUrl = track.image[3]['#text'];
        const mbid = track.mbid;
        const album_mbid = track.album.mbid;
        const trackUrl = track.url
            // we save the track infor in currentTrack, so it can be checked later
            // let truncatedArtist = artist.split(',')[0];
        const truncatedSong = song.split(' (')[0];
        const albumTrunc = album.split(' (')[0];
        const artistTrunc = artist.split(',')[0];
        //console.log('trackURLs info: ', trackUrl);
        let truncatedTrackName = truncatedSong.slice(0, 95);
        if (truncatedSong.length > 94) {
            truncatedTrackName += '...';
        }
        //console.log('getrecenttracks info: ', data);
        //console.log('trackURLs info: ', trackUrl);
        document.querySelector('#song-link').innerHTML = `<a href="${trackUrl}" target="_blank">Last.fm: Track</a>`;
        // Update artist information
        document.querySelector('#artist-info').textContent = `${artist}`;
        // Update track information
        document.querySelector('#track-info').textContent = `${truncatedTrackName}`;
        // insert page title
        document.querySelector('#page_title').textContent = `${truncatedTrackName} by ${artist}`;
        // Update album information
        document.querySelector('#album-info').textContent = `${album}`;
        document.querySelector('#album-info-wiki').textContent = `${album}`;
        //document.querySelector('#album-art').src = albumArtUrl;
        //coverart first from last.fm
        // document.querySelector('#last-album-art').src = albumArtUrl;
        // document.getElementById('mbid').textContent = `MBID: ${mbid}`;
        // document.getElementById('album_mbid').textContent = `MBID: ${album_mbid}`;
        const page_title = `https://www.albumoftheyear.org/search/?q=${encodeURIComponent(artist)}`;
        // search for last.fm artist
        const lastArtistUrl = `https://www.last.fm/music/${encodeURIComponent(artistTrunc)}`;
        document.querySelector('#last_artist_link').href = lastArtistUrl;
        // search for last.fm album
        const lastAlbumUrl = `https://www.last.fm/search/albums?q=${encodeURIComponent(albumTrunc)}`;
        document.querySelector('#last_album_link').href = lastAlbumUrl;
        // Update the AlbumOfTheYear.org artist link
        // Update the AlbumOfTheYear.org album link
        const aotyAlbumUrl = `https://www.albumoftheyear.org/search/albums/?q=${encodeURIComponent(albumTrunc)}`;
        document.querySelector('#aoty-album-link').href = aotyAlbumUrl;
        /// lyrics todo lyrics genius
        let genuisTrack = truncatedSong;
        genuisTrack = genuisTrack.replace(/ /g, "-");
        genuisTrack = genuisTrack.replace(/[.,\/#!$%\^&\*;:{}=’\_`~()]/g, "");
        if (genuisTrack.endsWith("!") || genuisTrack.endsWith("?")) {
            genuisTrack = genuisTrack.slice(0, -1);
        }
        genuisTrack = genuisTrack.toLowerCase();
        //console.log(genuisTrack); // "This-is-my-string"
        let genuisArtist = artistTrunc;
        genuisArtist = genuisArtist.replace(/ /g, "-");
        //myString = myString.replace(/,/g, "");
        if (genuisArtist.endsWith("!") || genuisArtist.endsWith("?")) {
            genuisArtist = genuisArtist.slice(0, -1);
        }
        genuisArtist = genuisArtist.toLowerCase();
        //console.log(genuisArtist); // "This-is-my-string"
        const geniusLyricsUrl = `https://genius.com/${encodeURIComponent(genuisArtist)}-${encodeURIComponent(genuisTrack)}-lyrics`;
        //console.log(geniusLyricsUrl); // "This-is-my-string"
        document.querySelector('#genius-lyrics-link').href = geniusLyricsUrl;
        const googleLyricsSearch = `https://www.google.com/search?q=${encodeURIComponent(truncatedSong)}+by+${encodeURIComponent(artistTrunc)}+lyrics`;
        //console.log(googleLyricsSearch); // "This-is-my-string"
        document.querySelector('#google-lyrics-search').href = googleLyricsSearch;
        return fetch(url_recent);
    }).then(response => response.json()).then(data => {
        const track = data.recenttracks.track[0];
        let artist = track.artist['#text'];
        const album = track.album['#text'];
        const songName = track.name;
        const currentTrack = track.name;
        //console.log('currentTrack for if statemt : ', currentTrack);
        // this is the tyler function, but it works for all artists: it truncates afer the comma. Right now, I have only found Tyler, the Creator with a comma in the name.
        function truncateString(str) {
            let parts = str.split(",");
            if (parts[0] === "Tyler" && parts[1] === " the Creator") {
                return `${parts[0]},${parts[1]}`;
            }
            else {
                return parts[0];
            }
        }
        let truncatedArtist = truncateString(artist);
        //console.log(`Fixed Artist: ${truncatedArtist}`);
        // Truncate album name after " ("
        // this will probably not work everywhere for every instance
        const truncatedAlbum = album.split(' (')[0];
        //console.log(`Fixed Album: ${truncatedAlbum}`);
        const encodedArtist = encodeURIComponent(truncatedArtist);
        // Fetch release group
        if (currentTrack !== lastPlayedTrack) {
            // trying populating with defaults here
            document.getElementById('wikipedia').innerHTML = '<p>No information found on wikipedia</p>';
            //document.getElementById('artist-bio').innerHTML = '<p>No information found on wikipedia</p>';
            document.getElementById('albums').innerHTML = '<p>No albums found in musicbrainz</p>';
            document.querySelector('#artist-from').textContent = `No information found on musicbrainz`;
            document.querySelector('#artist-area').textContent = `No information found on musicbrainz`;
            document.querySelector('#artist-lifespan').textContent = `No information found on musicbrainz`;
            document.querySelector('#artist-type').textContent = `No information found on musicbrainz`;
            document.querySelector('#release-date').textContent = `No date found`;
            document.querySelector('#mb-album-art').src = 'images/transparent.png';
            // truncate the album title for deezer 
            let truncatedAlbumDeezer = truncatedAlbum.split(" ").slice(0, 7).join(" ");
            //const truncatedAlbumDeezer = truncatedAlbum.split(':')[0];
            console.log('truncatedAlbum for deezer: ', truncatedAlbumDeezer);
            /// function to latinize charachters for the cors proxy, more to be badded 
            function replaceSpecialCharacters(str) {
                const map = {
                    'ä': 'a'
                    , 'ë': 'e'
                    , 'ï': 'i'
                    , 'ö': 'o'
                    , 'ü': 'u'
                    , 'á': 'a'
                    , 'é': 'e'
                    , 'í': 'i'
                    , 'ó': 'o'
                    , 'ú': 'u'
                    , 'à': 'a'
                    , 'â': 'a'
                    , 'è': 'e'
                    , 'ì': 'i'
                    , 'ò': 'o'
                    , 'ù': 'u'
                    , 'â': 'a'
                    , 'ê': 'e'
                    , 'î': 'i'
                    , 'ô': 'o'
                    , 'û': 'u'
                    , 'ã': 'a'
                    , 'ø': 'o'
                    , 'Ø': 'O'
                    , 'ū': 'u'
                    , 'ç': 'c'
                    , 'ñ': 'n'
                    , 'Ë': 'E'
                    , 'Ï': 'I'
                    , 'Ö': 'O'
                    , 'Ü': 'U'
                    , 'Á': 'A'
                    , 'É': 'E'
                    , 'Í': 'I'
                    , 'Ó': 'O'
                    , 'Ú': 'U'
                    , 'À': 'A'
                    , 'Â': 'A'
                    , 'È': 'E'
                    , 'Ì': 'I'
                    , 'Ò': 'O'
                    , 'Ù': 'U'
                    , 'Â': 'A'
                    , 'Ê': 'E'
                    , 'Î': 'I'
                    , 'Ô': 'O'
                    , 'Û': 'U'
                    , 'Ã': 'A'
                    , 'Ø': 'O'
                    , 'Ū': 'U'
                    , 'Ç': 'C'
                    , 'Ñ': 'N'
                , };
                return str.replace(/[áàââäãçéèêëíìîïñóòôöØøúùûüūÁÀÂÂÄÃÇÉÈÊËÍÌÎÏÑÓÒÔÖØØÚÙÛÜŪ]/g, function (match) {
                    return map[match];
                });
            }
            latinArtist = replaceSpecialCharacters(truncatedArtist);
            latinAlbum = replaceSpecialCharacters(truncatedAlbumDeezer);
            console.log('fixed artist ', latinArtist); // "o i u"
            console.log('fixed album ', latinAlbum); // "o i
            ///
            let deezerArtistURL = `https://api.deezer.com/search/artist?q=${latinArtist}`;
            const proxy_url1 = 'https://corsproxy.io/?' + encodeURIComponent(deezerArtistURL);
            fetch(proxy_url1).then(response => response.json()).then(data => {
                // 2. Get the artist ID
                const artistId = data.data[0].id;
                const artistImage = data.data[0].picture_big;
                console.log(`Artist Image: ${artistImage}`);
                document.querySelector('#artist-image').src = artistImage;
            });
            // end sanbox
            /// deezer sandbox here 
            //var truncatedAlbumDeezer = truncatedAlbum.substring(0, 40);
            //const album_art_fetch = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/album?q=${truncatedAlbumDeezer}`;
            // deezer if starts here
            let deezerAlbumURL1 = `https://api.deezer.com/search?q=album:"${latinAlbum}" artist:"${latinArtist}"`;
            let deezerAlbumURL2 = `https://api.deezer.com/search?q=album:"${latinAlbum}"`;
            let deezerAlbumURL1prox = 'https://corsproxy.io/?' + encodeURIComponent(deezerAlbumURL1);
            let deezerAlbumURL2prox = 'https://corsproxy.io/?' + encodeURIComponent(deezerAlbumURL2);
            console.log('URL1 orig ', deezerAlbumURL1);
            console.log('URL1 prox ', deezerAlbumURL1prox);
            console.log('URL2 orig ', deezerAlbumURL2);
            console.log('URL2 prox ', deezerAlbumURL2prox);
            let album_art_fetch;
            let albumImage;
            fetch(deezerAlbumURL1prox).then(response => response.json()).then(data => {
                let SearchResult = data.total;
                if (SearchResult === 0) {
                    album_art_fetch = deezerAlbumURL2prox;
                }
                else {
                    album_art_fetch = deezerAlbumURL1prox;
                }
                return fetch(album_art_fetch);
            }).then(response => response.json()).then(data => {
                console.log('Fetch from deezer: ', data)
                console.log('URL being used for deezer: ', album_art_fetch)
                albumImage = data.data[0].album.cover_xl;
                console.log('album art from deezer: ', albumImage)
                document.querySelector('#mb-album-art').src = albumImage;
            });
            /// deezer if ends here
            const mb_rg_url = `https://musicbrainz.org/ws/2/release-group/?query=artist:${encodedArtist} AND release:${truncatedAlbum} and title:${truncatedAlbum} &fmt=json`;
            //const mb_rg_url = `https://musicbrainz.org/ws/2/release/?query=artist:${encodedArtist} AND release:${truncatedAlbum}&fmt=json`;
            console.log(mb_rg_url);
            fetch(mb_rg_url).then(response => response.json()).then(data => {
                console.log('rg data from mb', data);
                const testObject = data;
                console.log('test data from mb', testObject);
                let filteredReleaseGroups = [];
                for (let i = 0; i < testObject.length; i++) {
                    if (testObject[i].title === truncatedAlbum) {
                        filteredReleaseGroups.push(releaseGroups[i]);
                    }
                }
                //console.log('filtered', filteredReleaseGroups);
                const releaseGroupId = data['release-groups'][0].id;
                const releaseID = data["release-groups"][0].releases[0].id
                const releaseDate = data["release-groups"][0]["first-release-date"]
                const releaseType = data["release-groups"][0]["primary-type"]
                document.querySelector('#release-date').textContent = `${releaseDate}`;
                //                    document.querySelector('#release-type').textContent = `${releaseType}`;
                //https://musicbrainz.org/ws/2/release-group/${releaseGroupID}?inc=aliases+artist-credits+releases+url-rels&fmt=json
                const mbUrl = `https://musicbrainz.org/ws/2/release-group/${releaseGroupId}?inc=aliases+artist-credits+releases+url-rels&fmt=json`;
                console.log('mbUrl for wiki album ', mbUrl)
                    // wiki sandbox ends here
                fetch(mbUrl).then(response => response.json()).then(data => {
                    let relations = data.relations;
                    // search for wikidata here
                    const filtered = relations.find(relation => relation.type === 'wikidata');
                    console.log('wikidataRelation album= ', filtered)
                    var WikiDataURL = filtered.url.resource;
                    console.log('WikiDataURL album= ', WikiDataURL)
                    const wikidataID = WikiDataURL.split('/').pop();
                    const wikipediaURL = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${wikidataID}&sitefilter=enwiki&origin=*`;
                    fetch(wikipediaURL).then(response => response.json()).then(data => {
                        console.log('wikipedia data: ', data)
                        const entities = data.entities;
                        const entity = entities[Object.keys(entities)[0]];
                        const sitelinks = entity.sitelinks;
                        const enwiki = sitelinks.enwiki;
                        const title = enwiki.title;
                        const wikipediaPageURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${encodeURIComponent(title)}&origin=*`;
                        const wikipediaPageURLdirect = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                        //console.log('direct link ', wikipediaPageURLdirect);
                        // document.querySelector('#wiki-album-page-link').href = wikipediaPageURLdirect;
                        // const formattedBio = artistBioFull.replace(/\n/g, '<br>');
                        console.log('wikipediaPageURLdirect: ', wikipediaPageURLdirect);
                        document.getElementById("wiki-album-link").href = wikipediaPageURLdirect;
                        return fetch(wikipediaPageURL);
                    }).then(response => response.json()).then(data => {
                        const pages = data.query.pages;
                        const page = pages[Object.keys(pages)[0]];
                        const extract = page.extract;
                        //const truncatedExtract = extract;
                        //let truncatedExtract = extract.split(" ").slice(0, 105).join(" ") + "...";
                        ////console.log(truncatedExtract);
                        const formattedExtract = extract.replace(/<\/p><p>/g, "</p><br><p>");
                        // const formattedExtract= extract;
                        //console.log('third wiki: ', formattedExtract);
                        document.getElementById('wikipedia_album').innerHTML = formattedExtract;
                        //href here wiki-album-link
                    })
                })
            });;
            // fetch artist images fromd deezer 
            // Fetch artist bio
            fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodedArtist}&api_key=${apiKey}&format=json`).then(response => response.json()).then(data => {
                let artistBio = data.artist.bio.summary;
                //const artistBioFull = data.artist.bio.content;
                const artistBioName = data.artist.name;
                //const formattedBio = artistBioFull.replace(/\n/g, '<br>');
                artistBio = artistBio.replace(/<a[^>]*>([^<]+)<\/a>/gi, '...');
                //console.log('Artist info: ', data);
                ////console.log(`Artist bio summary: ${artistBio}`);
                //console.log('Artist info full: ${artistBioFull}', );
                //document.querySelector('#artist-bio').innerHTML = artistBio;
                document.querySelector('#artist-bio-name').innerHTML = artistBioName;
                const tags = data.artist.tags.tag;
                let tagLinks = '';
                //console.log('tags ', tags);
                tags.forEach(tag => {
                    tagLinks += `<a href="${tag.url}" target="_blank">${tag.name}</a> `;
                });
                document.getElementById('artist-tags').innerHTML = tagLinks;
                const similarArtists = data.artist.similar.artist;
                //console.log('similar artists ', similarArtists);
                let artistLinks = '';
                similarArtists.forEach(artist => {
                    artistLinks += `<a href="${artist.url}" target="_blank">${artist.name}</a> `;
                });
                document.getElementById('similar-artists').innerHTML = artistLinks;
                const url = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodedArtist}&fmt=json`;
                //console.log('Mb artist ', url);
                fetch(url).then(response => response.json()).then(data => {
                    const mbArtistID = data.artists[0].id;
                    const mbArtist = data.artists[0];
                    //console.log('artist data from mb:  ', data);
                    //console.log('artist id:  ', mbArtistID);
                    const mbArtistURL = `https://musicbrainz.org/ws/2/release-group?artist=${mbArtistID}&type=album&fmt=json`;
                    fetch(mbArtistURL).then(response => response.json()).then(data => {
                        const releaseGroups = data['release-groups'];
                        releaseGroups.sort((a, b) => new Date(a['first-release-date']) - new Date(b['first-release-date']));
                        let html = '<ul>';
                        releaseGroups.forEach(releaseGroup => {
                            const title = releaseGroup.title;
                            const date = releaseGroup['first-release-date'];
                            const type = releaseGroup['primary-type'];
                            const mbID = releaseGroup.id;
                            const lastfmURL = `https://www.last.fm/music/${encodeURIComponent(encodedArtist)}/${encodeURIComponent(title)}`;
                            const aotyURL = `https://www.albumoftheyear.org/search/albums/?q=${encodeURIComponent(title)}`;
                            const mbURL = `https://musicbrainz.org/release-group/${mbID}`;
                            html += `<li><a href="${lastfmURL}" target="_blank"><img src="images/last.fm.png" alt="${title}" ></a><a href="${aotyURL}" target="_blank"><img src="images/aoty.png" alt="${title}"></a><a href="${mbURL}" target="_blank"><img src="images/mb.png" alt="${title}"></a><span>${title} (${date})</span></li>`;
                        });
                        html += '</ul>';
                        document.getElementById('albums').innerHTML = html;
                        /// code pasted here
                        const mbURLwiki = `https://musicbrainz.org/ws/2/artist/${mbArtistID}?inc=url-rels&fmt=json`;
                        // james blake doesn't work
                        //console.log('debug url:', mbURLwiki)
                        fetch(mbURLwiki).then(response => response.json()).then(data => {
                            let relations = data.relations;
                            const wikidataRelation = relations.find(relation => relation.type === 'wikidata');
                            const wikidataURL = wikidataRelation.url.resource;
                            const wikidataID = wikidataURL.split('/').pop();
                            const wikipediaURL = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${wikidataID}&sitefilter=enwiki&origin=*`;
                            // this removes all the entries from the relations array with an empty source-credit (i.e.: all aliases are removed)
                            let filteredRelations = data.relations.filter(relation => !relation['source-credit']);
                            //console.log('filteredRelations urls: ', filteredRelations);
                            const urls = filteredRelations.filter(relation => ['last.fm', 'allmusic', 'discogs'].includes(relation.type)).map(relation => ({
                                url: relation.url.resource
                                , type: relation.type
                            }));
                            console.log('relations urls: ', data);
                            const relationsDiv = document.getElementById('relations-auto');
                            relationsDiv.innerHTML = '';
                            urls.forEach(url => {
                                const img = document.createElement('img');
                                img.src = `images/${url.type}.png`;
                                const a = document.createElement('a');
                                a.href = url.url;
                                a.target = '_blank';
                                a.appendChild(img);
                                relationsDiv.appendChild(a);
                            });
                            // relationships end here
                            //console.log('first wiki: ', wikipediaURL);
                            // add more artist info here 
                            const artistOrigin = data.country;
                            const artistLifespan = data["life-span"].begin;
                            const artistType = data.type;
                            const artistArea = data.area.name;
                            const artistName = data.name;
                            const lastArtistUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}`;
                            //console.log('Logged from MB! ', lastArtistUrl);
                            document.querySelector('#artist-from').textContent = `${artistOrigin}`;
                            document.querySelector('#artist-area').textContent = `${artistArea}`;
                            document.querySelector('#artist-lifespan').textContent = `${artistLifespan}`;
                            document.querySelector('#artist-type').textContent = `${artistType}`;
                            document.getElementById("last_artist_link").href = lastArtistUrl;
                            const musicBrainzArtistLink = `https://musicbrainz.org/artist/${encodeURIComponent(mbArtistID)}`;
                            //console.log('artist id link for link ', musicBrainzArtistLink);
                            document.querySelector('#mb-artist-link').href = musicBrainzArtistLink;
                            const aotyArtistSearch = `https://www.albumoftheyear.org/search/artists/?q=${encodeURIComponent(artistBioName)}`;
                            document.querySelector('#aoty-artist-link').href = aotyArtistSearch;
                            /// go on to grab the wikipdia data
                            return fetch(wikipediaURL);
                        }).then(response => response.json()).then(data => {
                            const entities = data.entities;
                            const entity = entities[Object.keys(entities)[0]];
                            const sitelinks = entity.sitelinks;
                            const enwiki = sitelinks.enwiki;
                            const title = enwiki.title;
                            const wikipediaPageURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${encodeURIComponent(title)}&origin=*`;
                            const wikipediaPageURLdirect = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                            //console.log('direct link ', wikipediaPageURLdirect);
                            document.querySelector('#wiki-page-link').href = wikipediaPageURLdirect;
                            // const formattedBio = artistBioFull.replace(/\n/g, '<br>');
                            //console.log('second wiki: ', wikipediaPageURL);
                            return fetch(wikipediaPageURL);
                        }).then(response => response.json()).then(data => {
                            const pages = data.query.pages;
                            const page = pages[Object.keys(pages)[0]];
                            const extract = page.extract;
                            // this is to create a wikipedia extract but not currently used 
                            let truncatedExtract = extract.split(" ").slice(0, 105).join(" ") + "...";
                            ////console.log(truncatedExtract);
                            const formattedExtract = extract.replace(/<\/p><p>/g, "</p><br><p>");
                            // const formattedExtract= extract;
                            ////console.log('third wiki: ', formattedExtract);
                            document.getElementById('wikipedia').innerHTML = formattedExtract;
                            document.getElementById('wikipedia').innerHTML = formattedExtract;
                            //document.querySelector('#artist-bio').innerHTML = truncatedExtract;
                        });
                        // until here
                    });
                });
            });
            // I populate the last played track here 
            lastPlayedTrack = currentTrack;
        } /// this is the end bracket for the if statement 
    }); // these are the final brackets for the first fetch (get new playing onfo) requests
}
/// now playing function ends here 
var pageHeight = document.documentElement.scrollHeight;
console.log(pageHeight);
window.onload = function () {
    var pageHeight = document.documentElement.scrollHeight;
    document.querySelector('#side-bar .content').style.height = pageHeight + 'px';
}

function expandFooter() {
    document.getElementById("footer").style.height = "100%";
}

function collapseFooter() {
    document.getElementById("footer").style.height = "0px";
}
/* Fullscreen */
let elem = document.documentElement;
/* View in fullscreen */
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    }
    else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    }
    else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    }
    else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
}
/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
    }
}

function fullscreen() {
    let isFullscreen = document.fullscreen;
    if (isFullscreen == true) {
        closeFullscreen();
    }
    else {
        openFullscreen();
    }
}

// Glances configuration for remote device (API version 4)
const glancesConfig = {
    baseUrl: 'http://192.168.1.100:61208', // Replace with your device's IP address
    endpoints: {
        cpu: '/api/4/cpu', // CPU usage
        mem: '/api/4/mem', // Memory usage
        fs: '/api/4/fs', // Filesystem (disk) usage
        swap: '/api/4/swap', // Swap usage
     //   sensors: '/api/4/sensors', // CPU temperature (optional and non-functional on MacOS (in my testing)) 
    }
};

// Function to fetch Glances data
async function fetchGlancesData(endpoint) {
    try {
        const response = await fetch(`${glancesConfig.baseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

// Function to update system stats from Glances
async function updateSystemStats() {
    try {
        // Fetch CPU, memory, disk, and swap data
        const [cpuData, memData, fsData, swapData, sensorsData] = await Promise.all([
            fetchGlancesData(glancesConfig.endpoints.cpu),
            fetchGlancesData(glancesConfig.endpoints.mem),
            fetchGlancesData(glancesConfig.endpoints.fs),
            fetchGlancesData(glancesConfig.endpoints.swap),
            fetchGlancesData(glancesConfig.endpoints.sensors),
        ]);

        // Update CPU usage
        if (cpuData) {
            const cpuUsage = cpuData.total;
            document.getElementById('cpu-usage').textContent = `CPU: ${cpuUsage}%`;
            
            // Change icon color based on CPU usage
            const statsIcon = document.querySelector('.stats-icon i.material-icons');
            if (parseFloat(cpuUsage) > 80) {
                statsIcon.style.color = '#F44336'; // Red for high usage
            } else if (parseFloat(cpuUsage) > 50) {
                statsIcon.style.color = '#FFC107'; // Yellow for medium usage
            } else {
                statsIcon.style.color = '#64B5F6'; // Blue for normal usage
            }
        }

        // Update CPU temperature
        if (sensorsData && sensorsData.temperatures && sensorsData.temperatures.length > 0) {
            const cpuTemp = sensorsData.temperatures[0].value; // Assuming the first sensor is CPU
            document.getElementById('cpu-temp').textContent = `Temp: ${cpuTemp}°C`;
        }

        // Update RAM usage
        if (memData) {
            const ramUsage = memData.percent;
            const ramTotal = (memData.total / 1024 / 1024 / 1024).toFixed(1); // Convert to GB
            const ramUsed = (memData.used / 1024 / 1024 / 1024).toFixed(1); // Convert to GB
            document.getElementById('ram-usage').textContent = `RAM: ${ramUsed}GB / ${ramTotal}GB`;
        }

        // Update Swap usage
        if (swapData) {
            const swapUsage = swapData.percent;
            document.getElementById('swap-usage').textContent = `Swap: ${swapUsage}%`;
        }

        // Update Disk usage
        if (fsData && fsData.length > 0) {
            // Sum up disk usage across all filesystems
            let totalDiskSize = 0;
            let totalDiskUsed = 0;
            fsData.forEach(fs => {
                totalDiskSize += fs.size; // Total size in bytes
                totalDiskUsed += fs.used; // Used size in bytes
            });

            // Convert to GB
            const diskTotal = (totalDiskSize / 1024 / 1024 / 1024).toFixed(1);
            const diskUsed = (totalDiskUsed / 1024 / 1024 / 1024).toFixed(1);
            document.getElementById('disk-usage').textContent = `Disk: ${diskUsed}GB / ${diskTotal}GB`;
        }

        // Update system status
        document.getElementById('system-status').textContent = 'Online';
        document.getElementById('system-status').style.color = '#4CAF50';
    } catch (error) {
        console.error('Error updating system stats:', error);
        document.getElementById('system-status').textContent = 'Offline';
        document.getElementById('system-status').style.color = '#F44336';
    }
}

// Initialize system stats widget
updateSystemStats();

// Refresh system stats every 10 seconds
setInterval(updateSystemStats, 10000);


// Update the now playing information every 3 seconds
setInterval(updateNowPlaying, 2000);
