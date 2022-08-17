from urllib import response
from django.test import TestCase, Client

from django.utils import timezone

from .models import User, Song, Playlist
from django.db.models import Max


# Create your tests here.
class SongTestCase(TestCase):

    def setUp(self):

        """Create an user"""
        user = User.objects.create(username="user", password="1")
        date = timezone.now()
        
        """Update songs"""
        # Valid song
        song1 = Song.objects.create(uploader=user, title="song1", artists="Unknown", genre="Unknown", country="Unknown", audio="songs/song1.mp3", photo="images/song1.jpg", date=date)
        # Invalid audio file
        song2 = Song.objects.create(uploader=user, title="song2", artists="Unknown", genre="Unknown", country="Unknown", audio="songs/invalid_audio.mp4", date=date)
        # Invalid photo file
        song3 = Song.objects.create(uploader=user, title="song3", artists="Unknown", genre="Unknown", country="Unknown", audio="songs/song1.mp3", photo="images/invalid_photo.mp3", date=date)
        # Invalid title
        song4 = Song.objects.create(uploader=user, title="", artists="Unknown", genre="Unknown", country="Unknown", audio="songs/song1.mp3", date=date)

        """Create a playlist"""
        playlist1 = Playlist.objects.create(user=user, name="playlist1")
        playlist1.tracks.add(song1.id)

    def test_number_of_songs(self):
        """Check that number of song is 4"""
        self.assertEqual(Song.objects.all().count(), 4)

    def test_valid_title(self):
        """Check that song1 has valid title"""
        song = Song.objects.get(title="song1")
        self.assertTrue(song.is_valid_title())

    def test_valid_audio(self):
        """Check that song1 has valid audio"""
        song = Song.objects.get(title="song1")
        self.assertTrue(song.is_valid_audio())

    def test_valid_photo(self):
        """Check that song1 has valid photo"""
        song = Song.objects.get(title="song1")
        self.assertTrue(song.is_valid_photo())

    def test_invalid_title(self):
        """Check that song4 has invalid title"""
        song = Song.objects.get(title="")
        self.assertFalse(song.is_valid_title())

    def test_invalid_audio(self):
        """Check that song2 has invalid audio"""
        song = Song.objects.get(title="song2")
        self.assertFalse(song.is_valid_audio())

    def test_invalid_photo(self):
        """Check that song3 has invalid photo"""
        song = Song.objects.get(title="song3")
        self.assertFalse(song.is_valid_photo())

    def test_songs_count(self):
        """Check there is 1 song in playlist1"""
        playlist1 = Playlist.objects.get(name="playlist1")
        self.assertEqual(playlist1.songs_count(), 1)

    def test_remove_song(self):
        """Check that song2, song3 is removed"""
        Song.objects.get(title="").remove_song()  
        for i in range(2, 4):
            song = Song.objects.get(title=f"song{i}")
            song.remove_song()
        self.assertEqual(Song.objects.all().count(), 1)

    def test_index(self):
        """Check when user visit index(list) page"""
        c = Client()
        response = c.get("")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["tracks"].count(), 4)

    def test_valid_library_page(self):
        Song.objects.get(title="").remove_song()
        """Check when user visit library page"""
        c = Client()
        host_id = User.objects.get(username="user").id
        response = c.get(f"/library/{host_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["number_of_playlists"], 1)
        self.assertEqual(response.context["number_of_uploaded"], 3)


    def test_invalid_library_page(self):
        """Check when user visit a library of a non-existed user"""
        max_id = User.objects.all().aggregate(Max("id"))["id__max"]
        c = Client()
        response = c.get(f"/library/{max_id + 1}")
        self.assertEqual(response.status_code, 404)

    def test_songs_that_user_uploaded(self):
        """Check that user uploaded 3 songs that have their title started with letter 's'"""
        Song.objects.get(title="").remove_song()
        c = Client()
        host_id = User.objects.get(username="user").id
        response = c.get(f"/uploaded/{host_id}/s")
        self.assertEqual(len(response.context["tracks"]), 3)
        self.assertEqual(response.status_code, 200)
