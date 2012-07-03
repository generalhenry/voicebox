var express = require('express');
var request = require('request');
var apiUrl = 'http://voiceboxpdx.com/api/v1/';
var app = express.createServer(function (req, res, next) {
  if (req.url === '/favicon.ico') {
    return next();
  }
  request('http://voiceboxpdx.com/api/v1/songs/stats.json', function (error, response, body) {
    if (error) {
      return next(error);
    }
    try {
      var stats = JSON.parse(body);
    } catch (error) {
      return next(error);
    }
    var song = findSong(stats.top_songs);
    var room_code = req.url.replace('/','');
     console.log(room_code);
    request.post({
      url: 'http://voiceboxpdx.com/api/v1/queue.json', 
      form: {
        room_code: room_code,
        song_id: song.id
      }
    }, function (error, response, body) {
      if (error) {
        return next(error);
      }
      console.log(body);
      return res.json(song);
    });
  });
});

function findSong (songs) {
  var song = songs[~~(Math.random() * songs.length)];
  if (song.artist === 'Prince') {
    return findSong(songs);
  }
  return song;
}
if (!module.parent) {
  app.listen(11750);
  console.log(11750);
}

function songs (parameters, cb) {
  if (parameter.by || parameters.prefix) {
    return songsBy(parameters, cb);
  }
  if (parameters.id) {
    return songById(parameters.id, cb);
  }
  if (parameters.ids) {
    return songsByIds(parameters.ids, cb);
  }
  if (parameters.query) {
    return songsBySearch(parameters, cb);
  }
  if (parameters === 'languages') {
    return getLanguages(cb);
  }
  if (parameters === 'stats') {
    return getStats(cb);
  }
  return songsBy({}, cb);
  function songsBy (parameters, cb) {
    request({
      url: apiUrl + 'songs.json',
      qs: parameters
    }, function (error, response, body) {
      if (error) {
        return cb(error);
      }
      try {
        var songs = JSON.parse(body);
      } catch (error) {
        return cb(error);
      }
      return cb(null, error);
    });
  }
  function songById (id, cb) {
    request({
      url: apiUrl + 'songs/' + id + '.json'
    }, function (error, response, body) {
      if (error) {
        return cb(error);
      }
      try {
        var song = JSON.parse(body);
      } catch (error) {
        return cb(error);
      }
      return cb(null, song);
    }
  }
  //blah
}
