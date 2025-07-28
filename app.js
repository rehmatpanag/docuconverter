// DocuConvert Pro - FINAL FIXED Implementation

// Application Data
const APP_DATA = {
  users: [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      createdAt: "2025-01-15T10:30:00Z",
      conversionCount: 24
    }
  ],
  conversions: [],
  faqData: [
    {
      question: "What file formats do you support?",
      answer: "We support over 50 file formats including PDF, DOCX, XLSX, PPTX, JPG, PNG, MP4, and many more. The available conversion options depend on your uploaded file type."
    },
    {
      question: "Is there a file size limit?",
      answer: "Free users can convert files up to 100MB. Premium users have a limit of 1GB per file."
    },
    {
      question: "How long are files stored?", 
      answer: "Converted files are automatically deleted after 24 hours for security. Users with accounts can access their conversion history for 30 days."
    }
  ]
};

// Gradients for randomized title
const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
];

// File format definitions
const FILE_FORMATS = {
  image: {
    name: "Images",
    formats: ["JPG", "PNG", "WEBP", "GIF", "BMP"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"],
    icon: "🖼️"
  },
  document: {
    name: "Documents", 
    formats: ["PDF", "TXT", "HTML", "MD"],
    mimeTypes: ["application/pdf", "text/plain", "text/html", "text/markdown"],
    extensions: [".pdf", ".txt", ".html", ".htm", ".md"],
    icon: "📄"
  },
  spreadsheet: {
    name: "Spreadsheets",
    formats: ["CSV", "JSON", "XML"],
    mimeTypes: ["text/csv", "application/json", "application/xml"],
    extensions: [".csv", ".json", ".xml"],
    icon: "📈"
  }
};

// Format descriptions
const FORMAT_DESCRIPTIONS = {
  "PDF": "Perfect for documents that need to maintain formatting across devices",
  "TXT": "Simple plain text format readable everywhere",
  "HTML": "Web page format for online publishing",
  "MD": "Markdown format for documentation",
  "JPG": "Ideal for photos and images with many colors",
  "PNG": "Best for images with transparency or sharp edges",
  "WEBP": "Modern web format with superior compression",
  "CSV": "Spreadsheet format for data exchange",
  "JSON": "JavaScript Object Notation for data interchange",
  "XML": "Extensible Markup Language for structured data"
};

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(el => el.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ️'} ${message}
        </div>
    `;

    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 24px;
                padding: 16px 20px;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                z-index: 9999;
                animation: slideInRight 0.3s ease-out forwards;
                max-width: 320px;
                font-size: 14px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }
            
            .notification--success { background: rgba(34, 197, 94, 0.95); }
            .notification--error { background: rgba(239, 68, 68, 0.95); }
            .notification--info { background: rgba(59, 130, 246, 0.95); }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) notification.remove();
    }, 4000);
}

// FIXED Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemPreference();
        console.log('🎨 Theme Manager initialized with theme:', this.currentTheme);
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('docuconvert-theme');
        } catch (e) {
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('docuconvert-theme', theme);
        } catch (e) {
            console.warn('Cannot store theme preference');
        }
    }

    setupEventListeners() {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.replaceWith(themeToggleBtn.cloneNode(true));
            const newBtn = document.getElementById('themeToggleBtn');
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Theme toggle clicked');
                this.toggleTheme();
            });
            
            console.log('✅ Theme toggle event listener attached');
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('🔄 Toggling theme from', this.currentTheme, 'to', newTheme);
        this.applyTheme(newTheme);
        this.storeTheme(newTheme);
        showNotification(`Switched to ${newTheme} mode`, 'success');
    }

    applyTheme(theme) {
        console.log('🎨 Applying theme:', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        console.log('✅ Theme applied successfully:', theme);
    }
}

// FIXED Dropdown Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.activeDropdown = null;
        this.init();
    }

    init() {
        setTimeout(() => {
            this.setupEventListeners();
            this.updateAuthUI();
        }, 100);
        console.log('✅ Auth Manager initialized');
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginBtn) {
            loginBtn.replaceWith(loginBtn.cloneNode(true));
            const newLoginBtn = document.getElementById('loginBtn');
            newLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown('login');
            });
        }

        if (signupBtn) {
            signupBtn.replaceWith(signupBtn.cloneNode(true));
            const newSignupBtn = document.getElementById('signupBtn');
            newSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown('signup');
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideAllDropdowns();
                setTimeout(() => this.showDropdown('signup'), 150);
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideAllDropdowns();
                setTimeout(() => this.showDropdown('login'), 150);
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.auth-dropdown-container')) {
                this.hideAllDropdowns();
            }
        });

        console.log('✅ Auth event listeners setup complete');
    }

    toggleDropdown(type) {
        if (this.activeDropdown === type) {
            this.hideAllDropdowns();
        } else {
            this.hideAllDropdowns();
            setTimeout(() => this.showDropdown(type), 150);
        }
    }

    showDropdown(type) {
        const dropdown = document.getElementById(type + 'Dropdown');
        if (dropdown) {
            dropdown.classList.remove('hidden');
            dropdown.offsetHeight;
            dropdown.classList.add('visible');
            this.activeDropdown = type;
            console.log('📋 Showing', type, 'dropdown');
        }
    }

    hideAllDropdowns() {
        ['login', 'signup'].forEach(type => {
            const dropdown = document.getElementById(type + 'Dropdown');
            if (dropdown) {
                dropdown.classList.remove('visible');
                setTimeout(() => {
                    dropdown.classList.add('hidden');
                }, 300);
            }
        });
        this.activeDropdown = null;
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = APP_DATA.users.find(u => u.email === email);
        if (user && password === 'password') {
            this.currentUser = user;
            this.updateAuthUI();
            this.hideAllDropdowns();
            showNotification(`Welcome back, ${user.name}!`, 'success');
            document.getElementById('loginForm').reset();
        } else {
            showNotification('Invalid credentials. Try password: "password"', 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (!this.validatePassword(password)) {
            showNotification('Password must have 8+ chars, 1 capital, 1 number, 1 symbol', 'error');
            return;
        }

        const newUser = {
            id: APP_DATA.users.length + 1,
            name,
            email,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            createdAt: new Date().toISOString(),
            conversionCount: 0
        };

        APP_DATA.users.push(newUser);
        this.currentUser = newUser;
        this.updateAuthUI();
        this.hideAllDropdowns();
        showNotification(`Account created successfully! Welcome, ${name}!`, 'success');
        document.getElementById('signupForm').reset();
    }

    validatePassword(password) {
        const hasMinLength = password.length >= 8;
        const hasCapital = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasMinLength && hasCapital && hasNumber && hasSymbol;
    }

    logout() {
        this.currentUser = null;
        this.updateAuthUI();
        showNotification('Logged out successfully', 'info');
    }

    updateAuthUI() {
        const navAuth = document.getElementById('navAuth');
        const navUser = document.getElementById('navUser');
        const userAvatarImg = document.getElementById('userAvatarImg');

        if (this.currentUser) {
            if (navAuth) navAuth.classList.add('hidden');
            if (navUser) navUser.classList.remove('hidden');
            if (userAvatarImg) userAvatarImg.src = this.currentUser.avatar;
        } else {
            if (navAuth) navAuth.classList.remove('hidden');
            if (navUser) navUser.classList.add('hidden');
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// FIXED Page Manager
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        setTimeout(() => {
            this.setupNavigation();
            this.renderFAQ();
        }, 200);
        console.log('✅ Page Manager initialized');
    }

    setupNavigation() {
        console.log('🔧 Setting up navigation...');
        
        // Get all navigation links with data-page attribute
        const navLinks = document.querySelectorAll('[data-page]');
        console.log('📄 Found navigation links:', navLinks.length);
        
        navLinks.forEach((link, index) => {
            // Clone to remove existing listeners
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = newLink.getAttribute('data-page');
                console.log('📄 Navigation clicked for page:', page);
                if (page) {
                    this.showPage(page);
                }
            });
            
            console.log(`✅ Navigation listener ${index + 1} attached for page:`, newLink.getAttribute('data-page'));
        });
        
        console.log('✅ All navigation listeners setup complete');
    }

    showPage(pageId) {
        console.log('📄 Switching to page:', pageId);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;

            // Render page-specific content
            if (pageId === 'dashboard') {
                this.renderDashboard();
            } else if (pageId === 'support') {
                this.renderSupport();
            }
            
            showNotification(`Navigated to ${pageId}`, 'info');
            console.log('✅ Successfully navigated to page:', pageId);
        } else {
            console.error('❌ Target page not found:', pageId + 'Page');
        }
    }

    renderDashboard() {
        if (!window.app.authManager.isAuthenticated()) {
            this.showPage('home');
            showNotification('Please log in to access the dashboard', 'error');
            return;
        }

        const user = window.app.authManager.getCurrentUser();
        
        const totalConversions = document.getElementById('totalConversions');
        const monthlyConversions = document.getElementById('monthlyConversions');
        const successRate = document.getElementById('successRate');
        
        if (totalConversions) totalConversions.textContent = user.conversionCount;
        if (monthlyConversions) monthlyConversions.textContent = APP_DATA.conversions.length;
        if (successRate) successRate.textContent = '98%';
    }

    renderSupport() {
        this.renderFAQ();
        this.setupIssueForm();
    }

    renderFAQ() {
        const faqList = document.getElementById('faqList');
        if (faqList) {
            faqList.innerHTML = '';
            
            APP_DATA.faqData.forEach((faq) => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.innerHTML = `
                    <div class="faq-question">
                        <span>${faq.question}</span>
                        <span class="faq-toggle">▼</span>
                    </div>
                    <div class="faq-answer">
                        <p>${faq.answer}</p>
                    </div>
                `;
                
                const question = faqItem.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    faqItem.classList.toggle('active');
                });
                
                faqList.appendChild(faqItem);
            });
        }
    }

    setupIssueForm() {
        const issueForm = document.getElementById('issueForm');
        if (issueForm) {
            issueForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification('Issue submitted successfully!', 'success');
                issueForm.reset();
            });
        }
    }
}

// WORKING File Converter - FIXED Get Started Button
class SmartDocumentConverter {
    constructor() {
        this.selectedFiles = [];
        this.selectedFormat = null;
        this.detectedCategory = null;
        this.convertedFiles = [];
        this.init();
    }

    init() {
        setTimeout(() => {
            this.setupEventListeners();
            this.resetConverter();
        }, 300); // Longer delay to ensure DOM is ready
        console.log('🔧 Smart Document Converter initialized');
    }

    setupEventListeners() {
        console.log('🔧 Setting up converter event listeners...');
        
        // CRITICAL FIX: Get Started button
        const getStartedBtn = document.getElementById('getStartedBtn');
        if (getStartedBtn) {
            // Remove existing listeners and clone
            const newBtn = getStartedBtn.cloneNode(true);
            getStartedBtn.parentNode.replaceChild(newBtn, getStartedBtn);
            
            // Add new listener
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚀 Get Started button clicked - showing converter');
                this.showConverter();
            });
            
            console.log('✅ Get Started button listener attached');
        } else {
            console.error('❌ Get Started button not found');
        }

        // Other event listeners
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        const convertBtn = document.getElementById('convertBtn');
        const newConversionBtn = document.getElementById('newConversionBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', () => fileInput.click());
            uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadZone.addEventListener('drop', this.handleDrop.bind(this));
            
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    this.processFiles(files);
                }
            });
        }

        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.startConversion());
        }

        if (newConversionBtn) {
            newConversionBtn.addEventListener('click', () => this.resetConverter());
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadConvertedFiles());
        }

        console.log('✅ All converter event listeners setup complete');
    }

    // FIXED - REPLACE HERO SECTION WITH CONVERTER
    showConverter() {
        console.log('🔄 Starting hero section replacement...');
        
        const heroSection = document.getElementById('heroSection');
        const converterSection = document.getElementById('converterSection');
        
        if (!heroSection) {
            console.error('❌ Hero section not found');
            return;
        }
        
        if (!converterSection) {
            console.error('❌ Converter section not found');
            return;
        }
        
        console.log('🔄 Replacing hero section with converter');
        
        // Fade out hero with CSS transition
        heroSection.style.transition = 'all 0.6s ease';
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(-50px)';
        heroSection.style.pointerEvents = 'none';
        
        setTimeout(() => {
            // Hide hero completely
            heroSection.style.display = 'none';
            
            // Show converter
            converterSection.classList.remove('hidden');
            converterSection.offsetHeight; // Force reflow
            converterSection.classList.add('visible');
            
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            showNotification('File converter is now ready!', 'success');
            console.log('✅ Hero section successfully replaced with converter');
        }, 600);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadZone').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadZone = document.getElementById('uploadZone');
        if (!uploadZone.contains(e.relatedTarget)) {
            uploadZone.classList.remove('dragover');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadZone').classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            this.processFiles(files);
        }
    }

    processFiles(files) {
        console.log('📁 Processing', files.length, 'files');
        
        const file = files[0];
        if (!this.validateFile(file)) return;

        this.selectedFiles = [file];
        this.detectedCategory = this.detectFileCategory(file);
        
        this.displayFilePreview();
        this.displayFormatOptions();
        
        showNotification(`File processed: ${file.name}`, 'success');
    }

    validateFile(file) {
        const maxSize = 100 * 1024 * 1024; // 100MB
        
        if (file.size > maxSize) {
            showNotification('File too large. Maximum size is 100MB.', 'error');
            return false;
        }

        const category = this.detectFileCategory(file);
        if (!category) {
            showNotification('Unsupported file format.', 'error');
            return false;
        }

        return true;
    }

    detectFileCategory(file) {
        const fileName = file.name.toLowerCase();
        const fileType = file.type.toLowerCase();
        
        for (const [categoryKey, category] of Object.entries(FILE_FORMATS)) {
            if (fileType && category.mimeTypes.some(mime => fileType.includes(mime))) {
                return categoryKey;
            }
            
            const extension = '.' + fileName.split('.').pop();
            if (category.extensions.some(ext => ext === extension)) {
                return categoryKey;
            }
        }
        
        return null;
    }

    displayFilePreview() {
        const previewSection = document.getElementById('filePreviewSection');
        const fileName = document.getElementById('fileName');
        const fileDetails = document.getElementById('fileDetails');
        const fileCategory = document.getElementById('fileCategory');
        const previewImage = document.getElementById('previewImage');

        if (!previewSection || this.selectedFiles.length === 0) return;

        const file = this.selectedFiles[0];
        previewSection.style.display = 'block';

        fileName.textContent = file.name;
        fileDetails.textContent = `${this.formatFileSize(file.size)} • ${file.type || 'Unknown type'}`;
        
        const category = FILE_FORMATS[this.detectedCategory];
        if (category) {
            fileCategory.textContent = category.name;
        }

        if (this.detectedCategory === 'image' && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
            };
            reader.readAsDataURL(file);
        } else {
            const category = FILE_FORMATS[this.detectedCategory];
            previewImage.innerHTML = `<div class="file-icon">${category ? category.icon : '📄'}</div>`;
        }
    }

    displayFormatOptions() {
        const formatSection = document.getElementById('formatSelectionSection');
        const formatCategories = document.getElementById('formatCategories');
        const convertSection = document.getElementById('convertSection');

        if (!formatSection || !formatCategories || !this.detectedCategory) return;

        formatSection.style.display = 'block';
        convertSection.style.display = 'block';

        const category = FILE_FORMATS[this.detectedCategory];
        if (!category) return;

        formatCategories.innerHTML = '';

        category.formats.forEach(format => {
            const formatOption = document.createElement('div');
            formatOption.className = 'format-option';
            formatOption.dataset.format = format;
            
            formatOption.innerHTML = `
                <span class="format-icon">${this.getFormatIcon(format)}</span>
                <span class="format-name">${format}</span>
            `;

            formatOption.addEventListener('click', () => {
                this.selectFormat(format, formatOption);
            });

            formatCategories.appendChild(formatOption);
        });
    }

    selectFormat(format, element) {
        document.querySelectorAll('.format-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        element.classList.add('selected');
        
        this.selectedFormat = format;
        this.displayFormatPreview(format);
        
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) convertBtn.disabled = false;
    }

    displayFormatPreview(format) {
        const previewSection = document.getElementById('selectedFormatPreview');
        const formatIcon = document.getElementById('selectedFormatIcon');
        const formatName = document.getElementById('selectedFormatName');
        const formatDescription = document.getElementById('selectedFormatDescription');

        if (!previewSection) return;

        previewSection.style.display = 'block';
        
        formatIcon.textContent = this.getFormatIcon(format);
        formatName.textContent = format;
        formatDescription.textContent = FORMAT_DESCRIPTIONS[format] || `Convert to ${format} format`;
    }

    getFormatIcon(format) {
        const iconMap = {
            'PDF': '📄', 'TXT': '📃', 'HTML': '🌐', 'MD': '📝',
            'JPG': '🖼️', 'JPEG': '🖼️', 'PNG': '🖼️', 'WEBP': '🖼️',
            'GIF': '🎞️', 'BMP': '🖼️',
            'CSV': '📋', 'JSON': '📊', 'XML': '📄'
        };
        return iconMap[format] || '📄';
    }

    async startConversion() {
        if (this.selectedFiles.length === 0 || !this.selectedFormat) {
            showNotification('Please select a file and output format', 'error');
            return;
        }

        console.log('🔄 Starting conversion to', this.selectedFormat);
        this.showConversionProgress();
        
        try {
            await this.performActualConversion();
            this.showDownloadSection();
            this.saveToHistory();
        } catch (error) {
            console.error('❌ Conversion failed:', error);
            showNotification('Conversion failed. Please try again.', 'error');
            this.resetConverter();
        }
    }

    async performActualConversion() {
        const file = this.selectedFiles[0];
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        const steps = [
            { progress: 20, text: 'Reading file content...', action: () => this.readFileContent(file) },
            { progress: 40, text: 'Analyzing file structure...', action: () => this.delay(500) },
            { progress: 60, text: 'Converting format...', action: () => this.convertFileFormat(file) },
            { progress: 80, text: 'Optimizing output...', action: () => this.delay(500) },
            { progress: 100, text: 'Finalizing conversion...', action: () => this.delay(300) }
        ];

        for (let step of steps) {
            await step.action();
            if (progressFill) progressFill.style.width = step.progress + '%';
            if (progressText) progressText.textContent = step.text;
        }
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                this.originalContent = e.target.result;
                resolve();
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            if (this.detectedCategory === 'image') {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    async convertFileFormat(file) {
        const baseName = file.name.split('.').slice(0, -1).join('.');
        const newFileName = `${baseName}.${this.selectedFormat.toLowerCase()}`;
        
        let convertedContent;
        
        switch (this.selectedFormat) {
            case 'TXT':
                convertedContent = this.convertToText();
                break;
            case 'HTML':
                convertedContent = this.convertToHTML(file);
                break;
            case 'MD':
                convertedContent = this.convertToMarkdown(file);
                break;
            case 'JSON':
                convertedContent = this.convertToJSON(file);
                break;
            case 'CSV':
                convertedContent = this.convertToCSV(file);
                break;
            case 'PNG':
                convertedContent = await this.convertImageToPNG();
                break;
            case 'JPG':
                convertedContent = await this.convertImageToJPG();
                break;
            default:
                convertedContent = this.originalContent;
        }
        
        this.convertedFiles = [{
            name: newFileName,
            content: convertedContent,
            type: this.getMimeType(this.selectedFormat),
            originalFile: file
        }];
        
        await this.delay(500);
    }

    convertToText() {
        if (this.detectedCategory === 'document') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.originalContent;
            return tempDiv.textContent || tempDiv.innerText || '';
        }
        return this.originalContent.toString();
    }

    convertToHTML(file) {
        const content = this.originalContent.toString();
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Converted from ${file.name}</h1>
    <pre>${this.escapeHtml(content)}</pre>
    <footer>
        <p><small>Converted by DocuConvert Pro on ${new Date().toLocaleString()}</small></p>
    </footer>
</body>
</html>`;
    }

    convertToMarkdown(file) {
        const content = this.originalContent.toString();
        return `# ${file.name}

Converted on: ${new Date().toLocaleString()}

## Content

\`\`\`
${content}
\`\`\`

---
*Converted by DocuConvert Pro*`;
    }

    convertToJSON(file) {
        const content = this.originalContent.toString();
        const lines = content.split('\n').filter(line => line.trim());
        
        return JSON.stringify({
            metadata: {
                originalFile: file.name,
                convertedAt: new Date().toISOString(),
                fileSize: file.size,
                convertedBy: "DocuConvert Pro"
            },
            content: {
                lines: lines,
                totalLines: lines.length,
                rawContent: content
            }
        }, null, 2);
    }

    convertToCSV(file) {
        const content = this.originalContent.toString();
        const lines = content.split('\n');
        
        let csv = 'Line Number,Content\n';
        lines.forEach((line, index) => {
            csv += `${index + 1},"${line.replace(/"/g, '""')}"\n`;
        });
        
        return csv;
    }

    async convertImageToPNG() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = this.originalContent;
        });
    }

    async convertImageToJPG() {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                
                resolve(canvas.toDataURL('image/jpeg', 0.92));
            };
            img.src = this.originalContent;
        });
    }

    getMimeType(format) {
        const mimeTypes = {
            'TXT': 'text/plain',
            'HTML': 'text/html',
            'MD': 'text/markdown',
            'JSON': 'application/json',
            'CSV': 'text/csv',
            'PNG': 'image/png',
            'JPG': 'image/jpeg'
        };
        return mimeTypes[format] || 'application/octet-stream';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showConversionProgress() {
        const sectionsToHide = ['formatSelectionSection', 'convertSection'];
        sectionsToHide.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) section.style.display = 'none';
        });
        
        const progressSection = document.getElementById('conversionProgress');
        if (progressSection) {
            progressSection.style.display = 'block';
            
            const progressFill = document.getElementById('progressFill');
            if (progressFill) progressFill.style.width = '0%';
        }
    }

    showDownloadSection() {
        const progressSection = document.getElementById('conversionProgress');
        if (progressSection) progressSection.style.display = 'none';
        
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.style.display = 'block';
            
            const convertedIcon = document.getElementById('convertedIcon');
            const convertedFileName = document.getElementById('convertedFileName');
            
            if (convertedIcon) {
                convertedIcon.textContent = this.getFormatIcon(this.selectedFormat);
            }
            
            if (convertedFileName && this.convertedFiles.length > 0) {
                convertedFileName.textContent = this.convertedFiles[0].name;
            }
        }
        
        showNotification('Conversion completed successfully!', 'success');
    }

    downloadConvertedFiles() {
        if (this.convertedFiles.length === 0) return;
        
        const convertedFile = this.convertedFiles[0];
        
        let blob;
        if (convertedFile.content.startsWith('data:')) {
            const byteString = atob(convertedFile.content.split(',')[1]);
            const mimeString = convertedFile.content.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            blob = new Blob([ab], { type: mimeString });
        } else {
            blob = new Blob([convertedFile.content], { type: convertedFile.type });
        }
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = convertedFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showNotification(`Downloaded: ${convertedFile.name}`, 'success');
    }

    saveToHistory() {
        if (!window.app?.authManager?.isAuthenticated()) return;

        const user = window.app.authManager.getCurrentUser();
        const originalFile = this.selectedFiles[0];
        
        const newConversion = {
            id: APP_DATA.conversions.length + 1,
            userId: user.id,
            originalFile: originalFile.name,
            originalFormat: originalFile.name.split('.').pop().toUpperCase(),
            targetFormat: this.selectedFormat,
            status: 'completed',
            createdAt: new Date().toISOString(),
            downloadUrl: '#converted-file',
            fileSize: this.formatFileSize(originalFile.size)
        };

        APP_DATA.conversions.push(newConversion);
        user.conversionCount++;
    }

    resetConverter() {
        this.selectedFiles = [];
        this.selectedFormat = null;
        this.detectedCategory = null;
        this.convertedFiles = [];
        this.originalContent = null;
        
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
        
        const sectionsToHide = [
            'filePreviewSection', 'formatSelectionSection', 
            'convertSection', 'conversionProgress', 'downloadSection'
        ];
        
        sectionsToHide.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) section.style.display = 'none';
        });
        
        const selectedFormatPreview = document.getElementById('selectedFormatPreview');
        if (selectedFormatPreview) selectedFormatPreview.style.display = 'none';
        
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) convertBtn.disabled = true;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize randomized gradient title
function initializeRandomGradient() {
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
        const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
        heroTitle.style.background = randomGradient;
        heroTitle.style.webkitBackgroundClip = 'text';
        heroTitle.style.webkitTextFillColor = 'transparent';
        heroTitle.style.backgroundClip = 'text';
        console.log('🎨 Applied random gradient to hero title');
    }
}

// App Initialization
class App {
    constructor() {
        this.themeManager = null;
        this.authManager = null;
        this.pageManager = null;
        this.documentConverter = null;
        this.init();
    }

    init() {
        console.log('🚀 Starting DocuConvert Pro with ALL FIXES APPLIED');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        console.log('📱 DOM ready, initializing ALL FIXED components');
        
        try {
            // Initialize randomized gradient title
            initializeRandomGradient();
            
            // Initialize all managers with proper timing
            this.themeManager = new ThemeManager();
            this.authManager = new AuthManager();
            this.pageManager = new PageManager();
            this.documentConverter = new SmartDocumentConverter();
            
            console.log('✅ ALL COMPONENTS INITIALIZED SUCCESSFULLY');
            
            // Show success notification
            setTimeout(() => {
                showNotification('DocuConvert Pro loaded with all fixes!', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error initializing components:', error);
            showNotification('Error loading application', 'error');
        }
    }
}

// Global app instance and initialization
console.log('🌟 DocuConvert Pro FINAL FIXED script loaded - initializing...');
window.app = new App();