// Navigation functionality
const Navigation = {
    currentPage: 'home',

    init: () => {
        Navigation.bindEvents();
        Navigation.showPage('home');
    },

    bindEvents: () => {
        // Desktop navigation
        document.querySelectorAll('.nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                Navigation.showPage(page);
            });
        });

        // Mobile navigation
        document.querySelectorAll('.mobile-nav-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                Navigation.showPage(page);
            });
        });

        // Header buttons
        const messagesBtn = document.getElementById('messagesBtn');
        if (messagesBtn) {
            messagesBtn.addEventListener('click', () => {
                Navigation.showPage('messages');
            });
        }

        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                Navigation.showPage('profile');
            });
        }

        // Logo click - go to home
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                Navigation.showPage('home');
            });
        }
    },

    showPage: (pageName) => {
        if (Navigation.currentPage === pageName) return;

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageName}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
            Animations.fadeIn(targetPage);
        }

        // Update navigation states
        Navigation.updateNavStates(pageName);
        
        // Update current page
        Navigation.currentPage = pageName;

        // Load page-specific content
        Navigation.loadPageContent(pageName);
    },

    updateNavStates: (activePage) => {
        // Desktop navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === activePage) {
                item.classList.add('active');
            }
        });

        // Mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === activePage) {
                item.classList.add('active');
            }
        });
    },

    loadPageContent: (pageName) => {
        switch (pageName) {
            case 'home':
                // Content already loaded in Posts.init()
                break;
            case 'profile':
                Navigation.loadProfileContent();
                break;
            case 'messages':
                Messages.init();
                break;
            case 'search':
                Navigation.loadSearchContent();
                break;
            case 'explore':
                Navigation.loadExploreContent();
                break;
            case 'notifications':
                Navigation.loadNotificationsContent();
                break;
        }
    },

    loadProfileContent: () => {
        // Update profile stats
        const statsElements = document.querySelectorAll('.stat-number');
        if (statsElements.length >= 3) {
            statsElements[0].textContent = AppData.currentUser.posts;
            statsElements[1].textContent = AppData.currentUser.followers.toLocaleString();
            statsElements[2].textContent = AppData.currentUser.following.toLocaleString();
        }
    },

    loadSearchContent: () => {
        // Placeholder for search functionality
        console.log('Loading search content...');
    },

    loadExploreContent: () => {
        // Placeholder for explore functionality
        console.log('Loading explore content...');
    },

    loadNotificationsContent: () => {
        // Placeholder for notifications functionality
        console.log('Loading notifications content...');
    }
};

// Messages functionality
const Messages = {
    currentChat: null,

    init: () => {
        Messages.renderMessagesList();
        Messages.bindEvents();
    },

    bindEvents: () => {
        // Message items are bound in Components.createMessageItem
    },

    renderMessagesList: () => {
        const messagesList = document.getElementById('messagesList');
        if (!messagesList) return;

        messagesList.innerHTML = '';
        
        AppData.messages.forEach(message => {
            const messageItem = Components.createMessageItem(message);
            messagesList.appendChild(messageItem);
        });
    },

    openChat: (messageId) => {
        const message = AppData.messages.find(m => m.id === messageId);
        if (!message) return;

        Messages.currentChat = message;
        
        // Update UI states
        document.querySelectorAll('.message-item').forEach(item => {
            item.classList.remove('active');
        });
        
        event.currentTarget.classList.add('active');
        
        // Mark as read
        message.unread = false;
        
        // Show chat area (placeholder for now)
        const chatArea = document.getElementById('chatArea');
        if (chatArea) {
            chatArea.innerHTML = `
                <div class="chat-header">
                    <div class="chat-user-info">
                        <img src="${message.avatar}" alt="${message.username}" style="width: 40px; height: 40px; border-radius: 50%;">
                        <div>
                            <h4>${message.username}</h4>
                            <span style="color: var(--ig-text-light); font-size: 12px;">Active now</span>
                        </div>
                    </div>
                </div>
                <div class="chat-messages" style="flex: 1; padding: 20px; overflow-y: auto;">
                    ${message.messages.map(msg => `
                        <div class="message ${msg.senderId === AppData.currentUser.id ? 'sent' : 'received'}" style="margin-bottom: 12px;">
                            <div style="max-width: 70%; padding: 8px 12px; border-radius: 18px; ${msg.senderId === AppData.currentUser.id ? 'background: var(--ig-blue); color: white; margin-left: auto;' : 'background: #f0f0f0;'}">
                                ${msg.text}
                            </div>
                            <div style="font-size: 11px; color: var(--ig-text-light); margin-top: 4px; ${msg.senderId === AppData.currentUser.id ? 'text-align: right;' : ''}">
                                ${Utils.formatMessageTime(msg.timestamp)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="chat-input" style="padding: 20px; border-top: 1px solid var(--ig-border);">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <input type="text" placeholder="Message..." style="flex: 1; padding: 8px 12px; border: 1px solid var(--ig-border); border-radius: 20px; outline: none;">
                        <button style="background: var(--ig-blue); color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">Send</button>
                    </div>
                </div>
            `;
        }
    }
};