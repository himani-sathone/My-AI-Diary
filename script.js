let selectedMood = '';
let entries = [];
let currentUser = null;

// Check if user is logged in
window.onload = function() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}! 👋`;
    loadEntries();
};

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Load entries from localStorage on page load
function loadEntries() {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
        entries = JSON.parse(saved);
        displayEntries();
    }
}

// Mood selection
const moodButtons = document.querySelectorAll('.mood-btn');
moodButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        moodButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedMood = this.dataset.mood;
    });
});

// AI responses based on mood
const aiResponses = {
    '😊 Happy': [
        "I'm so glad you're feeling happy! Your joy is contagious. Keep shining! ✨",
        "It's wonderful to see you in such good spirits! Cherish these beautiful moments. 💛",
        "Your happiness makes my day brighter too! Thank you for sharing this with me. 🌟"
    ],
    '😔 Sad': [
        "I hear you, and your feelings are completely valid. It's okay to feel sad sometimes. I'm here with you. 💙",
        "Thank you for trusting me with your feelings. Remember, this too shall pass. You're stronger than you know. 🌙",
        "Sadness is part of being human. Be gentle with yourself today. You deserve kindness. 💜"
    ],
    '😰 Anxious': [
        "I understand that anxiety can feel overwhelming. Take a deep breath with me. You're not alone in this. 🌊",
        "Your feelings are real and important. One moment at a time - you're doing better than you think. 💙",
        "Anxiety is tough, but you're tougher. I'm here, and we'll get through this together. 🌟"
    ],
    '😌 Calm': [
        "I love the peaceful energy you're radiating! These calm moments are precious. Enjoy them. 🍃",
        "It's beautiful when you find peace within. Hold onto this feeling. You deserve this tranquility. ☁️",
        "Your calm is inspiring. Thank you for sharing this serene moment with me. 🌸"
    ],
    '😤 Angry': [
        "I hear your frustration, and it's completely okay to feel angry. Your emotions are valid. 🔥",
        "Anger shows you care. Let it out here - this is your safe space. I'm listening. 💪",
        "Thank you for being honest about your anger. It takes courage to express difficult emotions. ❤️"
    ],
    '🤔 Thoughtful': [
        "I appreciate you sharing your thoughts with me. Your reflections are valuable. 🌙",
        "Deep thinking is a beautiful thing. I'm honored to be part of your contemplative journey. ✨",
        "Your thoughtfulness shows wisdom. Keep exploring your inner world. 💭"
    ],
    'default': [
        "Thank you for sharing this with me. I'm always here to listen. 💜",
        "Your words matter. I'm grateful you trust me with your thoughts. 🌟",
        "I hear you. Whatever you're feeling, it's valid and important. 💙"
    ]
};

function getAIResponse(mood) {
    const responses = aiResponses[mood] || aiResponses['default'];
    return responses[Math.floor(Math.random() * responses.length)];
}

function saveEntry() {
    const text = document.getElementById('diaryText').value.trim();
    
    if (!text) {
        alert('Please write something first!');
        return;
    }

    const entry = {
        id: Date.now(),
        text: text,
        mood: selectedMood || 'No mood selected',
        date: new Date().toLocaleString(),
        aiResponse: getAIResponse(selectedMood)
    };

    entries.unshift(entry);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));

    // Show AI response
    document.getElementById('aiMessage').textContent = entry.aiResponse;
    document.getElementById('aiResponse').classList.add('show');

    // Clear form
    document.getElementById('diaryText').value = '';
    moodButtons.forEach(b => b.classList.remove('active'));
    selectedMood = '';

    // Display updated entries
    displayEntries();

    // Hide AI response after 5 seconds
    setTimeout(() => {
        document.getElementById('aiResponse').classList.remove('show');
    }, 5000);
}

function displayEntries() {
    const list = document.getElementById('entriesList');
    
    if (entries.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <span>📔</span>
                <p>No entries yet. Start writing!</p>
            </div>
        `;
        return;
    }

    list.innerHTML = entries.map(entry => `
        <div class="entry-item">
            <div class="entry-header">
                <span class="entry-date">${entry.date}</span>
                <span class="entry-mood">${entry.mood}</span>
            </div>
            <div class="entry-text">${entry.text}</div>
            <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 8px; font-style: italic; color: #667eea; font-size: 0.9em;">
                💜 ${entry.aiResponse}
            </div>
            <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
        </div>
    `).join('');
}

function deleteEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        entries = entries.filter(e => e.id !== id);
        localStorage.setItem('diaryEntries', JSON.stringify(entries));
        displayEntries();
    }
}