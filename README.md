# Final Project: Music Player



## Video Demo:  <https://youtu.be/Mt0v4nDUbp0>



## Description: 
    This is a music player web-app



## Distinctiveness and Complexity: 
    Why you believe your project satisfies the distinctiveness and complexity requirements, mentioned above?

        Your web application must be sufficiently distinct from the other projects in this course 
            (and, in addition, may not be based on the old CS50W Pizza project), 
            and more complex than those.

        A project that appears to be a social network is a priori deemed by the staff to be indistinct from Project 4, 
            and should not be submitted; it will be rejected.

        A project that appears to be an e-commerce site is strongly suspected to be indistinct from Project 2, 
            and your README.md file should be very clear as to why it’s not. 
            Failing that, it should not be submitted; it will be rejected.

        Your web application must utilize Django (including at least one model) on the back-end 
            and JavaScript on the front-end.

        Your web application must be mobile-responsive.


####    1. Distinctiveness:
            My project is a music player web app, where users upload their audio files to the web. 
            Allowing others to listen to, or create their own playlist, 
                Or download those file to their local computer, 
                Or search songs based on genres, countries, artists, titles.

####    2. Complexity:
            Most of the complexity is how users interact with Media Players: 
                Changing current time of the playing song, 
                Changing volume, 
                Play previous/next song, 
                Pause, continue playing, 
                Play a bunch of songs with normal or shuffle mode, 
                Create/delete a playlist, 
                Or remove a song from the web if the current user is the one uploaded it.

            There are 3 models in my web app:
                - User 
                - Song (stores all songs' informations)
                - Playlist (stores users' playlists)

            My web app does utilize JavaScript on the front-end.



## What’s contained in each file I created
    1. capstone:
        - __init__.py
        - asgi.py
        - settings.py
        - urls.py
        - wsgi.py
    
    2. music:
        media: 
            - images
            - songs 

        migrations

        static:
            music:
                media
                - styles.css
                - music.js

        templates:
            music: 
                - layout.html
                - library.html
                - list.html
                - login.html
                - menu.html
                - register.html
                - upload.html

        - __init__.py
        - admin.py
        - apps.py
        - models.py
        - tests.py
        - urls.py
        - views.py

    3. manage.py
    4. db.sqlite3
    5. README.md
    6. requirements.txt



##  How to run my application:

####    1. Register (your username must be different from any other user)

####    2. Login

####    3. All songs (list.html)
            1. After logging in, this page is rendered, JavaScript file gets all songs (ordered by their upload date) from the database, stores them in a temporary playlist.

            2. When user clicks on a particular song, the playlist starting to play, start from that song. 
                When that song is ended, the next one is automatically played.

            3. Click on the right-side button of a row contains a particular song: 
                A table appears, where user can download the song, 
                    remove it from the web (if that user is the uploader of that song), 
                    add that song to a playlist.


####    4. Upload (upload.html)
            Where users upload a song.


####    5. Menu (menu.html)
            1. When user clicks on "Genres"/"Countries" in the header's navbar: 
                A page show all genres/countries is rendered (menu page). 

            2. Clicking on one of the menu items leads user to list page where all songs belong to that items displaying.


####    6. Library (libary.html)
            1. Clicking on a song's uploader or current user's username leads user to a page that shows:
                All created playlists of that person (if the current user is the owner of that library), 
                All songs that user uploaded (grouped by the first letter of their titles)

            2. If the current user is the owner of that library, they can delete/create a playlist of their own.
