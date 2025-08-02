// Stories functionality
const Stories = {
    currentStory: null,
    currentMediaIndex: 0,
    progressInterval: null,
    storyDuration: 5000, // 5 seconds per story

    init: () => {
        Stories.bindEvents();
    },

    bindEvents: () => {
        // Story items click
        document.addEventListener('click', (e) => {
            const storyItem = e.target.closest('.story-item[data-story-id]');
            if (storyItem) {
                const storyId = storyItem.dataset.storyId;
                Stories.openStory(storyId);
            }
        });

        // Add story button
        const addStoryBtn = document.getElementById('addStoryBtn');
        if (addStoryBtn) {
            addStoryBtn.addEventListener('click', () => {
                CreateModal.open('story');
            });
        }

        // Story viewer controls
        const storyViewer = document.getElementById('storyViewer');
        const closeBtn = document.getElementById('closeStoryViewer');
        const navLeft = document.getElementById('storyNavLeft');
        const navRight = document.getElementById('storyNavRight');

        if (closeBtn) {
            closeBtn.addEventListener('click', Stories.closeStory);
        }

        if (navLeft) {
            navLeft.addEventListener('click', Stories.previousMedia);
        }

        if (navRight) {
            navRight.addEventListener('click', Stories.nextMedia);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (Stories.currentStory) {
                switch (e.key) {
                    case 'Escape':
                        Stories.closeStory();
                        break;
                    case 'ArrowLeft':
                        Stories.previousMedia();
                        break;
                    case 'ArrowRight':
                        Stories.nextMedia();
                        break;
                }
            }
        });

        // Touch/click to navigate
        if (storyViewer) {
            let touchStartX = 0;
            let touchEndX = 0;

            storyViewer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });

            storyViewer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                Stories.handleSwipe();
            });

            const handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        Stories.nextMedia();
                    } else {
                        Stories.previousMedia();
                    }
                }
            };

            Stories.handleSwipe = handleSwipe;
        }
    },

    openStory: (storyId) => {
        const story = AppData.stories.find(s => s.id === storyId);
        if (!story) return;

        Stories.currentStory = story;
        Stories.currentMediaIndex = 0;
        
        // Mark as viewed
        story.viewed = true;
        Stories.updateStoryItem(storyId);

        // Show story viewer
        const storyViewer = document.getElementById('storyViewer');
        const storyUserAvatar = document.getElementById('storyUserAvatar');
        const storyUsername = document.getElementById('storyUsername');
        const storyTime = document.getElementById('storyTime');

        storyUserAvatar.src = story.avatar;
        storyUserAvatar.alt = story.username;
        storyUsername.textContent = story.username;
        storyTime.textContent = Utils.formatTimeAgo(story.timestamp);

        storyViewer.classList.add('active');
        document.body.style.overflow = 'hidden';

        Stories.showMedia(0);
        Stories.startProgress();
    },

    closeStory: () => {
        const storyViewer = document.getElementById('storyViewer');
        storyViewer.classList.remove('active');
        document.body.style.overflow = '';

        Stories.stopProgress();
        Stories.currentStory = null;
        Stories.currentMediaIndex = 0;
    },

    showMedia: (index) => {
        if (!Stories.currentStory || index >= Stories.currentStory.media.length) {
            Stories.closeStory();
            return;
        }

        const media = Stories.currentStory.media[index];
        const storyMedia = document.getElementById('storyMedia');

        if (media.type === 'image') {
            storyMedia.innerHTML = `<img src="${media.url}" alt="Story">`;
        } else {
            storyMedia.innerHTML = `<video src="${media.url}" autoplay muted></video>`;
        }

        Stories.currentMediaIndex = index;
        Stories.resetProgress();
    },

    nextMedia: () => {
        if (Stories.currentMediaIndex < Stories.currentStory.media.length - 1) {
            Stories.showMedia(Stories.currentMediaIndex + 1);
        } else {
            Stories.closeStory();
        }
    },

    previousMedia: () => {
        if (Stories.currentMediaIndex > 0) {
            Stories.showMedia(Stories.currentMediaIndex - 1);
        }
    },

    startProgress: () => {
        Stories.stopProgress();
        
        const progressBar = document.getElementById('storyProgress');
        let progress = 0;
        const increment = 100 / (Stories.storyDuration / 50);

        Stories.progressInterval = setInterval(() => {
            progress += increment;
            progressBar.style.width = `${Math.min(progress, 100)}%`;

            if (progress >= 100) {
                Stories.nextMedia();
            }
        }, 50);
    },

    stopProgress: () => {
        if (Stories.progressInterval) {
            clearInterval(Stories.progressInterval);
            Stories.progressInterval = null;
        }
    },

    resetProgress: () => {
        const progressBar = document.getElementById('storyProgress');
        progressBar.style.width = '0%';
        Stories.startProgress();
    },

    updateStoryItem: (storyId) => {
        const storyItem = document.querySelector(`[data-story-id="${storyId}"]`);
        if (storyItem) {
            const avatar = storyItem.querySelector('.story-avatar');
            avatar.classList.remove('story-unviewed');
            avatar.classList.add('story-viewed');
        }
    },

    addStory: (mediaFiles) => {
        const media = Array.from(mediaFiles).map(file => ({
            type: Utils.isImage(file) ? 'image' : 'video',
            url: Utils.createFileUrl(file)
        }));

        const newStory = {
            id: Utils.generateId(),
            userId: AppData.currentUser.id,
            username: AppData.currentUser.username,
            avatar: AppData.currentUser.avatar,
            media: media,
            timestamp: new Date(),
            viewed: false
        };

        AppData.stories.unshift(newStory);
        Stories.renderStories();
        
        // Show success message
        Stories.showNotification('Story added successfully!');
    },

    renderStories: () => {
        const storiesScroll = document.querySelector('.stories-scroll');
        if (!storiesScroll) return;

        // Keep the add story button and re-render other stories
        const addStoryBtn = storiesScroll.querySelector('.add-story');
        storiesScroll.innerHTML = '';
        
        if (addStoryBtn) {
            storiesScroll.appendChild(addStoryBtn);
        }

        AppData.stories.forEach(story => {
            const storyItem = document.createElement('div');
            storyItem.className = 'story-item';
            storyItem.dataset.storyId = story.id;
            storyItem.innerHTML = `
                <div class="story-avatar ${story.viewed ? 'story-viewed' : 'story-unviewed'}">
                    <img src="${story.avatar}" alt="${story.username}">
                </div>
                <span class="story-username">${story.username}</span>
            `;
            storiesScroll.appendChild(storyItem);
        });
    },

    showNotification: (message) => {
        // Create and show a temporary notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--ig-black);
            color: var(--ig-white);
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 3000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};