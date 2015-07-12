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


var jsonObj = {members: {
            host: "hostName",
            viewers: {
                user1: "value1",
                user2: "value2",
                user3: "value3"
            }
        }
}


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
  $scope.getPlaylists = function() {
    console.log('getting playlists');
    $http.get(baseUrl + $scope.playlist).success(function(response){
      data = response.playlists.items;
      parseIds(data);
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
          console.log(playlistTracks);
          parseTracks(playlistTracks);
        }
        });
    }
    function parseTracks (playlistTracks){
      console.log("parsing tracks")
      for (var i = 0; i < playlistTracks.length; i++){
          var trackName = playlistTracks[i].track.name;
          console.log(trackName)
          var artists = playlistTracks[i].artists.items;
          console.log(artists)
          var trackArtist = playListTracks[i].artists[0].name;
          console.log(trackArtist)
          /*for (var j = 0; j < playlistTracks[i].artists.length; j++){
              trackArtist = trackArtist + playlistTracks[i].artists[j].name + ' & ';
          }*/
          var trackAlbum = playlistTracks[i].track.album.name;
          console.log(trackAlbum)
          var trackImage = playlistTracks[i].track.album.images[0].url;
          console.log(trackImage)
          if (allTracks[trackName] == undefined){
              allTracks[trackName] = {
                  "trackName" : trackName,
                  "trackArtist" : trackArtist,
                  "trackAlbum" : trackAlbum,
                  "trackImage" : trackImage,
                  "trackCount" : 1
              };
              console.log(allTracks[trackName])
          } else {
            allTracks[trackName].trackCount++;
            console.log(allTracks[trackName].trackCount);
          }
      }
    }
})


/*$.ajax({
                url:        'https://api.spotify.com/v1/users/bbc_playlister/playlists/4ozvRrHgk23R4syZv52XNz',
           headers: {
             'Authorization': 'Bearer ' + access_token
           },*/

/*var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}
  $scope.getSongs = function() {
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items

    })
  }
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()
      $scope.currentSong = song
    }
  }
})

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
}); */
