var songs = require('./songs');

function findSong (songs) {
  var song = songs[~~(Math.random() * songs.length)];
  if (song.artist === 'Prince') {
    return findSong(songs);
  }
  return song;
}

if (!module.parent) {
  console.log(11750);
}

module.exports = {
  songs: songs
};