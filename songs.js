var request = require('request');
var util = require('util');
var config = require('./config');
var apiUrl = config.apiUrl;

function songs (parameters, cb) {
  if (typeof parameters === 'function') {
    return songsBy({}, parameters);
  }
  if (parameters.by || parameters.prefix) {
    return songsBy(parameters, cb);
  }
  if (typeof parameters === 'number') {
    return songById(parameters, cb);
  }
  if (util.isArray(parameters)) {
    return songsByIds(parameters, cb);
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
}

function songsBy (parameters, cb) {
  return request({
    url: apiUrl + 'songs.json',
    qs: parameters,
    json: true
  }, function (error, response, body) {
    if (error) {
      return cb(error);
    }
    return cb(null, body);
  });
}
function songById (id, cb) {
  return request({
    url: apiUrl + 'songs/' + id + '.json',
    json: true
  }, function (error, response, body) {
    if (error) {
      return cb(error);
    }
    return cb(null, body.song || body);
  });
}
function songsByIds (ids, cb) {
  var songs = [];
  return ids.forEach(function (id) {
    return songById(id, gotSong);
  });
  function gotSong (error, song) {
    if (cb === null) {
      return false;
    }
    if (error) {
      cb(error);
      cb = null;
      return false;
    }
    songs.push(song);
    if (songs.length === ids.length) {
      return cb(null, songs);
    }
  }
}
function songsBySearch (parameters, cb) {
  return request({
    url: apiUrl + '/songs/search.json',
    qs: parameters,
    json: true
  }, function (error, response, body) {
    if (error) {
      return cb(error);
    }
    return cb(null, body);
  });
}
function getLanguages (cb) {
  return request({
    url: apiUrl + 'songs/languages.json',
    json: true
  }, function (error, response, body) {
    if (error) {
      return cb(error);
    }
    return cb(null, body);
  });
}
function getStats (cb) {
  return request({
    url: apiUrl + 'songs/stats.json',
    json: true
  }, function(error, response, body) {
    if (error) {
      return cb(error);
    }
    return cb(null, body);
  });
}

module.exports = songs;

if (!module.parent) {
  songs(console.log);
  songs({by:'popularity'},console.log);
  songs({query:'bowie'},console.log);
  songs(11750, console.log);
  songs([11750,57181],console.log);
  songs('languages', console.log);
  songs('stats', console.log);
}