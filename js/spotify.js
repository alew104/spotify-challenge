// Code a JS function that will search for the most popular songs in playlists of a certain search value
// Info needed:



var data;
var playlistTracks;
var baseUrl = 'https://api.spotify.com/v1/search?type=playlist&query='
var myApp = angular.module('myApp', [])
var accessToken;
var allTracks = {tracks:{
  }
};

$(document).ready(
    function() {
        initApp();
    }
);

function initApp(){
  $("#login-button").on('click', function() {
          loginWithSpotify();
      });
  $('#playlistSearch').hide();
  isAuth();
}

function isAuth(){
    var curURL = window.location.href;
    var splitOne = curURL.split('=');
    var splitTwo;
    if (splitOne.length == 1){
      $('login-button').show();
      $('loginForm').append('<p>Login failed, please try again</p>');
    } else {
      splitTwo = splitOne[1].split('&');
      accessToken = splitTwo[0];
      $('#playlistSearch').show();
      $('#loginForm').hide();
    }
}


loginWithSpotify = function() {
    var client_id = '62283e59b09041c0b318be64e97ae046';
    var redirect_uri = 'http://students.washington.edu/alew104/info343/spotify-challenge/index.html';
    var scopes = 'playlist-modify-public';

    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(redirect_uri);
        document.location = url;
}


var myCtrl = myApp.controller('myCtrl', function($scope, $http){
  $scope.exposeTracks = {};
  $scope.getPlaylists = function() {
    $scope.exposeTracks = {};
    console.log('getting playlists');
    $http.get(baseUrl + $scope.playlist).success(function(response){
      data = response.playlists.items;
      parseIds(data);
      console.log("after parseIDs")
      console.log(allTracks);
      $scope.exposeTracks = allTracks;
      console.log("this is exposetracks")
      console.log($scope.exposeTracks)
    })
  }

  function parseIds(data) {
    for (var i = 0; i < data.length; i++){
      var userId = data[i].owner.id;
      var playlistId = data[i].id;
      getTracks(userId, playlistId);
    };
  }

//Thank god for StackOverflow http://stackoverflow.com/questions/28617587/spotify-web-api-ajax
    function getTracks (userId, playlistId){
      $.ajax({
        url: "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks",
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
        success: function(threadsResults){
          playlistTracks = threadsResults.items;
          parseTracks(playlistTracks);
        }
        });
    }
    function parseTracks (playlistTracks){
      for (var i = 0; i < playlistTracks.length; i++){
          var trackName = playlistTracks[i].track.name;
          /*var trackArtist = playListTracks[i].artists[0].external_urls.name;
          console.log(trackArtist)*/
          /*for (var j = 0; j < playlistTracks[i].artists.length; j++){
              trackArtist = trackArtist + playlistTracks[i].artists[j].name + ' & ';
          }*/
          var trackAlbum = playlistTracks[i].track.album.name;
          var trackImage = playlistTracks[i].track.album.images[0].url;

          if (allTracks[trackName] == undefined){
              allTracks[trackName] = {
                  "trackName" : trackName,
                  //"trackArtist" : trackArtist,
                  "trackAlbum" : trackAlbum,
                  "trackImage" : trackImage,
                  "trackCount" : 1
              };
          } else {
            allTracks[trackName].trackCount++;
          }
      }
    }
})
