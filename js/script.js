let currentAudio = null;
let currentSrc = null;
let isPlaying = false;

// Lấy các element
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('previous');
const nextBtn = document.getElementById('next');
const songInfo = document.querySelector('.songinfo');
const songTime = document.querySelector('.songtime');
const seekbar = document.querySelector('.seekbar');
const circle = document.querySelector('.circle');
const volumeRange = document.querySelector('input[type="range"]');

// Hàm chính để play/pause - dùng chung cho tất cả
function playMusic(audioSrc, button = null) {
    // Nếu đang phát cùng bài nhạc thì pause
    if (currentAudio && !currentAudio.paused && currentSrc === audioSrc) {
        currentAudio.pause();
        isPlaying = false;
        updatePlayButton();
        updateAllButtons();
        return;
    }
    
    // Dừng nhạc cũ nếu có
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Tạo audio mới
    currentAudio = new Audio(audioSrc);
    currentSrc = audioSrc;
    isPlaying = true;
    
    // Cập nhật UI
    updatePlayButton();
    updateAllButtons();
    
    // Play nhạc
    currentAudio.play().catch(error => {
        console.error('Error playing audio:', error);
        isPlaying = false;
        updatePlayButton();
        updateAllButtons();
    });
    
    // Event listeners cho audio (chỉ add 1 lần)
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayButton();
        updateAllButtons();
    });
    
    // Hiệu ứng click cho button nếu có
    if (button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1.05)';
        }, 100);
    }
    
    console.log('Playing song:', audioSrc);
}

// Function cho các button trong danh sách - chỉ gọi playMusic
function playPause(button) {
    const songSrc = button.getAttribute('data-src');
    playMusic(songSrc, button);
}

// Cập nhật trạng thái của player chính
function updatePlayButton() {
    if (playBtn) {
        if (isPlaying) {
            playBtn.src = 'img-app/pause.svg';
        } else {
            playBtn.src = 'img-app/play.svg';
        }
    }
}

// Cập nhật trạng thái tất cả button trong danh sách
function updateAllButtons() {
    document.querySelectorAll('.play-button').forEach(btn => {
        const btnSrc = btn.getAttribute('data-src');
        
        if (btnSrc === currentSrc && isPlaying) {
            // Button của bài đang phát - hiển thị pause icon
            btn.setAttribute('data-playing', 'true');
            btn.innerHTML = `
                <svg class="play-icon" viewBox="0 0 24 24" fill="black">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            `;
        } else {
            // Các button khác - hiển thị play icon
            btn.setAttribute('data-playing', 'false');
            btn.innerHTML = `
                <svg class="play-icon" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
    });
}

// Cập nhật progress bar
function updateProgress() {
    if (currentAudio && circle && songTime) {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
           circle.style.left = progress + '%';
        
        // Update time
        const current = formatTime(currentAudio.currentTime);
        const total = formatTime(currentAudio.duration);
        songTime.textContent = `${current} / ${total}`; 
    }
}

// Format thời gian
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Event listeners

// Play/Pause button chính
if (playBtn) {
    playBtn.addEventListener('click', () => {
        if (currentAudio) {
            if (isPlaying) {
                currentAudio.pause();
                isPlaying = false;
            } else {
                currentAudio.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
                isPlaying = true;
            }
            updatePlayButton();
            updateAllButtons();
        }
    });
}

// Volume control
if (volumeRange) {
    volumeRange.addEventListener('input', (e) => {
        if (currentAudio) {
            currentAudio.volume = e.target.value / 100;
        }
    });
}

// Seekbar click
if (seekbar) {
    seekbar.addEventListener('click', (e) => {
        if (currentAudio) {
            const rect = seekbar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            currentAudio.currentTime = percentage * currentAudio.duration;
        }
    });
}

// Toggle folder function
function toggleFolder(element) {
    const folder = element.parentElement;
    folder.classList.toggle('collapsed');
    
    const ul = folder.querySelector('.listmusic-ul');
    if (folder.classList.contains('collapsed')) {
        ul.style.display = 'none';
    } else {
        ul.style.display = 'block';
    }
}

// Click vào item để active
document.querySelectorAll('.listmusic-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.listmusic-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Hàm pause tất cả (utility function)
function pauseAll() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        isPlaying = false;
        updatePlayButton();
        updateAllButtons();
    }
}

// Hàm play bài tiếp theo (có thể mở rộng sau)
function playNext() {
    // Logic play next song
    console.log('Play next song');
}

// Hàm play bài trước (có thể mở rộng sau)
function playPrevious() {
    // Logic play previous song
    console.log('Play previous song');
}