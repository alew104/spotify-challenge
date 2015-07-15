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
  $('#fuck').hide();
  $('#showResults').hide();
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
      $('#showResults').show();
      $('#test').show();
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

myApp.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});





var myCtrl = myApp.controller('myCtrl', function($scope, $http){
  $scope.getPlaylists = function() {
    allTracks = {tracks:{
      }
    };
    $scope.exposeTracks = {};
    //console.log('getting playlists');
    $http.get(baseUrl + $scope.playlist).success(function(response){
      data = response.playlists.items;
      parseIds(data);
      // console.log("after parseIDs")
      // console.log(allTracks);
      // $scope.exposeTracks = allTracks;
      // console.log("this is exposetracks")
      // console.log($scope.exposeTracks)
      // printTracks();
    })
  }

  function parseIds(data) {
    var requests = []
    for (var i = 0; i < data.length; i++){
      var userId = data[i].owner.id;
      var playlistId = data[i].id;
      requests.push(getTracks(userId, playlistId));
    };
    $.when(requests).done(function() {
      $scope.exposeTracks = allTracks;
      console.log("got it ", $scope.exposeTracks)
    })
  }

//Thank god for StackOverflow http://stackoverflow.com/questions/28617587/spotify-web-api-ajax
    function getTracks (userId, playlistId){
      return $.ajax({
        async:false,
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
          console.log(i);
          if (playlistTracks[i].track == null){
            //do nothing
          } else {
            var trackName = playlistTracks[i].track.name;
            var trackArtist = playlistTracks[i].track.artists[0].name;
            for (var j = 1; j < playlistTracks[i].track.artists.length; j++){
                trackArtist = trackArtist + '&' + playlistTracks[i].track.artists[j].name;
            }
            var trackAlbum = playlistTracks[i].track.album.name;
            if (playlistTracks[i].track.album.images.length == 0 || playlistTracks[i].track.album.images[0].url == undefined){
              var trackImage = "http://students.washington.edu/alew104/info343/spotify-challenge/images/noalbumart.jpg"
            } else {
              var trackImage = playlistTracks[i].track.album.images[0].url;
            }

            if (allTracks[trackName] == undefined){
                allTracks[trackName] = {
                    "trackName" : trackName,
                    "trackArtist" : trackArtist,
                    "trackAlbum" : trackAlbum,
                    "trackImage" : trackImage,
                    "trackCount" : 1
                };
            } else {
              allTracks[trackName].trackCount++;
            }
          }
      }
    }
})
