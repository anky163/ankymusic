from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from .models import User, Song, Playlist

# Paginator
from django.core.paginator import Paginator

# Datetime
import datetime

# Upload file
from PIL import Image

import re



def pagination(tracks, number):
    pages = []
    list = []
    lists = []

    # 1 page contains maximum "number" tracks
    p = Paginator(tracks, number)
    for i in range(p.num_pages):
        page = p.page(i + 1)
        pages.append(page)
        list.append(i + 1)

    # 1 list contains maximum 5 pages
    l = Paginator(list, 5)
    for i in range(l.num_pages):
        lists.append(l.page(i + 1))

    return pages, lists



def private_playlists(request):
    # If user is logged in
    if request.user.is_authenticated:
        playlists = Playlist.objects.filter(user=request.user)
        new_playlist_index = len(playlists) + 1
    else:
        playlists = None
        new_playlist_index = 1

    return playlists, new_playlist_index




class Tracks:
    def __init__(self, key, value):
        if key == "title":
            self.all = Song.objects.filter(title__icontains=value).order_by("date").reverse()

        elif key == "artists":
            self.all = Song.objects.filter(_artists__icontains=value).order_by("date").reverse()

        elif key == "genre":
            self.all = Song.objects.filter(_genre__icontains=value).order_by("date").reverse()

        elif key == "country":
            self.all = Song.objects.filter(_country__icontains=value).order_by("date").reverse()

    def paginate(self, number):
        return pagination(self.all, number)




genres = ["pop", "dance", "rock", "jazz", "traditional", "soundtrack", "others"]
countries = ["us - uk", "korea", "japan", "china", "vietnam", "others"]




# Create your views here.
def list(request):
    tracks = Song.objects.all().order_by("date").reverse()
    pages, lists = pagination(tracks, 10)

    playlists, new_playlist_index = private_playlists(request)

    return render(request, "music/list.html", {
        "index": "index",
        "tracks": tracks,
        "pages": pages,
        "lists": lists,
        "playlists": playlists,
        "new_playlist_index": new_playlist_index
    })




def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("list"))
        else:
            return render(request, "music/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "music/login.html")




def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("list"))




def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "music/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "music/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("list"))
    else:
        return render(request, "music/register.html")




def upload(request):
    if request.method == "GET":
        return render(request, "music/upload.html")

    audio = request.FILES["audio"]

    try:
        photo = request.FILES["photo"]
    except:
        photo = None

    title = request.POST["title"].strip()
    artists = request.POST["artists"].strip()
    genre = request.POST["genre"].strip()
    country = request.POST["country"].strip()

    date = datetime.datetime.now()

    valid_audio_file = re.search(r'^.+\.mp3$', f"{audio}")
    if not valid_audio_file:
        return render(request, "music/upload.html", {
            "message": "Invalid audio file."
        })

    valid_image_file = re.search(r'^.+[\.jpg|\.jpeg|\.png]$', f"{photo}")
    if not valid_image_file:
        return render(request, "music/upload.html", {
            "message": "Invalid image file."
        })

    track = Song(uploader=request.user, audio=audio, photo=photo, title=title, artists=artists, country=country, genre=genre, date=date)
    track.save()

    return redirect("list")




def genre(request, genre):
    tracks = Tracks("genre", genre)

    if len(tracks.all) == 0:
        return render(request, "music/list.html", {
            "sorry": f'"{genre}" not found :('
        })
        
    pages, lists = tracks.paginate(10)

    playlists, new_playlist_index = private_playlists(request)

    return render(request, "music/list.html", {
        "result": f'Genre: {genre.capitalize()}',
        "tracks": tracks.all,
        "pages": pages,
        "lists": lists,
        "playlists": playlists,
        "new_playlist_index": new_playlist_index
    })




def country(request, country):
    tracks = Tracks("country", country)

    if len(tracks.all) == 0:
        return render(request, "music/list.html", {
            "sorry": f'"{country}" not found :('
        })

    pages, lists = tracks.paginate(10)

    if country.lower() == 'us - uk':
        country = country.upper()
    else:
        country = country.capitalize()

    playlists, new_playlist_index = private_playlists(request)

    return render(request, "music/list.html", {
        "result": f'Country: {country}',
        "tracks": tracks.all,
        "pages": pages,
        "lists": lists,
        "playlists": playlists,
        "new_playlist_index": new_playlist_index
    })




def search(request):
    name = request.POST.get('name')

    # Try title
    tracks = Tracks("title", name)
    if len(tracks.all) != 0:
        pages, lists = tracks.paginate(10)
        key = "Title"

    else:
        # Try artists
        tracks = Tracks("artists", name)
        pages, lists = tracks.paginate(10)

        if len(tracks.all) == 0:
            return render(request, "music/list.html", {
                "sorry": f'"{name}" not found :('
            })  

        key = "Artists" 

    playlists, new_playlist_index = private_playlists(request)

    return render(request, "music/list.html", {
        "result": f"Results of '{name}'",
        "key": key,
        "tracks": tracks.all,
        "pages": pages,
        "lists": lists,
        "playlists": playlists,
        "new_playlist_index": new_playlist_index
    })




# Upload number of views
@csrf_exempt
def update_views(request, track_id):
    try:
        track = Song.objects.get(pk=track_id)
    except Song.DoesNotExist:
        return HttpResponse("Track does not exist.", status=404)

    if request.method == "GET":
        return JsonResponse(track.serialize(), safe=False)

    elif request.method == "PUT":
        track.views += 1
        track.save()
        return HttpResponse(status=204)




@csrf_exempt
@login_required
def new_playlist(request):
    data = json.loads(request.body)

    user = request.user
    track_id = 0
    if data.get("track_id", ""):
        track_id = int(data.get("track_id", ""))
    playlist_name = data.get("playlist_name", "")

    # All existing playlists
    all_playlists = Playlist.objects.filter(user=request.user.id).all()

    # Check if the new name is different from all existing names
    message = f"Create playlist '{playlist_name}' successfully"
    for playlist in all_playlists:
        if playlist_name.lower() == playlist.name.lower():
            message = f"Playlist '{playlist.name}' already exists."
            break
    
    if message == f"Create playlist '{playlist_name}' successfully":
        new_playlist = Playlist(user=user, name=playlist_name)
        new_playlist.save()

        # If user's creating playlist and add a track to it simultaneously
        if track_id != 0:
            new_playlist.tracks.add(track_id)
        return JsonResponse({"message": message}, status=201)
    else:
        return JsonResponse({"message": message}, status=400)




@csrf_exempt
@login_required
def add_to_playlist(request):
    data = json.loads(request.body)

    track_id = int(data.get("track_id", ""))
    playlist_name = data.get("playlist_name", "")

    track = Song.objects.get(pk=track_id)
    playlist = Playlist.objects.get(user=request.user.id, name=playlist_name)

    if track not in playlist.tracks.all():
        playlist.tracks.add(track_id)
        return JsonResponse({"message": f"'{track.title}' added to '{playlist_name}'"}, status=201)
    else:
        return JsonResponse({"message": f"'{track.title}' is already in '{playlist_name}'"}, status=400)




@csrf_exempt
def library(request, host_id):
    try:
        user = User.objects.get(pk=host_id)
    except User.DoesNotExist:
        raise Http404("User not found.")

    ######### PLAYLIST #########
    playlists = Playlist.objects.filter(user=host_id)

    
    pseudo_playlist = Playlist(pk=0, user=user) # This is a button to create new playlist

    clone = []
    clone.append(pseudo_playlist)
    for playlist in playlists:
        clone.append(playlist)

    playlists_packages = []

    # 1 playlists_package contains maximum 5 playlists
    p = Paginator(clone, 5)

    for i in range(p.num_pages):
        playlists_package = p.page(i + 1)
        playlists_packages.append(playlists_package)



    ######### UPLOADED #########
    tracks = Song.objects.filter(uploader=host_id).order_by("title")

    # Put those tracks have the same title's 1st letter to the same group
    groups = []
    for i in range(27):
        groups.append([])

    for track in tracks:
        track.title = track.title.capitalize()
        n = ord(track.title[0])
        if n >= 65 and n <= 90:
            groups[n - 65].append(track)
        else:
            groups[26].append(track)

    clone = []
    for group in groups:
        if len(group) != 0:
            clone.append(group)

    uploaded_packages = []

    # 1 uploaded_package contains maximum 5 group
    g = Paginator(clone, 5)

    for i in range(g.num_pages):
        uploaded_package = g.page(i + 1)
        uploaded_packages.append(uploaded_package)


    return render(request, "music/library.html", {
        "host": user,
        "playlists_packages": playlists_packages,
        "number_of_playlists": playlists.count(),
        "uploaded_packages": uploaded_packages,
        "number_of_uploaded": tracks.count()
    })




@csrf_exempt
@login_required
def delete_playlist(request, user_id, playlist_id):
    try:
        playlist = Playlist.objects.get(pk=playlist_id, user=request.user)
    except Playlist.DoesNotExist:
        return HttpResponse("Playlist does not exist.")
    playlist.delete()
    return redirect("library", host_id=user_id)




@login_required
def play_playlist(request, playlist_id):
    if request.method == "GET":
        try:
            playlist = Playlist.objects.get(pk=playlist_id, user=request.user)
        except Playlist.DoesNotExist:
            return HttpResponse("Playlist does not exist.")
        tracks = playlist.tracks.all()

        pages, lists = pagination(tracks, 10)

        playlists, new_playlist_index = private_playlists(request)

        return render(request, "music/list.html", {
            "playlist": playlist.name,
            "result": f"Playlist: {playlist.name}",
            "tracks": tracks,
            "pages": pages,
            "lists": lists,
            "playlists": playlists,
            "new_playlist_index": new_playlist_index
        })




@csrf_exempt
@login_required
def remove_track(request, track_id):
    track = Song.objects.get(pk=track_id)
    title = track.title
    track.remove_song()
    return JsonResponse({"message": f"Track '{title}' removed."}, status=200)

    


def uploaded_view(request, host_id, letter):
    host = User.objects.get(pk=host_id)

    all_tracks = Song.objects.filter(uploader=host_id).order_by("date").reverse()

    tracks = []

    for track in all_tracks:
        if track.title[0].lower() == letter.lower():
            tracks.append(track)


    pages, lists = pagination(tracks, 10)

    playlists, new_playlist_index = private_playlists(request)

    return render(request, "music/list.html", {
        "result": f"Uploader: {host}",
        "tracks": tracks,
        "pages": pages,
        "lists": lists,
        "playlists": playlists,
        "new_playlist_index": new_playlist_index
    })




def menu(request, menu):
    packages = []
    all_lists = []

    if menu == "genres":
        for genre in genres:
            tracks = Tracks("genre", genre).all

            genre_list = {"name": genre.capitalize(), "number_of_tracks": tracks.count()}

            if genre_list["number_of_tracks"] != 0:
                all_lists.append(genre_list)

    elif menu == "countries":
        for country in countries:
            tracks = Tracks("country", country).all

            if country == "us - uk":
                country = "US - UK"
            else:
                country = country.capitalize()

            country_list = {"name": country, "number_of_tracks": tracks.count()}

            if country_list["number_of_tracks"] != 0:
                all_lists.append(country_list)


    l = Paginator(all_lists, 5)
    for i in range(l.num_pages):
        packages.append(l.page(i + 1))

    return render(request, "music/menu.html", {
        "host": request.user,
        "menu": menu.capitalize(),
        "packages": packages
    })




def artists(request, artists):
    tracks = Tracks("artists", artists)

    pages, lists = tracks.paginate(10)

    playlists, new_playlist_index = private_playlists(request)

    return render(request, "music/list.html", {
        "result": f"Artists: {artists}",
        "tracks": tracks.all,
        "pages": pages,
        "lists": lists,
        "playlists": playlists,
        "new_playlist_index": new_playlist_index
    })

