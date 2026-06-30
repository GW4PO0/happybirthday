const musicTitle = document.querySelector('.music-title');
const musicArtist = document.querySelector('.music-artist');
const musicAudio = document.getElementById('musicAudio');
const albumArt = document.getElementById('albumArt');
const songContainers = document.querySelectorAll('.song-container');
const songsLibrary = document.getElementById('songsLibrary');
const backBtn = document.getElementById('backBtn');

let currentActiveSong = null;
let isFirstLoad = true;

// Load song durations for all songs
function loadAllSongDurations() {
    songContainers.forEach((container, index) => {
        const durationElement = container.querySelector('.song-duration');
        const src = container.dataset.src;
        
        if (src) {
            const audio = new Audio(src);
            audio.addEventListener('loadedmetadata', () => {
                durationElement.textContent = formatTime(audio.duration);
            });
            audio.addEventListener('error', () => {
                durationElement.textContent = '--:--';
            });
        }
    });
}

// Format time helper
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Play a song
function playSong(songTitle, songArtist, src, container) {
    // Remove active class from previous song
    if (currentActiveSong) {
        currentActiveSong.classList.remove('active');
    }
    
    // Add active class to new song
    if (container) {
        container.classList.add('active');
        currentActiveSong = container;
    }
    
    // Update music player
    musicTitle.textContent = songTitle;
    musicArtist.textContent = songArtist;
    musicTitle.classList.remove('active');
    void musicTitle.offsetWidth; // Trigger reflow
    musicTitle.classList.add('active');
    
    // Update album art (using default or custom)
    albumArt.style.transition = 'opacity 0.3s ease';
    albumArt.style.opacity = '0';
    setTimeout(() => {
        albumArt.src = `images/album-${songTitle.toLowerCase().replace(/\s/g, '-')}.jpg`;
        albumArt.onerror = function() {
            this.src = 'images/default-album.jpg';
        };
        albumArt.style.opacity = '1';
    }, 300);
    
    // Play audio
    musicAudio.src = src;
    musicAudio.style.display = 'block';
    musicAudio.load();
    
    // Auto-play with error handling
    musicAudio.play().catch(err => {
        console.log("Playback blocked until user interacts.");
    });
}

// Event listener for song containers
songContainers.forEach(container => {
    container.addEventListener('click', function() {
        const songTitle = this.dataset.song;
        const songArtist = this.dataset.artist;
        const src = this.dataset.src;
        
        // If the same song is clicked, don't reload
        if (currentActiveSong === this && musicAudio.src.includes(src)) {
            if (musicAudio.paused) {
                musicAudio.play().catch(() => {});
            }
            return;
        }
        
        playSong(songTitle, songArtist, src, this);
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const songs = Array.from(songContainers);
        let currentIndex = songs.indexOf(currentActiveSong);
        
        if (e.key === 'ArrowDown') {
            currentIndex = Math.min(currentIndex + 1, songs.length - 1);
        } else {
            currentIndex = Math.max(currentIndex - 1, 0);
        }
        
        if (currentIndex >= 0 && currentIndex < songs.length) {
            const song = songs[currentIndex];
            song.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            const songTitle = song.dataset.song;
            const songArtist = song.dataset.artist;
            const src = song.dataset.src;
            playSong(songTitle, songArtist, src, song);
        }
    }
});

// ----- BACK BUTTON WITH ANIMATION -----
function navigateBackWithAnimation(targetUrl) {
    // Create overlay for page transition
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(28, 28, 28);
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    document.body.appendChild(overlay);
    
    // Fade in overlay
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
    });
    
    // After animation, navigate to target
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 500);
}

// Back button click with animation
backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Add active state animation
    this.style.transform = 'scale(0.92)';
    this.style.transition = 'transform 0.15s ease';
    
    // Get the href from the link inside
    const link = this.querySelector('a');
    const targetUrl = link ? link.getAttribute('href') : 'gifts.html';
    
    // Trigger the page transition animation
    navigateBackWithAnimation(targetUrl);
});

// Also handle click on the link inside
document.getElementById('backLink')?.addEventListener('click', function(e) {
    e.preventDefault();
    // Trigger the same animation
    backBtn.click();
});

// ----- PREVENT DEFAULT BACK BUTTON BEHAVIOR -----
// This ensures that if someone clicks the back button directly, it uses our animation
document.querySelector('.back-btn')?.addEventListener('click', function(e) {
    // Already handled above
});

// Play selected song on page load (if any)
function playFirstSong() {
    if (songContainers.length > 0) {
        const firstSong = songContainers[0];
        const songTitle = firstSong.dataset.song;
        const songArtist = firstSong.dataset.artist;
        const src = firstSong.dataset.src;
        // Only load, don't auto-play
        musicTitle.textContent = songTitle;
        musicArtist.textContent = songArtist;
        musicAudio.src = src;
        musicAudio.load();
    }
}

// Initialize
loadAllSongDurations();
playFirstSong();

// Audio event listeners for visual feedback
musicAudio.addEventListener('play', function() {
    document.querySelector('.pulse-ring').style.animation = 'pulseRing 1.5s ease-in-out infinite';
});

musicAudio.addEventListener('pause', function() {
    document.querySelector('.pulse-ring').style.animation = 'pulseRing 2s ease-in-out infinite';
});

console.log('Songs page loaded! 🎵');