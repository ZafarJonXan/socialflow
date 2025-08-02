// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    Stories.init();
    Posts.init();
    CreateModal.init();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize responsive behavior
    initializeResponsive();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    console.log('Instagram Clone initialized successfully!');
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            showSearchResults();
        }
    });
    
    searchInput.addEventListener('blur', () => {
        // Delay hiding to allow clicking on results
        setTimeout(hideSearchResults, 200);
    });
}

function performSearch(query) {
    // Search through users and posts
    const users = AppData.users.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase())
    );
    
    const posts = AppData.posts.filter(post => 
        post.caption.toLowerCase().includes(query.toLowerCase()) ||
        post.username.toLowerCase().includes(query.toLowerCase())
    );
    
    displaySearchResults(users, posts);
}

function displaySearchResults(users, posts) {
    let searchResults = document.getElementById('searchResults');
    
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.id = 'searchResults';
        searchResults.className = 'search-results';
        searchResults.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--ig-white);
            border: 1px solid var(--ig-border);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1001;
        `;
        
        const searchBar = document.querySelector('.search-bar');
        searchBar.style.position = 'relative';
        searchBar.appendChild(searchResults);
    }
    
    let resultsHTML = '';
    
    if (users.length > 0) {
        resultsHTML += '<div style="padding: 8px 16px; font-weight: 600; color: var(--ig-text-light); font-size: 12px; text-transform: uppercase;">Users</div>';
        users.forEach(user => {
            resultsHTML += `
                <div class="search-result-item" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.3s ease;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background=''">
                    <img src="${user.avatar}" alt="${user.username}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">${user.username}</div>
                        <div style="color: var(--ig-text-light); font-size: 12px;">${user.bio}</div>
                    </div>
                </div>
            `;
        });
    }
    
    if (posts.length > 0) {
        resultsHTML += '<div style="padding: 8px 16px; font-weight: 600; color: var(--ig-text-light); font-size: 12px; text-transform: uppercase;">Posts</div>';
        posts.forEach(post => {
            resultsHTML += `
                <div class="search-result-item" style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; transition: background 0.3s ease;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background=''">
                    <img src="${post.media[0].url}" alt="Post" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 600; font-size: 14px;">${post.username}</div>
                        <div style="color: var(--ig-text-light); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${post.caption}</div>
                    </div>
                </div>
            `;
        });
    }
    
    if (users.length === 0 && posts.length === 0) {
        resultsHTML = '<div style="padding: 20px; text-align: center; color: var(--ig-text-light);">No results found</div>';
    }
    
    searchResults.innerHTML = resultsHTML;
    searchResults.style.display = 'block';
}

function showSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'block';
    }
}

function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Responsive behavior
function initializeResponsive() {
    // Handle window resize
    window.addEventListener('resize', () => {
        handleResponsiveLayout();
    });
    
    // Initial layout
    handleResponsiveLayout();
}

function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // Adjust content area margins
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        if (isMobile) {
            contentArea.style.marginLeft = '0';
            contentArea.style.maxWidth = 'none';
        } else if (isTablet) {
            contentArea.style.marginLeft = '200px';
            contentArea.style.maxWidth = '600px';
        } else {
            contentArea.style.marginLeft = 'auto';
            contentArea.style.marginRight = 'auto';
            contentArea.style.maxWidth = '600px';
        }
    }
    
    // Handle stories scroll on mobile
    if (isMobile) {
        const storiesContainer = document.querySelector('.stories-container');
        if (storiesContainer) {
            storiesContainer.style.margin = '0 -16px 24px -16px';
            storiesContainer.style.borderRadius = '0';
            storiesContainer.style.borderLeft = 'none';
            storiesContainer.style.borderRight = 'none';
        }
    }
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'h':
                Navigation.showPage('home');
                break;
            case 'p':
                Navigation.showPage('profile');
                break;
            case 'm':
                Navigation.showPage('messages');
                break;
            case 'n':
                CreateModal.open();
                break;
            case '/':
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
                break;
        }
    });
}

// Utility functions for global use
window.InstagramClone = {
    // Expose useful functions globally
    showPage: Navigation.showPage,
    openCreateModal: CreateModal.open,
    openStory: Stories.openStory,
    
    // Data access
    getCurrentUser: () => AppData.currentUser,
    getPosts: () => AppData.posts,
    getStories: () => AppData.stories,
    
    // Event system
    on: EventBus.on,
    emit: EventBus.emit,
    off: EventBus.off
};

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle online/offline status
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    showConnectionStatus('Back online', 'success');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    showConnectionStatus('You are offline', 'warning');
});

function showConnectionStatus(message, type) {
    const notification = document.createElement('div');
    notification.className = `connection-status ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#4caf50' : '#ff9800'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
    });
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}