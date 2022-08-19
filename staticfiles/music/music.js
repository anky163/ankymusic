
let is_playing = false;
let is_repeated = false;
let is_shuffled = false;
let big_player_mode = false;

let current_page_number = 0;

let ordered_playlist = [];
let current_playlist = [];
let number_of_tracks = 0;
let current_track_id = 0;
let current_index = 0;



let result = document.getElementById('result');

let paginator_navbar = document.getElementById('paginator-navbar');

let tracks_list = document.getElementById('tracks-list');
let playing_markers = document.querySelectorAll('.playing-markers');


// The Player / Mini Player board's contents
    let player = document.getElementById('player');
    let mini_player = document.getElementById('mini-player');

    let audio = document.getElementById('audio');

    let pause_icon = document.getElementById('pause-icon');
    let pause_icon_2 = document.getElementById('pause-icon-2');

    let current_time = document.getElementById('current-time');
    let current_time_2 = document.getElementById('current-time-2');

    let volume = document.getElementById('volume');
    let volume_bonus = document.getElementById('volume-bonus');
    let volume_2 = document.getElementById('volume-2');

    let volume_icon = document.getElementById('volume-icon');
    let volume_icon_bonus = document.getElementById('volume-icon-bonus');
    let volume_icon_2 = document.getElementById('volume-icon-2');

    let loop_button = document.getElementById('repeat');
    let loop_button_2 = document.getElementById('repeat-2');

    let loop_icon = document.getElementById('loop-icon');
    let loop_icon_2 = document.getElementById('loop-icon-2');

    let shuffle_button = document.getElementById('random');
    let shuffle_button_2 = document.getElementById('random-2');

    let shuffle_icon = document.getElementById('shuffle-icon');
    let shuffle_icon_2 = document.getElementById('shuffle-icon-2');



// Track's information
    let all_tracks = document.querySelectorAll('.all-tracks');

    let download_button = document.getElementById('download-button');

    let track_image = document.getElementById('track-image');
    let track_image_2 = document.getElementById('track-image-2');

    let track_title = document.getElementById('track-title');
    let track_title_bonus = document.getElementById('track-title-bonus');
    let track_title_2 = document.getElementById('track-title-2');

    let track_artists = document.getElementById('track-artists');
    let track_artists_2 = document.getElementById('track-artists-2');

    let track_audio = document.getElementById('track-audio');
    let track_bar = document.querySelectorAll('.track-bar');
    let track_onclick = document.querySelectorAll('.track-onclick');





// Adding table
    let adding = document.getElementById('adding');
    let table_2 = document.getElementById('table-2');
    let table_1 = document.querySelectorAll('.table-1');
    let table_3 = document.getElementById('table-3');
    let table_4 = document.getElementById('table-4');

    let adding_download_button = document.getElementById('adding-download-button');

    let all_playlists = document.getElementById('all-playlists');
    let search_playlist = document.getElementById('search-playlist');
    let default_results = document.querySelectorAll('.default-results');

    let new_playlist_name = document.getElementById('new-playlist-name');
    let added_track_id = document.getElementById('added-track-id');

    let remove_track = document.getElementById('remove-track');
    let remove_track_anchor_link = document.getElementById('remove-track-anchor-link');
    let agree_removing_track = document.getElementById('agree-removing-track');



// Library page
    let playlists_container = document.getElementById('playlists-container');
    let previous_buttons = document.querySelectorAll('.media-previous');
    let next_buttons = document.querySelectorAll('.media-next');

    let library_deleting = document.getElementById('library-deleting');
    let agree_deleting_playlist = document.getElementById('agree-deleting-playlist');

    let library_creating = document.getElementById('library-creating');

    let uploaded_container = document.getElementById('uploaded-container');
    let previous_buttons_2 = document.querySelectorAll('.media-previous-2');
    let next_buttons_2 = document.querySelectorAll('.media-next-2');










    

// All functions for Player page
function pauseTrack() { 

    if (is_playing === true) {
        audio.pause();
        is_playing = false;

        // Change icon
        pause_icon.className = 'fa fa-play';
        pause_icon_2.className = 'fa fa-play';

    }
    else {
        audio.play();
        is_playing = true;

        // Change icon
        pause_icon.className = 'fa fa-pause';    
        pause_icon_2.className = 'fa fa-pause';
   
    }
}


function changeCurrentTime() {

    // Changing current time at Big Player
    if (big_player_mode === true) 
    {
        current_time_2.value = current_time.value;
    }

    // Changing current time at Mini Player
    else if (big_player_mode === false) 
    {  
        current_time.value = current_time_2.value;
    }
    audio.pause();
    audio.currentTime = audio.duration * (current_time.value / 100);
    audio.play();

}


function changeVolume() { 

    // If user's changing volume at Big Player
    if (big_player_mode === true) 
    {
        audio.volume = volume.value / 100;  
        volume_bonus.value = volume.value;      
        volume_2.value = volume.value;
    }

    // User's changing volume at Mini Player 
    else if (big_player_mode === false)
    {
        audio.volume = volume_2.value / 100;
        volume.value = volume_2.value;
        volume_bonus.value = volume_2.value;
    }

    // If user set volume = 0
    if (audio.volume === 0) {
        volume_icon.className = 'fa fa-volume-off';  
        volume_icon_bonus.className = 'fa fa-volume-off'; 
        volume_icon_2.className = 'fa fa-volume-off';
    }
    else {
        volume_icon.className = 'fa fa-volume-up';
        volume_icon_bonus.className = 'fa fa-volume-up';
        volume_icon_2.className = 'fa fa-volume-up';
    }
}


function changeBonusVolume() { 

    audio.volume = volume_bonus.value / 100;
    volume.value = volume_bonus.value;
    volume_2.value = volume_bonus.value;

    // If user set volume = 0
    if (audio.volume === 0) {
        volume_icon.className = 'fa fa-volume-off';  
        volume_icon_bonus.className = 'fa fa-volume-off'; 
        volume_icon_2.className = 'fa fa-volume-off';
    }
    else {
        volume_icon.className = 'fa fa-volume-up';
        volume_icon_bonus.className = 'fa fa-volume-up';
        volume_icon_2.className = 'fa fa-volume-up';
    }
}


function updateCurrentTime() { 
    current_time.value = (audio.currentTime / audio.duration) * 100; 
    current_time_2.value = (audio.currentTime / audio.duration) * 100;
}


function changePlayIcon() { 

    is_playing = true;

    pause_icon.className = 'fa fa-pause';
    pause_icon_2.className = 'fa fa-pause';

}


function repeatTrack() { 

    if (is_repeated === false) {

        is_repeated = true;  

        loop_button.style.background = '#FF8A65';
        loop_icon.style.color = '#566573';

        loop_button_2.style.backgroundColor = '#CCCCCC';
        loop_icon_2.style.color = '#566573';

        audio.loop = true;

    }

    else {

        is_repeated = false;

        loop_button.style.background = 'rgba(255,255,255,0.1)';
        loop_icon.style.color = 'white';

        loop_button_2.style.backgroundColor = '#566573';
        loop_icon_2.style.color = 'white';

        audio.loop = false;

    }
    console.log(`Is repeated? ${is_repeated}`);
}




















// All Paginator's functions
function hideAllPages() {

    document.querySelectorAll('.paginator').forEach(div => {
        div.style.display = 'none';
    }) 
    document.querySelectorAll('.paginator-navbar').forEach(navbar => {
        navbar.style.display = 'none';
    }) 

}


function showPage(page_number) {

    current_page_number = page_number;

    hideAllPages();

    // Only when Big Player is not displaying, paginator and tracks list are displayed
    if (big_player_mode === false) {
        document.getElementById(`page-${page_number}`).style.display = 'block';
        document.getElementById(`paginator-${page_number}`).style.display = 'block';

        document.querySelectorAll('.page-link').forEach(link => {
            link.style.removeProperty("background-color");
            link.style.removeProperty("color");
            if (link.dataset.page_number === current_page_number) {
                link.style.backgroundColor = '#5D6D7E';
                link.style.color = 'white';
            }
        })
    }

    //console.log(`Big Player is displaying? ${big_player_mode}`);

}


function showPaginator(element) {
    let edge_number = parseInt(element.dataset.edge);
    let page_number = 0;

    // Load the first page of previous/next list
    let direction = element.dataset.direction;
    if (direction === 'previous') {
        page_number = edge_number - 5;
    }
    else if (direction === 'next') {
        page_number = edge_number + 1;
    }

    showPage(page_number);

    // Here we go again, haizz !!!
    let page_link = document.getElementById(`page-link-${page_number}`);
    page_link.style.backgroundColor = '#566573';
    page_link.style.color = 'white';

}

















// All Players's function
function cloneArray(origin) {
    return JSON.parse(JSON.stringify(origin));
}


function playPreviousTrack() {

    // Find out current track's position in current_playlist
    for (let i = 0; i < number_of_tracks; i++) {
        if (current_playlist[i].id === current_track_id) {
            current_index = i;
        }
    }

    if (current_index > 0) {
        loadTrack(current_index - 1);
    }

    // If current track is the first track in the playlist, play the final one
    else {
        loadTrack(number_of_tracks - 1);
    }

}


function playNextTrack() {

    for (let i = 0; i < number_of_tracks; i++) {
        if (current_playlist[i].id === current_track_id) {
            current_index = i;
        }
    }

    
    if (current_index < number_of_tracks - 1) {
        loadTrack(current_index + 1);
    }

    // If current track is the final track in the playlist, play the first one
    else {
        loadTrack(0);
    }

}


function showMiniPlayer() {
    mini_player.style.visibility = 'visible';
    mini_player.style.display = 'inline-flex';
}


function loadTrack(index) {

    let track = current_playlist[index];

    // Modify some CSS stuff 
    playing_markers.forEach(marker => {
        marker.style.display = 'none';
    })

    // Set background color of all track rows
    track_bar.forEach(row => {
        row.style.removeProperty("background-color");
    })

    // Change background color of current track
    let row = document.getElementById(`track-${track.id}`);
    row.style.backgroundColor = '#CCCCCC';

    let playing_marker = document.getElementById(`playing-marker-of-track-${track.id}`);
    playing_marker.style.display = 'block';

    // Load pagination that contains that track
    showPage(row.dataset.page_number);


    // If there are more than 1 track in the playing list
    if (number_of_tracks > 1) {

        // If the chosen track is not the one which is playing
        if (track.id !== current_track_id) {

            current_track_id = track.id;

            audio.pause();     

            
            // Load download button
            download_button.href = `/music/media/${track.audio}`;


            // Load track's image at both Big Player and Mini Player
            if (track.image === '') {
                track_image.src = '/static/music/media/music.jpg';
                track_image_2.src = '/static/music/media/music.jpg';
            }
            else {
                track_image.src = `/music/media/${track.image}`;
                track_image_2.src = `/music/media/${track.image}`;
            }

            // Load track's title at both Big Player and Mini Player
            track_title.innerHTML = track.title;
            track_title_bonus.innerHTML = track.title;

            track_title_2.innerHTML = track.title;
            track_title_2.stop();
            track_title_2.start(); // Prevent marquee from pausing


            // Load track's artists at both Big Player and Mini Player
            track_artists.innerHTML = track.artists;
            track_artists_2.innerHTML = track.artists;


            // Update track's number of views
            updateViews();

            // Load track's source
            track_audio.src = `/music/media/${track.audio}`;
    
            audio.load();
            audio.play();

            //console.log(`Playing "${track.title}"`);

        }

        else {
            console.log('This track is playing');
            return false;
        }

    }

    // If there's only 1 track in playing list, click on it = rewind it
    else {
        current_track_id = track.id;
        updateViews();
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

}


function updateViews() {
    // Update track's number of views
    fetch(`/views/${current_track_id}`, {
        method: 'PUT'
    })

    // Update number of views onscreen with reload the page
    let views = document.getElementById(`views-of-track-${current_track_id}`);
    let number_of_views = parseInt(views.innerHTML);
    views.innerHTML = number_of_views + 1;
}


function shuffleThePlaylist() {
    for (let i = 0; i < number_of_tracks; i++) {

        // Choose a random index
        let j = Math.floor(Math.random() * number_of_tracks);

        // Swap 2 tracks' positions
        [current_playlist[i], current_playlist[j]] = [current_playlist[j], current_playlist[i]];

    }
}


function playWithShuffleMode() { 

    // Update shuffle button
    if (is_shuffled === true) {
        is_shuffled = false;


        shuffle_button.style.background = 'rgba(255,255,255,0.1)';
        shuffle_icon.style.color = 'white';

        shuffle_button_2.style.backgroundColor = '#566573';
        shuffle_icon_2.style.color = 'white';

        // Order playlist
        current_playlist = cloneArray(ordered_playlist);
        //console.log(current_playlist);
    } 
    else {
        is_shuffled = true;

        shuffle_button.style.background = '#FF8A65';
        shuffle_icon.style.color = '#566573';

        shuffle_button_2.style.backgroundColor = '#CCCCCC';
        shuffle_icon_2.style.color = '#566573';

        // Shuffle the current playlist
        shuffleThePlaylist();
        //console.log(current_playlist);
    }
    console.log(`Is shuffled? ${is_shuffled}`);

}
















// Show Big or Mini player
function hidePlayer() { 
    big_player_mode = false;
    //console.log(`Big Player is displaying? ${big_player_mode}`);

    player.style.display = 'none';

    showPage(current_page_number);

    if (result !== null) {
        result.style.display = 'block';
    }
   
    mini_player.style.display = 'inline-flex';
    tracks_list.style.display = 'block';
    paginator_navbar.style.display = 'block';
}


function showPlayer() { 
    big_player_mode = true;
    //console.log(`Big Player is displaying? ${big_player_mode}`);

    if (result !== null) {
        result.style.display = 'none';
    }
    
    mini_player.style.display = 'none';
    tracks_list.style.display = 'none';
    paginator_navbar.style.display = 'none';   

    player.style.display = 'block';
}

















// All adding table's function
function showAddingTable(element) {
    adding.style.display = 'table';

    adding_download_button.href = `/music/media/${element.dataset.audio}`;

    added_track_id.value = element.dataset.track_id; 

    remove_track_anchor_link.dataset.track_id = element.dataset.track_id;
    remove_track.dataset.uploader_id = element.dataset.uploader_id;

    // If current user is not the uploader of this track, the 'remove' button's not gonna appear
    if (remove_track.dataset.uploader_id !== remove_track.dataset.current_user_id) {
        remove_track.style.display = 'none'
    }

}


function removeThisTrack(element) {
    let track_id = element.dataset.track_id;
    fetch(`/remove/${track_id}`, {
        method: "PUT"
    })
    .then(reponse => reponse.json())
    .then(result => {

        alert(result.message);

        location.reload();
    })
}


function hideAddingTable() {
    adding.style.display = 'none';
}


// Show table-1 (Download, Remove, Add to playlist)
function showTable1() {
    table_2.style.display = 'none';

    table_1.forEach(row => {
        row.style.display = 'table';
    })

    // If current user is not the uploader of this track, then the 'remove' button's not gonna show up
    if (remove_track.dataset.uploader_id !== remove_track.dataset.current_user_id) {
        remove_track.style.display = 'none'
    }
}


// Hide table-1, show table-2 (Playlists)
function showTable2() {
    table_2.style.display = 'table';
    
    table_1.forEach(row => {
        row.style.display = 'none';
    })
}


// Hide table-2, show table-3 (Create playlist)
function showTable3() {
    table_2.style.display = 'none';
    table_3.style.display = 'table'
}


// Hide table-3, show table-2
function hideTable3() {
    table_2.style.display = 'table';
    table_3.style.display = 'none'
}


// Cancel or Agree removing track
function showTable4(element) {
    table_1.forEach(row => {
        row.style.display = 'none';
    })

    table_4.style.display = 'table';
    agree_removing_track.dataset.track_id = element.dataset.track_id;
}


// Hide table-4, show table-1 (Download, Remove, Add to playlist)
function cancelRemovingTrack() {
    table_4.style.display = 'none';
    table_1.forEach(row => {
        row.style.display = 'table';
    })
}


function showSearchResutls() {

    // Clear all playlists displaying
    default_results.forEach(result => {
        result.style.display = 'none';
    })

    // Query all playlists fit what user's typing
    default_results.forEach(result => {
        let result_playlist_name = result.getElementsByTagName('span')[0].innerHTML; 

        //console.log(result_playlist_name);

        if (result_playlist_name.toLowerCase().includes(search_playlist.value.toLowerCase().trim())) {
            result.style.display = 'block';
        }
    })

}


function createNewPrivatePlaylist() {
    let playlist_name = new_playlist_name.value.trim();

    // If user's creating playlist at adding table at listing.html
    if (adding !== null) {

        let track_id = added_track_id.value;

        fetch(`/newplaylist`, {
            method: 'POST',
            body: JSON.stringify({
                playlist_name: playlist_name,
                track_id: track_id
            })
        })
        .then(response => response.json())
        .then(result => {

            alert(result.message);
            hideTable3();
            showTable1();
            hideAddingTable();

            // Display new playlist without reload the page
            let newDiv = document.createElement('div');
            newDiv.setAttribute("style", "margin-bottom: 5px");

            // Query track's image
            let image_soure_of_track = null;
            for (let i = 0; i < number_of_tracks; i++) {
                if (track_id === current_playlist[i].id) {
                    image_soure_of_track = current_playlist[i].image;
                }
            }   
            let image_tag = `<img style="width: 35px; height: 35px; margin-right: 5px;" src="/music/media/${image_soure_of_track}">`;

            if (image_soure_of_track === '') {
                image_soure_of_track = '/static/music/media/music.jpg';
                image_tag = `<img style="width: 35px; height: 35px; margin-right: 5px;" src="${image_soure_of_track}">`;
            }
            

            let anchor_link = `<a style="font-size: 18px; color: white;" class="playlist_name" data-playlist_name="${playlist_name}" href="#" onclick="addTrackToPlaylist(this)">
                                    ${playlist_name}
                                </a>`;

            newDiv.innerHTML = image_tag + anchor_link;

            all_playlists.append(newDiv);    

        })

    }

    // If user's creating playlist at library.html
    else {
        fetch(`/newplaylist`, {
            method: 'POST',
            body: JSON.stringify({
                playlist_name: playlist_name,
            })
        })
        .then(response => response.json())
        .then(result => {

            alert(result.message);

            // Reload the page
            location.reload();

        })
    }
    
}


function addTrackToPlaylist(element) {
    let playlist_name = element.dataset.playlist_name;

    //console.log(playlist_name);

    let track_id = added_track_id.value;

    fetch(`/addtoplaylist`, {
        method: 'PUT',
        body: JSON.stringify({
            track_id: track_id,
            playlist_name: playlist_name
        })
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        hideTable3();
        showTable1();
        hideAddingTable();
    })
}















// LIBRARY's functions
function showAllGroups(element) {
    let h5 = element.getElementsByTagName('h5')[0];

    // See all
    if (h5.innerHTML === 'See all') {

        // Playlists
        if (element.dataset.group_type === 'playlists') {
            playlists_container.style.display = 'flex';
            playlists_container.style.flexWrap = 'wrap';

            // Hide all arrow buttons
            previous_buttons.forEach(button => {
                button.style.display = 'none';
            })

            next_buttons.forEach(button => {
                button.style.display = 'none';
            })
        }


        // Uploaded
        else if (element.dataset.group_type === 'uploaded') {
            uploaded_container.style.display = 'flex';
            uploaded_container.style.flexWrap = 'wrap';

            previous_buttons_2.forEach(button => {
                button.style.display = 'none';
            })

            next_buttons_2.forEach(button => {
                button.style.display = 'none';
            })
        }

        h5.innerHTML = 'See less';
    }


    // See less
    else {

        // Playlists
        if (element.dataset.group_type === 'playlists') {
            playlists_container.style.display = 'grid';

            // Display all arrow buttons
            previous_buttons.forEach(button => {
                button.style.display = 'flex';
            })
            next_buttons.forEach(button => {
                button.style.display = 'flex';
            })
        }


        // Uploaded
        else if (element.dataset.group_type === 'uploaded') {
            uploaded_container.style.display = 'grid';

            previous_buttons_2.forEach(button => {
                button.style.display = 'flex';
            })
            next_buttons_2.forEach(button => {
                button.style.display = 'flex';
            })
        }

        h5.innerHTML = 'See all';
    }

}


// Agree deleting playlist
function confirmDeletingPlaylist(element) {
    library_deleting.style.display = 'table';

    agree_deleting_playlist.href = `/delete/playlist/${element.dataset.user_id}/${element.dataset.playlist_id}`;
}


// Cancel deleting
function cancelDeletingPlaylist() {
    library_deleting.style.display = 'none';
}


// Creating playlist
function showCreatingTable() {
    library_creating.style.display = 'table';
}


function cancelCreatingPlaylist() {
    library_creating.style.display = 'none';
}










// DOM Loaded
document.addEventListener('DOMContentLoaded', function() {

    if (document.getElementById('list-page') !== null) {

        // By default, load the 1st page
        showPage(1);

        // I don't know why I have to do this while I already change link's background-color in showPage() function.
        // So confusing ?!?
        let page_link_1 = document.getElementById('page-link-1');
        page_link_1.style.backgroundColor = '#566573';
        page_link_1.style.color = 'white';


        // Set volume = 10%
        audio.volume = 0.1;


        // Get informations of all songs in the playlist
        all_tracks.forEach(track => {

            ordered_playlist.push({
                "id": track.dataset.id,
                "title": track.dataset.title,
                "artists": track.dataset.artists,
                "audio": track.dataset.audio,
                "image": track.dataset.image
            })

        })

        current_playlist = cloneArray(ordered_playlist);
        number_of_tracks = ordered_playlist.length;
        
        //console.log(ordered_playlist);
        //console.log(current_playlist);


        // When user click on a table row (a particular track), play that one
        track_onclick.forEach(target => {
            target.onclick = () => {

                for (let i = 0; i < number_of_tracks; i++) {
                    if (current_playlist[i].id === target.dataset.id) {
                        showMiniPlayer();
                        loadTrack(i);
                    }
                }   

            }
        })
    }

})