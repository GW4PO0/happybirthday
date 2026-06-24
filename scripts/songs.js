const musicTitle = document.querySelector('.music-title');
const musicArtist= document.querySelector('.music-artist');
const firstSong = document.querySelector('.song-duration.first');
const musicAudio = document.querySelector('.js-music');
loadSongDataDuration();

function loadSongDataDuration(){
    const audio = new Audio('audio/Rivermaya - 214 [Lyric Video].mp3');

    
    audio.addEventListener('loadedmetadata', () => {
        const durationInSeconds = audio.duration; 
        firstSong.textContent =formatTime(durationInSeconds);
    });

}

function playHappySong(whatSong, whatArtist){
    musicTitle.textContent = whatSong;
    musicArtist.textContent = whatArtist;
    musicAudio.src = 'audio/Rivermaya - 214 [Lyric Video].mp3';
    musicAudio.style.display = 'block';
    musicAudio.load();
    musicAudio.play().catch(err => console.log("Playback blocked until user interacts."));;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}