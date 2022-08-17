
from django.contrib.auth.models import AbstractUser
from django.db import models
import re

import os


# Create your models here.
class User(AbstractUser):
    pass


class Song(models.Model):
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploader")

    title = models.CharField(max_length=64, blank=False, db_column="title")
    _artists = models.CharField(max_length=64, blank=True, db_column="artists")
    _country = models.CharField(max_length=64, blank=True, db_column="country")
    _genre = models.CharField(max_length=64, blank=True, db_column="genre")
    date = models.DateTimeField(db_column="date")

    views = models.IntegerField(default=0, db_column="views")

    # Save file in music/media/songs or music/media/images
    # media folder was set up in settings.py (line 125)
    photo = models.ImageField(upload_to='images', blank=True, default=None)

    audio = models.FileField(upload_to='songs', blank=False, default=None)

    def __str__(self):
        return f"Title: {self.title}, Artists: {self.artists}, Uploader: {self.uploader.username}"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "artists": self.artists,
            "image": f"{self.photo}",
            "audio": f"{self.audio}",
            "views": self.views
        }

    def is_valid_title(self):
        if matches := re.search(r'^.+$', self.title):
            return True
        return False

    def is_valid_audio(self):
        if matches := re.search(r'^songs/.+\.mp3$', f"{self.audio}"):
            return True
        return False

    def is_valid_photo(self):
        if self.photo:
            if matches := re.search(r'^images/.+[\.jpg|\.jpeg|\.png]$', f"{self.photo}"):
                return True
            return False
        return True

    def remove_song(self):
        # Remove audio file and image file
        if os.path.isfile(self.audio.path):
            os.remove(self.audio.path)

        if self.photo:
            if os.path.isfile(self.photo.path):
                os.remove(self.photo.path)

        # Remove song from database
        self.delete()

    @property
    def artists(self):
        return self._artists

    @artists.setter
    def artists(self, artists):
        if not artists:
            self._artists = "Unknown"
        else:
            self._artists = artists

    @property
    def genre(self):
        return self._genre
    
    @genre.setter
    def genre(self, genre):
        if not genre or genre.lower() not in ["pop", "dance", "rock", "jazz", "traditional", "soundtrack"]:
            self._genre = "Others"
        else:
            self._genre = genre

    @property
    def country(self):
        return self._country
    
    @country.setter
    def country(self, country):
        if not country or country.lower() not in ["us - uk", "korea", "japan", "china", "vietnam"]:
            self._country = "Others"
        else:
            self._country = country


class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")
    name = models.CharField(max_length=64, blank=False)
    tracks = models.ManyToManyField(Song, blank=True, related_name="track")

    def __str__(self):
        return f"ID: {self.id}, Name: {self.name}, Owner: {self.user.username}"

    def songs_count(self):
        return self.tracks.all().count()