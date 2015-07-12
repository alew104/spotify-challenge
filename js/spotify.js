// Code a JS function that will search for the most popular songs in playlists of a certain search value
// Info needed:



var data;
var playlistTracks;
var baseUrl = 'https://api.spotify.com/v1/search?type=playlist&query='
var myApp = angular.module('myApp', [])
var accessToken;



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
      console.log(accessToken);
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
      console.log(data);
      parseIds(data);
    })
  }

  function parseIds(data) {
    for (var i = 0; i < data.length; i++){
      var userId = data[i].owner.id;
      console.log(userId);
      var playlistId = data[i].id;
      console.log(playlistId);
      getTracks(userId, playlistId, $http);
    };
  }

    function getTracks (userId, playlistId, $http){
      console.log(accessToken)
      $.ajax({
        url: "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks",
        headers: {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json',
          'Accept-Encoding' : 'gzip, deflate, compress',
          'Authorization': 'Bearer ' + accessToken,
          'User-Agent' : 'Spotify API Console v0.1'
        },
        success: function(threadsResults){
          console.log(threadsResults);
        }
        /*dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        method: 'GET',*/
        });

        /*var tracksurl = "https://api.spotify.com/v1/users/" + userId + "/playlists/" + playlistId + "/tracks" + ' ' + '-H' + '\"Authorization: Bearer ' + accessToken +'\"';
        $http.get(tracksurl).success(function(response){
          console.log("original")
          console.log(response);
          playlistTracks = response.items.items;
          console.log("stored")
          console.log(playlistTracks);
        })*/
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
