// Posts functionality
const Posts = {
    init: () => {
        Posts.renderPosts();
        Posts.renderProfilePosts();
    },

    renderPosts: () => {
        const postsFeed = document.getElementById('postsFeed');
        if (!postsFeed) return;

        postsFeed.innerHTML = '';
        
        AppData.posts.forEach(post => {
            const postCard = Components.createPostCard(post);
            postsFeed.appendChild(postCard);
            Animations.fadeIn(postCard);
        });
    },

    renderProfilePosts: () => {
        const profilePostsGrid = document.getElementById('profilePostsGrid');
        if (!profilePostsGrid) return;

        profilePostsGrid.innerHTML = '';
        
        // Filter posts by current user
        const userPosts = AppData.posts.filter(post => post.userId === AppData.currentUser.id);
        
        if (userPosts.length === 0) {
            profilePostsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-camera" style="font-size: 48px; color: var(--ig-text-light); margin-bottom: 16px;"></i>
                    <h3 style="font-size: 20px; font-weight: 300; color: var(--ig-black); margin-bottom: 8px;">No Posts Yet</h3>
                    <p style="color: var(--ig-text-light);">When you share photos and videos, they will appear on your profile.</p>
                </div>
            `;
            return;
        }

        userPosts.forEach(post => {
            const postItem = Components.createProfilePostItem(post);
            profilePostsGrid.appendChild(postItem);
        });
    },

    toggleLike: (postId) => {
        const post = AppData.posts.find(p => p.id === postId);
        if (!post) return;

        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;

        // Update UI
        const likeBtn = document.querySelector(`[data-post-id="${postId}"].like-btn`);
        const likesCount = likeBtn.closest('.post-actions').querySelector('.likes-count');
        
        likeBtn.classList.toggle('liked', post.isLiked);
        likesCount.textContent = `${post.likes} likes`;

        // Add pulse animation
        Animations.pulse(likeBtn);
    },

    addComment: (postId, text) => {
        const post = AppData.posts.find(p => p.id === postId);
        if (!post) return;

        const newComment = {
            id: Utils.generateId(),
            userId: AppData.currentUser.id,
            username: AppData.currentUser.username,
            text: text,
            timestamp: new Date()
        };

        post.comments.push(newComment);

        // Update UI - for now just show a notification
        // In a full implementation, you'd update the comments section
        Posts.showNotification('Comment added!');
    },

    addPost: (mediaFiles, caption) => {
        const media = Array.from(mediaFiles).map(file => ({
            type: Utils.isImage(file) ? 'image' : 'video',
            url: Utils.createFileUrl(file)
        }));

        const newPost = {
            id: Utils.generateId(),
            userId: AppData.currentUser.id,
            username: AppData.currentUser.username,
            avatar: AppData.currentUser.avatar,
            media: media,
            caption: caption,
            likes: 0,
            comments: [],
            timestamp: new Date(),
            isLiked: false
        };

        AppData.posts.unshift(newPost);
        AppData.currentUser.posts++;
        
        Posts.renderPosts();
        Posts.renderProfilePosts();
        
        // Show success message
        Posts.showNotification('Post shared successfully!');
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

// Create Post Modal
const CreateModal = {
    currentStep: 'select',
    selectedFiles: null,
    isStory: false,

    init: () => {
        CreateModal.bindEvents();
    },

    bindEvents: () => {
        // Modal triggers
        const createBtns = [
            document.getElementById('createBtn'),
            document.getElementById('createNavBtn'),
            document.getElementById('mobileCreateBtn')
        ];

        createBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => CreateModal.open());
            }
        });

        // Modal close
        const closeBtn = document.getElementById('closeCreateModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', CreateModal.close);
        }

        // Modal backdrop click
        const modal = document.getElementById('createModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    CreateModal.close();
                }
            });
        }

        // Create options
        const createPostBtn = document.getElementById('createPostBtn');
        const createStoryBtn = document.getElementById('createStoryBtn');

        if (createPostBtn) {
            createPostBtn.addEventListener('click', () => {
                CreateModal.isStory = false;
                CreateModal.showStep('upload');
            });
        }

        if (createStoryBtn) {
            createStoryBtn.addEventListener('click', () => {
                CreateModal.isStory = true;
                CreateModal.showStep('upload');
            });
        }

        // File selection
        const selectFilesBtn = document.getElementById('selectFilesBtn');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');

        if (selectFilesBtn && fileInput) {
            selectFilesBtn.addEventListener('click', () => fileInput.click());
        }

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', CreateModal.handleFileSelect);
        }

        // Form actions
        const backBtn = document.getElementById('backBtn');
        const shareBtn = document.getElementById('shareBtn');

        if (backBtn) {
            backBtn.addEventListener('click', () => CreateModal.showStep('upload'));
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', CreateModal.handleShare);
        }

        // Drag and drop
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ig-blue)';
                uploadArea.style.background = '#f8f9ff';
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ig-border)';
                uploadArea.style.background = '';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--ig-border)';
                uploadArea.style.background = '';
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    fileInput.files = files;
                    CreateModal.handleFileSelect({ target: { files } });
                }
            });
        }
    },

    open: (type = 'post') => {
        CreateModal.isStory = type === 'story';
        CreateModal.showStep('select');
        
        const modal = document.getElementById('createModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close: () => {
        const modal = document.getElementById('createModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        CreateModal.reset();
    },

    reset: () => {
        CreateModal.currentStep = 'select';
        CreateModal.selectedFiles = null;
        CreateModal.isStory = false;
        
        // Reset form
        const captionInput = document.getElementById('captionInput');
        if (captionInput) {
            captionInput.value = '';
        }
        
        // Clear previews
        const previewContainer = document.getElementById('previewContainer');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
        
        const mediaPreview = document.getElementById('mediaPreview');
        if (mediaPreview) {
            mediaPreview.innerHTML = '';
        }
    },

    showStep: (step) => {
        CreateModal.currentStep = step;
        
        // Hide all steps
        document.querySelectorAll('.create-step').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Show current step
        const currentStepEl = document.getElementById(`${step}Step`);
        if (currentStepEl) {
            currentStepEl.classList.remove('hidden');
        }
        
        // Update modal title
        const modalTitle = document.querySelector('.modal-header h3');
        if (modalTitle) {
            switch (step) {
                case 'select':
                    modalTitle.textContent = 'Create new post';
                    break;
                case 'upload':
                    modalTitle.textContent = CreateModal.isStory ? 'Add to your story' : 'Select photos and videos';
                    break;
                case 'details':
                    modalTitle.textContent = CreateModal.isStory ? 'Share to story' : 'Create new post';
                    break;
            }
        }
    },

    handleFileSelect: (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        CreateModal.selectedFiles = files;
        
        // Show preview
        CreateModal.showPreview(files);
        CreateModal.showStep('details');
    },

    showPreview: (files) => {
        const previewContainer = document.getElementById('previewContainer');
        const mediaPreview = document.getElementById('mediaPreview');
        
        if (previewContainer) {
            previewContainer.innerHTML = '';
            Array.from(files).forEach(file => {
                const url = Utils.createFileUrl(file);
                const previewItem = Components.createPreviewItem(file, url);
                previewContainer.appendChild(previewItem);
            });
        }
        
        if (mediaPreview && files.length > 0) {
            const firstFile = files[0];
            const url = Utils.createFileUrl(firstFile);
            const previewItem = Components.createPreviewItem(firstFile, url);
            mediaPreview.innerHTML = '';
            mediaPreview.appendChild(previewItem);
        }
    },

    handleShare: () => {
        if (!CreateModal.selectedFiles) return;
        
        if (CreateModal.isStory) {
            Stories.addStory(CreateModal.selectedFiles);
        } else {
            const caption = document.getElementById('captionInput').value;
            Posts.addPost(CreateModal.selectedFiles, caption);
        }
        
        CreateModal.close();
    }
};