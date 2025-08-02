// Application Data
const AppData = {
    currentUser: {
        id: '1',
        username: 'myusername',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Living my best life 📸✨',
        followers: 1250,
        following: 890,
        posts: 42
    },

    users: [
        {
            id: '2',
            username: 'photoartist',
            avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'Photography enthusiast 📷',
            followers: 2100,
            following: 345,
            posts: 128
        },
        {
            id: '3',
            username: 'traveler',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            bio: 'World explorer 🌍',
            followers: 890,
            following: 567,
            posts: 89
        }
    ],

    posts: [
        {
            id: '1',
            userId: '2',
            username: 'photoartist',
            avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
            media: [
                { type: 'image', url: 'https://images.pexels.com/photos/1308624/pexels-photo-1308624.jpeg?auto=compress&cs=tinysrgb&w=600' }
            ],
            caption: 'Beautiful sunset today 🌅 #nature #photography',
            likes: 124,
            comments: [
                {
                    id: '1',
                    userId: '1',
                    username: 'myusername',
                    text: 'Amazing shot! 😍',
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
                }
            ],
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isLiked: false
        },
        {
            id: '2',
            userId: '3',
            username: 'traveler',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            media: [
                { type: 'image', url: 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg?auto=compress&cs=tinysrgb&w=600' }
            ],
            caption: 'Adventure awaits! 🗻 #travel #mountains',
            likes: 89,
            comments: [],
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            isLiked: true
        }
    ],

    stories: [
        {
            id: '1',
            userId: '2',
            username: 'photoartist',
            avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
            media: [
                { type: 'image', url: 'https://images.pexels.com/photos/1308624/pexels-photo-1308624.jpeg?auto=compress&cs=tinysrgb&w=600' }
            ],
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            viewed: false
        },
        {
            id: '2',
            userId: '3',
            username: 'traveler',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            media: [
                { type: 'image', url: 'https://images.pexels.com/photos/1010973/pexels-photo-1010973.jpeg?auto=compress&cs=tinysrgb&w=600' }
            ],
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            viewed: true
        }
    ],

    messages: [
        {
            id: '1',
            userId: '2',
            username: 'photoartist',
            avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150',
            lastMessage: 'Hey! Love your latest post 📸',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            unread: true,
            messages: [
                {
                    id: '1',
                    senderId: '2',
                    text: 'Hey! Love your latest post 📸',
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
                },
                {
                    id: '2',
                    senderId: '1',
                    text: 'Thanks! Really appreciate it 😊',
                    timestamp: new Date(Date.now() - 50 * 60 * 1000)
                }
            ]
        },
        {
            id: '2',
            userId: '3',
            username: 'traveler',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            lastMessage: 'Where was this photo taken?',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            unread: false,
            messages: [
                {
                    id: '1',
                    senderId: '3',
                    text: 'Where was this photo taken?',
                    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
                }
            ]
        }
    ]
};

// Utility Functions
const Utils = {
    formatTimeAgo: (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 1) return 'now';
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    },

    formatMessageTime: (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    },

    generateId: () => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    createFileUrl: (file) => {
        return URL.createObjectURL(file);
    },

    isImage: (file) => {
        return file.type.startsWith('image/');
    },

    isVideo: (file) => {
        return file.type.startsWith('video/');
    }
};

// Event System
const EventBus = {
    events: {},

    on: (event, callback) => {
        if (!EventBus.events[event]) {
            EventBus.events[event] = [];
        }
        EventBus.events[event].push(callback);
    },

    emit: (event, data) => {
        if (EventBus.events[event]) {
            EventBus.events[event].forEach(callback => callback(data));
        }
    },

    off: (event, callback) => {
        if (EventBus.events[event]) {
            EventBus.events[event] = EventBus.events[event].filter(cb => cb !== callback);
        }
    }
};