from django.urls import path

from . import views


urlpatterns = [
    path("", views.list, name="list"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("upload", views.upload, name="upload"),
    path("genre/<str:genre>", views.genre, name="genre"),
    path("country/<str:country>", views.country, name="country"),
    path("search", views.search, name="search"),
    path("views/<int:track_id>", views.update_views, name="views"),
    path("remove/<int:track_id>", views.remove_track, name="remove_track"),
    path("newplaylist", views.new_playlist, name="new_playlist"),
    path("addtoplaylist", views.add_to_playlist, name="add_to_playlist"),
    path("library/<int:host_id>", views.library, name="library"),
    path("delete/playlist/<int:user_id>/<int:playlist_id>", views.delete_playlist, name="delete_playlist"),
    path("play/playlist/<int:playlist_id>", views.play_playlist, name="play_playlist"),
    path("uploaded/<int:host_id>/<str:letter>", views.uploaded_view, name="uploaded"),
    path("menu/<str:menu>", views.menu, name="menu"),
    path("artists/<str:artists>", views.artists, name="artists")
]