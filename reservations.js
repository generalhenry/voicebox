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