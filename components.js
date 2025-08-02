// Component Creators
const Components = {
    createPostCard: (post) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-user-info">
                    <div class="post-avatar">
                        <img src="${post.avatar}" alt="${post.username}">
                    </div>
                    <div class="post-user-details">
                        <h4>${post.username}</h4>
                        <span>${Utils.formatTimeAgo(post.timestamp)}</span>
                    </div>
                </div>
                <button class="post-menu">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            
            <div class="post-media">
                ${post.media.length > 1 ? `<div class="media-counter">1/${post.media.length}</div>` : ''}
                ${post.media[0].type === 'image' 
                    ? `<img src="${post.media[0].url}" alt="Post media">`
                    : `<video src="${post.media[0].url}" controls></video>`
                }
                ${post.media.length > 1 ? `
                    <div class="media-indicators">
                        ${post.media.map((_, index) => `
                            <div class="media-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="post-actions">
                <div class="action-buttons">
                    <div class="action-left">
                        <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn comment-btn">
                            <i class="fas fa-comment"></i>
                        </button>
                        <button class="action-btn share-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <button class="action-btn save-btn">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
                
                <div class="likes-count">${post.likes} likes</div>
                
                <div class="post-caption">
                    <span class="username">${post.username}</span>
                    ${post.caption}
                </div>
                
                ${post.comments.length > 0 ? `
                    <div class="view-comments">View all ${post.comments.length} comments</div>
                ` : ''}
                
                <div class="post-time">${Utils.formatTimeAgo(post.timestamp)}</div>
                
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="Add a comment..." data-post-id="${post.id}">
                    <button class="comment-submit" data-post-id="${post.id}">Post</button>
                </div>
            </div>
        `;

        // Add event listeners
        Components.addPostEventListeners(postCard, post);
        
        return postCard;
    },

    addPostEventListeners: (postCard, post) => {
        // Like button
        const likeBtn = postCard.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
            Posts.toggleLike(post.id);
        });

        // Comment input
        const commentInput = postCard.querySelector('.comment-input');
        const commentSubmit = postCard.querySelector('.comment-submit');
        
        commentInput.addEventListener('input', (e) => {
            if (e.target.value.trim()) {
                commentSubmit.classList.add('visible');
            } else {
                commentSubmit.classList.remove('visible');
            }
        });

        commentSubmit.addEventListener('click', () => {
            const text = commentInput.value.trim();
            if (text) {
                Posts.addComment(post.id, text);
                commentInput.value = '';
                commentSubmit.classList.remove('visible');
            }
        });

        // Media navigation for multiple media
        if (post.media.length > 1) {
            const mediaDots = postCard.querySelectorAll('.media-dot');
            const mediaContainer = postCard.querySelector('.post-media');
            let currentIndex = 0;

            mediaDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    Components.updatePostMedia(mediaContainer, post.media, currentIndex);
                    Components.updateMediaDots(mediaDots, currentIndex);
                });
            });
        }
    },

    updatePostMedia: (container, media, index) => {
        const mediaElement = media[index].type === 'image' 
            ? `<img src="${media[index].url}" alt="Post media">`
            : `<video src="${media[index].url}" controls></video>`;
        
        const counter = container.querySelector('.media-counter');
        if (counter) {
            counter.textContent = `${index + 1}/${media.length}`;
        }

        // Replace media content
        const existingMedia = container.querySelector('img, video');
        if (existingMedia) {
            existingMedia.outerHTML = mediaElement;
        }
    },

    updateMediaDots: (dots, activeIndex) => {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    },

    createProfilePostItem: (post) => {
        const postItem = document.createElement('div');
        postItem.className = 'profile-post-item';
        postItem.innerHTML = `
            <img src="${post.media[0].url}" alt="Post">
            <div class="profile-post-overlay">
                <div class="overlay-stat">
                    <i class="fas fa-heart"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="overlay-stat">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments.length}</span>
                </div>
            </div>
        `;
        return postItem;
    },

    createMessageItem: (message) => {
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item';
        messageItem.innerHTML = `
            <div class="message-avatar">
                <img src="${message.avatar}" alt="${message.username}">
                ${message.unread ? '<div class="message-unread"></div>' : ''}
            </div>
            <div class="message-info">
                <div class="message-username">${message.username}</div>
                <div class="message-preview">${message.lastMessage}</div>
            </div>
            <div class="message-time">${Utils.formatTimeAgo(message.timestamp)}</div>
        `;

        messageItem.addEventListener('click', () => {
            Messages.openChat(message.id);
        });

        return messageItem;
    },

    createPreviewItem: (file, url) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        if (Utils.isImage(file)) {
            previewItem.innerHTML = `<img src="${url}" alt="Preview">`;
        } else if (Utils.isVideo(file)) {
            previewItem.innerHTML = `<video src="${url}" controls></video>`;
        }
        
        return previewItem;
    }
};

// Animation helpers
const Animations = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    },

    scaleIn: (element, duration = 200) => {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    },

    pulse: (element) => {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 600);
    }
};