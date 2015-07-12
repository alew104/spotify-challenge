// Code a JS function that will search for the most popular songs in playlists of a certain search value
// Info needed:



var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=playlist&query='
var myApp = angular.module('myApp', [])

function loginWithSpotify() {
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
  $scope.playlists = {};
  console.log('1')
  $scope.getPlaylists = function() {
    console.log('getting playlists');
    $http.get(baseUrl + $scope.playlist).success(function(response){
      data = $scope.playlists = response.playlists.items;
      console.log(data);
      seeData(data);
    })
  }
})

function seeData (data){
  console.log(data);
}

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
