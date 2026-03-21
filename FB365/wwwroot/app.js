// ============================================================================
// SWAGATH CUSTOMER FEEDBACK APPLICATION
// Main Application Logic
// ============================================================================

// Configuration
const CONFIG = {
    ADMIN_USERNAME: 'supreme',
    ADMIN_PASSWORD: 'lakshmi',
    CONTACT_EMAIL: 'contact@swagathhomefoods.com',
    LOCAL_STORAGE_KEYS: {
        FEEDBACK: 'swagath_feedback',
        ADMIN_LOGIN: 'swagath_admin_login',
        ADMIN_LOGIN_TIME: 'swagath_admin_login_time',
        EMAIL_SETTINGS: 'swagath_email_settings'
    },
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_PHOTOS: 5,
    MAX_COMMENT_LENGTH: 500
};

// Category Data Structure
const CATEGORIES = {
    'Fruits & Vegetables': [
        'Fresh Fruits',
        'Leafy Greens',
        'Root Vegetables',
        'Seasonal Produce'
    ],
    'Beverages': [
        'Software Drinks',
        'Lassi',
        'Beverages Masala',
        'Juices',
        'Teas'
    ],
    'Pantry': [
        'Oils & Spices',
        'Grains',
        'Canned Items',
        'Condiments',
        'Sauces'
    ],
    'Flours': [
        'Wheat Flour',
        'Gram Flour',
        'Rice Flour',
        'Millet Flour',
        'Specialty Flours'
    ],
    'Meal Kits': [
        'Sambar Mix',
        'Rasam Mix',
        'Curry Mixes',
        'Dal Mixes'
    ],
    'Dairy & Eggs': [
        'Milk',
        'Yogurt',
        'Cheese',
        'Eggs',
        'Paneer'
    ],
    'Frozen': [
        'Frozen Vegetables',
        'Frozen Prepared Foods',
        'Ice Cream',
        'Frozen Breads'
    ],
    'Rice & Noodles': [
        'Basmati Rice',
        'White Rice',
        'Brown Rice',
        'Noodles',
        'Pasta'
    ],
    'Pulses': [
        'Lentils',
        'Chickpeas',
        'Kidney Beans',
        'Split Peas'
    ],
    'Health & Beauty': [
        'Skincare',
        'Hair Care',
        'Supplements',
        'Ayurvedic Products'
    ],
    'Household': [
        'Cleaning Supplies',
        'Paper Products',
        'Storage Items',
        'Utensils'
    ],
    'Pooja Items': [
        'Incense',
        'Oil Lamps',
        'Flowers & Leaves',
        'Religious Items'
    ],
    'Dals': [
        'Toor Dal',
        'Urad Dal',
        'Moong Dal',
        'Masoor Dal',
        'Mixed Dals'
    ],
    'Snacks': [
        'Savory Snacks',
        'Namkeen',
        'Chikhalwali',
        'Chips & Crisps'
    ],
    'Festival': [
        'Diwali Items',
        'Holi Colors',
        'Festival Decorations',
        'Special Sweets'
    ],
    'Homestyle Food': [
        'Ready to Cook',
        'Prepared Dishes',
        'Traditional Foods',
        'Sweets'
    ]
};

// ============================================================================
// APPLICATION STATE
// ============================================================================
const AppState = {
    isAdminLoggedIn: false,
    currentFilter: {
        startDate: null,
        endDate: null
    },
    photos: [],
    allFeedback: [],

    async init() {
        this.loadAdminSession();
        await this.loadFeedback();
    },

    loadAdminSession() {
        const loginTime = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN_TIME);
        if (loginTime) {
            const elapsed = Date.now() - parseInt(loginTime);
            if (elapsed < CONFIG.SESSION_TIMEOUT) {
                this.isAdminLoggedIn = true;
            } else {
                this.logoutAdmin();
            }
        }
    },

    setAdminLogin() {
        this.isAdminLoggedIn = true;
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN, 'true');
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN_TIME, Date.now().toString());
    },

    logoutAdmin() {
        this.isAdminLoggedIn = false;
        localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN);
        localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEYS.ADMIN_LOGIN_TIME);
    },

    async loadFeedback() {
        try {
            const response = await fetch('/api/feedback');
            if (response.ok) {
                this.allFeedback = await response.json();
            }
        } catch (error) {
            console.error('Failed to load feedback:', error);
            this.allFeedback = [];
        }
    },

    async addFeedback(formData) {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            body: formData
        });
        const text = await response.text();
        if (!response.ok) {
            let message = 'Failed to submit feedback';
            try {
                const err = JSON.parse(text);
                message = err.error || err.title || message;
            } catch { }
            throw new Error(message);
        }
        const feedback = JSON.parse(text);
        this.allFeedback.unshift(feedback);
        return feedback;
    },

    async getFilteredFeedback() {
        const params = new URLSearchParams();
        if (this.currentFilter.startDate) params.set('startDate', this.currentFilter.startDate);
        if (this.currentFilter.endDate) params.set('endDate', this.currentFilter.endDate);

        try {
            const response = await fetch('/api/feedback?' + params.toString());
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to filter feedback:', error);
        }
        return [];
    }
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================
let Elements = {};

function initializeDOM() {
    Elements = {
        app: document.getElementById('app'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        adminTabBtn: document.getElementById('admin-tab-btn'),
        dashboardTabBtn: document.getElementById('dashboard-tab-btn'),
        qrTabBtn: document.getElementById('qr-tab-btn'),
        settingsTabBtn: document.getElementById('settings-tab-btn'),
        userIndicator: document.getElementById('user-indicator'),
        logoutBtn: document.getElementById('logout-btn'),
        categorySelect: document.getElementById('category'),
        subcategorySelect: document.getElementById('subcategory'),
        productNameInput: document.getElementById('product-name'),
        commentInput: document.getElementById('comment'),
        charCount: document.getElementById('char-count'),
        charCounter: document.querySelector('.char-counter'),
        photoInput: document.getElementById('photo-input'),
        uploadBtn: document.getElementById('upload-btn'),
        photoPreview: document.getElementById('photo-preview'),
        feedbackForm: document.getElementById('feedback-form-element'),
        successMessage: document.getElementById('success-message'),
        submitAnotherBtn: document.getElementById('submit-another-btn'),
        loginForm: document.getElementById('login-form'),
        loginHeaderBtn: document.getElementById('login-header-btn'),
        loginModal: document.getElementById('login-modal'),
        loginModalCloseBtn: document.getElementById('login-modal-close-btn'),
        adminUsernameInput: document.getElementById('admin-username'),
        adminPasswordInput: document.getElementById('admin-password'),
        adminDashboard: document.getElementById('admin-dashboard'),
        filterStartDate: document.getElementById('filter-start-date'),
        filterEndDate: document.getElementById('filter-end-date'),
        applyFilterBtn: document.getElementById('apply-filter-btn'),
        clearFilterBtn: document.getElementById('clear-filter-btn'),
        exportBtn: document.getElementById('export-btn'),
        feedbackList: document.getElementById('feedback-list'),
        feedbackCount: document.getElementById('feedback-count'),
        qrCodeSection: document.getElementById('qr-code-section'),
        qrCanvas: document.getElementById('qr-canvas'),
        downloadQrBtn: document.getElementById('download-qr-btn'),
        copyUrlBtn: document.getElementById('copy-url-btn'),
        feedbackUrl: document.getElementById('feedback-url'),
        settingsSection: document.getElementById('settings-section'),
        settingsForm: document.getElementById('settings-form'),
        emailNotificationsToggle: document.getElementById('email-notifications-toggle'),
        emailInputSection: document.getElementById('email-input-section'),
        notificationEmailInput: document.getElementById('notification-email'),
        photoModal: document.getElementById('photo-modal'),
        photoModalImage: document.getElementById('photo-modal-image'),
        modalCloseBtn: document.getElementById('modal-close-btn')
    };
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Initializing app...');
    initializeDOM();
    console.log('DOM Elements initialized:', Elements);
    console.log('Admin tab button:', Elements.adminTabBtn);
    await AppState.init();
    initializeCategories();
    setupEventListeners();
    updateUIBasedOnAuth();
    setFeedbackUrl();
    console.log('App initialization complete!');
});

function initializeCategories() {
    // Populate main categories
    Object.keys(CATEGORIES).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        Elements.categorySelect.appendChild(option);
    });

    // Set initial subcategories
    updateSubcategories();
}

function updateSubcategories() {
    const selectedCategory = Elements.categorySelect.value;
    Elements.subcategorySelect.innerHTML = '<option value="">Select a subcategory...</option>';

    if (selectedCategory && CATEGORIES[selectedCategory]) {
        CATEGORIES[selectedCategory].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            Elements.subcategorySelect.appendChild(option);
        });
    }
}

function setupEventListeners() {
    // Tab Navigation
    Elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });

    // Form Events
    Elements.categorySelect.addEventListener('change', updateSubcategories);
    Elements.commentInput.addEventListener('input', updateCharCounter);
    Elements.uploadBtn.addEventListener('click', triggerFileInput);
    Elements.photoInput.addEventListener('change', handlePhotoSelection);
    Elements.feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    Elements.feedbackForm.addEventListener('reset', resetFormState);

    // Success Message
    Elements.submitAnotherBtn.addEventListener('click', handleSubmitAnother);

    // Login
    Elements.loginForm.addEventListener('submit', handleLogin);
    Elements.logoutBtn.addEventListener('click', handleLogout);
    Elements.loginHeaderBtn.addEventListener('click', openLoginModal);
    Elements.loginModalCloseBtn.addEventListener('click', closeLoginModal);
    Elements.loginModal.addEventListener('click', closeLoginModalOnBackdrop);

    // Filtering
    Elements.applyFilterBtn.addEventListener('click', applyFilters);
    Elements.clearFilterBtn.addEventListener('click', clearFilters);
    Elements.exportBtn.addEventListener('click', exportToExcel);

    // QR Code
    Elements.downloadQrBtn.addEventListener('click', downloadQRCode);
    Elements.copyUrlBtn.addEventListener('click', copyFeedbackUrl);

    // Settings
    Elements.emailNotificationsToggle.addEventListener('change', toggleEmailInput);
    Elements.settingsForm.addEventListener('submit', handleSettingsSave);

    // Photo Modal
    Elements.photoModal.addEventListener('click', closePhotoModal);
    Elements.modalCloseBtn.addEventListener('click', closePhotoModal);
}

function updateUIBasedOnAuth() {
    if (AppState.isAdminLoggedIn) {
        // Show admin features
        Elements.userIndicator.style.display = 'inline-flex';
        Elements.logoutBtn.style.display = 'inline-flex';
        Elements.loginHeaderBtn.style.display = 'none';
        Elements.dashboardTabBtn.style.display = 'inline-block';
        Elements.qrTabBtn.style.display = 'inline-block';
        Elements.settingsTabBtn.style.display = 'inline-block';
        
        loadAdminSettings();
        generateQRCode();
    } else {
        // Hide admin features
        Elements.userIndicator.style.display = 'none';
        Elements.logoutBtn.style.display = 'none';
        Elements.loginHeaderBtn.style.display = 'inline-block';
        Elements.dashboardTabBtn.style.display = 'none';
        Elements.qrTabBtn.style.display = 'none';
        Elements.settingsTabBtn.style.display = 'none';
    }
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================
function handleTabClick(e) {
    const tabName = e.currentTarget.dataset.tab;

    // Update active tab button
    Elements.tabBtns.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // Update displayed content
    Elements.tabContents.forEach(content => content.classList.remove('active'));

    const activeTab = document.getElementById(tabName);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Handle admin tabs
    if (AppState.isAdminLoggedIn) {
        if (tabName === 'admin-dashboard') {
            displayAdminDashboard();
        } else if (tabName === 'qr-code-section') {
            generateQRCode();
        }
    }
}

// ============================================================================
// FORM HANDLING
// ============================================================================
function updateCharCounter() {
    const count = Elements.commentInput.value.length;
    Elements.charCount.textContent = count;

    // Update counter styling
    if (count >= 500) {
        Elements.charCounter.classList.add('danger');
        Elements.charCounter.classList.remove('warning');
    } else if (count >= 450) {
        Elements.charCounter.classList.add('warning');
        Elements.charCounter.classList.remove('danger');
    } else {
        Elements.charCounter.classList.remove('warning', 'danger');
    }
}

function triggerFileInput() {
    Elements.photoInput.click();
}

function handlePhotoSelection(e) {
    const files = Array.from(e.target.files);
    const remainingSlots = CONFIG.MAX_PHOTOS - AppState.photos.length;

    if (files.length > remainingSlots) {
        showError('photo-error', `You can only upload ${CONFIG.MAX_PHOTOS} photos total. ${remainingSlots} slots remaining.`);
        return;
    }

    clearError('photo-error');

    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            AppState.photos.push({
                file: file,
                data: previewUrl,
                name: file.name
            });
            renderPhotoPreviews();
        }
    });

    // Reset file input
    Elements.photoInput.value = '';
}

function renderPhotoPreviews() {
    Elements.photoPreview.innerHTML = '';

    AppState.photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.data}" alt="Photo ${index + 1}">
            <button type="button" class="photo-remove" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        `;

        photoItem.querySelector('img').addEventListener('click', () => showPhotoModal(photo.data));
        photoItem.querySelector('.photo-remove').addEventListener('click', (e) => {
            e.preventDefault();
            removePhoto(index);
        });

        Elements.photoPreview.appendChild(photoItem);
    });

    // Update remaining slots indicator
    const remaining = CONFIG.MAX_PHOTOS - AppState.photos.length;
    if (remaining < CONFIG.MAX_PHOTOS) {
        const uploadBtn = Elements.uploadBtn;
        if (remaining === 0) {
            uploadBtn.textContent = '📸 Max Photos Reached';
            uploadBtn.disabled = true;
        } else {
            uploadBtn.textContent = `📸 Add Photos (${remaining} remaining)`;
            uploadBtn.disabled = false;
        }
    }
}

function removePhoto(index) {
    AppState.photos.splice(index, 1);
    renderPhotoPreviews();
}

function showPhotoModal(photoData) {
    Elements.photoModalImage.src = photoData;
    Elements.photoModal.style.display = 'flex';
}

function closePhotoModal(e) {
    if (e.target === Elements.photoModal || e.target === Elements.modalCloseBtn) {
        Elements.photoModal.style.display = 'none';
    }
}

async function handleFeedbackSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateFeedbackForm()) {
        return;
    }

    // Build FormData for multipart upload
    const formData = new FormData();
    formData.append('category', Elements.categorySelect.value);
    formData.append('subcategory', Elements.subcategorySelect.value);
    formData.append('productName', Elements.productNameInput.value);
    formData.append('comment', Elements.commentInput.value);

    // Append photo files
    for (const photo of AppState.photos) {
        if (photo.file) {
            formData.append('photos', photo.file);
        }
    }

    try {
        const feedback = await AppState.addFeedback(formData);

        // Send email notification if enabled
        const settings = getEmailSettings();
        if (settings.enabled && settings.email) {
            await sendEmailNotification(feedback, settings.email);
        }

        // Show success message
        showSuccessMessage();
        resetFormState();
    } catch (error) {
        alert('Failed to submit feedback: ' + error.message);
    }
}

function validateFeedbackForm() {
    const errors = {
        category: !Elements.categorySelect.value,
        subcategory: !Elements.subcategorySelect.value,
        'product-name': !Elements.productNameInput.value.trim(),
        comment: !Elements.commentInput.value.trim() || Elements.commentInput.value.length > 500
    };

    let isValid = true;
    Object.keys(errors).forEach(field => {
        if (errors[field]) {
            showError(`${field}-error`, `Please fill in the ${field.replace('-', ' ')} field correctly.`);
            document.getElementById(field).classList.add('error');
            isValid = false;
        } else {
            clearError(`${field}-error`);
            document.getElementById(field).classList.remove('error');
        }
    });

    return isValid;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.add('show');
    }
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.classList.remove('show');
    }
}

function resetFormState() {
    Elements.feedbackForm.reset();
    AppState.photos = [];
    Elements.photoPreview.innerHTML = '';
    Elements.charCount.textContent = '0';
    Elements.charCounter.classList.remove('warning', 'danger');
    Elements.uploadBtn.textContent = '📸 Add Photos';
    Elements.uploadBtn.disabled = false;
    clearAllErrors();
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
        el.classList.remove('error');
    });
}

function showSuccessMessage() {
    Elements.successMessage.style.display = 'flex';
}

function handleSubmitAnother() {
    Elements.successMessage.style.display = 'none';
    resetFormState();
    // Switch to feedback form tab
    const feedbackBtn = Array.from(Elements.tabBtns).find(btn => btn.dataset.tab === 'feedback-form');
    if (feedbackBtn) feedbackBtn.click();
    Elements.productNameInput.focus();
}

// ============================================================================
// ADMIN LOGIN & AUTHENTICATION
// ============================================================================
function openLoginModal() {
    Elements.loginModal.style.display = 'flex';
}

function closeLoginModal() {
    Elements.loginModal.style.display = 'none';
}

function closeLoginModalOnBackdrop(e) {
    if (e.target === Elements.loginModal) {
        closeLoginModal();
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username = Elements.adminUsernameInput.value;
    const password = Elements.adminPasswordInput.value;

    if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
        AppState.setAdminLogin();
        updateUIBasedOnAuth();
        Elements.loginForm.reset();
        closeLoginModal();
        
        // Auto-switch to dashboard tab after successful login
        const dashboardBtn = Array.from(Elements.tabBtns).find(btn => btn.dataset.tab === 'admin-dashboard');
        if (dashboardBtn) {
            dashboardBtn.click();
        }
    } else {
        showError('password-error', 'Invalid credentials. Please try again or contact ' + CONFIG.CONTACT_EMAIL);
    }
}

function handleLogout() {
    AppState.logoutAdmin();
    updateUIBasedOnAuth();
    
    // Switch to feedback form
    const feedbackBtn = Array.from(Elements.tabBtns).find(btn => btn.dataset.tab === 'feedback-form');
    if (feedbackBtn) feedbackBtn.click();
}

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================
async function displayAdminDashboard() {
    await AppState.loadFeedback();
    renderFeedbackList(AppState.allFeedback);
}

function renderFeedbackList(feedbackList) {
    Elements.feedbackList.innerHTML = '';
    Elements.feedbackCount.textContent = feedbackList.length;

    if (feedbackList.length === 0) {
        Elements.feedbackList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No feedback submissions yet.</p>
            </div>
        `;
        return;
    }

    feedbackList.forEach(feedback => {
        const card = createFeedbackCard(feedback);
        Elements.feedbackList.appendChild(card);
    });
}

function createFeedbackCard(feedback) {
    const date = new Date(feedback.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const card = document.createElement('div');
    card.className = 'feedback-card';

    let photosHTML = '';
    if (feedback.photos && feedback.photos.length > 0) {
        photosHTML = `
            <div class="feedback-photos">
                ${feedback.photos.map((photo, idx) => {
                    const src = photo.url || photo.data;
                    return `
                    <div class="feedback-photo" onclick="showPhotoModal('${src}')">
                        <img src="${src}" alt="Photo ${idx + 1}">
                    </div>`;
                }).join('')}
            </div>
        `;
    }

    card.innerHTML = `
        <div class="feedback-header">
            <div>
                <div class="feedback-title">${feedback.productName}</div>
                <div class="feedback-timestamp">${formattedDate}</div>
            </div>
            <div class="feedback-category">
                <span class="badge">${feedback.category}</span>
                <span class="badge">${feedback.subcategory}</span>
            </div>
        </div>

        <div class="feedback-details">
            <div class="detail-row">
                <div class="detail-label">Feedback:</div>
                <div class="detail-value">${feedback.comment}</div>
            </div>
        </div>

        ${photosHTML}

        <div class="feedback-actions">
            <button type="button" class="btn btn-danger btn-sm delete-feedback-btn" data-id="${feedback.id}">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    card.querySelector('.delete-feedback-btn').addEventListener('click', () => deleteFeedback(feedback.id));

    return card;
}

async function applyFilters() {
    const startDate = Elements.filterStartDate.value;
    const endDate = Elements.filterEndDate.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert('Start date cannot be after end date');
        return;
    }

    AppState.currentFilter.startDate = startDate;
    AppState.currentFilter.endDate = endDate;

    const filtered = await AppState.getFilteredFeedback();
    renderFeedbackList(filtered);
}

async function clearFilters() {
    AppState.currentFilter.startDate = null;
    AppState.currentFilter.endDate = null;
    Elements.filterStartDate.value = '';
    Elements.filterEndDate.value = '';
    await AppState.loadFeedback();
    renderFeedbackList(AppState.allFeedback);
}

async function deleteFeedback(id) {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
        const response = await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
        if (response.ok) {
            await displayAdminDashboard();
        } else {
            const err = await response.json();
            alert('Failed to delete: ' + (err.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Failed to delete feedback: ' + error.message);
    }
}

async function exportToExcel() {
    const params = new URLSearchParams();
    if (AppState.currentFilter.startDate) params.set('startDate', AppState.currentFilter.startDate);
    if (AppState.currentFilter.endDate) params.set('endDate', AppState.currentFilter.endDate);

    const url = '/api/feedback/export?' + params.toString();
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.click();
}

// ============================================================================
// QR CODE GENERATION
// ============================================================================
function setFeedbackUrl() {
    const url = window.location.origin + window.location.pathname;
    Elements.feedbackUrl.textContent = url;
}

function generateQRCode() {
    const url = window.location.origin + window.location.pathname;
    
    // Clear existing QR code
    Elements.qrCanvas.innerHTML = '';
    
    // Generate new QR code with larger size for better scanning
    try {
        new QRCode(Elements.qrCanvas, {
            text: url,
            width: 300,
            height: 300,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        Elements.qrCanvas.innerHTML = '<p>Error generating QR code. Please refresh the page.</p>';
    }
}

function downloadQRCode() {
    const canvas = Elements.qrCanvas.querySelector('canvas');
    if (!canvas) {
        alert('QR Code not generated yet');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'swagath-feedback-qrcode.png';
    link.click();
}

function copyFeedbackUrl() {
    const url = Elements.feedbackUrl.textContent;
    navigator.clipboard.writeText(url).then(() => {
        const originalText = Elements.copyUrlBtn.innerHTML;
        Elements.copyUrlBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            Elements.copyUrlBtn.innerHTML = originalText;
        }, 2000);
    }).catch(() => {
        alert('Failed to copy URL');
    });
}

// ============================================================================
// EMAIL SETTINGS & NOTIFICATIONS
// ============================================================================
function toggleEmailInput() {
    if (Elements.emailNotificationsToggle.checked) {
        Elements.emailInputSection.style.display = 'flex';
        Elements.notificationEmailInput.focus();
    } else {
        Elements.emailInputSection.style.display = 'none';
    }
}

function getEmailSettings() {
    const stored = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.EMAIL_SETTINGS);
    return stored ? JSON.parse(stored) : { enabled: false, email: '' };
}

function saveEmailSettings(enabled, email) {
    const settings = { enabled, email };
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.EMAIL_SETTINGS, JSON.stringify(settings));
}

function loadAdminSettings() {
    const settings = getEmailSettings();
    Elements.emailNotificationsToggle.checked = settings.enabled;
    Elements.notificationEmailInput.value = settings.email || '';
    
    if (settings.enabled) {
        Elements.emailInputSection.style.display = 'flex';
    } else {
        Elements.emailInputSection.style.display = 'none';
    }
}

function handleSettingsSave(e) {
    e.preventDefault();

    const enabled = Elements.emailNotificationsToggle.checked;
    const email = Elements.notificationEmailInput.value.trim();

    if (enabled && !validateEmail(email)) {
        showError('email-error', 'Please enter a valid email address');
        return;
    }

    clearError('email-error');
    saveEmailSettings(enabled, email);

    // Show confirmation
    alert('Settings saved successfully!');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

async function sendEmailNotification(feedback, email) {
    try {
        // This will be called when you have an Azure Function backend
        // For now, it's a placeholder
        console.log('Email would be sent to:', email);
        console.log('Feedback:', feedback);
        
        // Uncomment when backend is ready:
        // const response = await fetch('/api/send-notification', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, feedback })
        // });
        // return response.ok;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function getFormattedDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getFormattedTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState, CONFIG, CATEGORIES };
}
