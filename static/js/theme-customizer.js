/**
 * Theme Customizer JavaScript
 * Handles theme customization functionality including color schemes, dark/light mode, and layout options
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme settings from localStorage or use defaults
    initializeThemeSettings();
    
    // Set up event listeners for customization controls
    setupEventListeners();
});

/**
 * Initialize theme settings from localStorage or use defaults
 */
function initializeThemeSettings() {
    // Get saved settings or use defaults
    const savedSettings = JSON.parse(localStorage.getItem('themeSettings')) || {
        colorScheme: 'blue',
        themeMode: 'light',
        stickyHeader: false,
        compactSidebar: false,
        showFooter: true,
        fontSize: 3
    };
    
    // Apply saved settings
    applyColorScheme(savedSettings.colorScheme);
    applyThemeMode(savedSettings.themeMode);
    
    // Set UI controls to match saved settings
    document.querySelectorAll('.color-scheme-btn').forEach(btn => {
        if (btn.dataset.color === savedSettings.colorScheme) {
            btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
        }
    });
    
    document.querySelectorAll('.theme-mode-btn').forEach(btn => {
        if (btn.dataset.mode === savedSettings.themeMode) {
            btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
        }
    });
    
    // Set checkbox states
    document.getElementById('stickyHeader').checked = savedSettings.stickyHeader;
    document.getElementById('compactSidebar').checked = savedSettings.compactSidebar;
    document.getElementById('showFooter').checked = savedSettings.showFooter;
    
    // Apply layout options
    applyStickyHeader(savedSettings.stickyHeader);
    applyCompactSidebar(savedSettings.compactSidebar);
    applyShowFooter(savedSettings.showFooter);
    
    // Set font size slider
    document.getElementById('fontSizeSlider').value = savedSettings.fontSize;
    applyFontSize(savedSettings.fontSize);
}

/**
 * Set up event listeners for all customization controls
 */
function setupEventListeners() {
    // Color scheme buttons
    document.querySelectorAll('.color-scheme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.dataset.color;
            applyColorScheme(color);
            updateSelectedButton('.color-scheme-btn', this);
            saveSettings('colorScheme', color);
        });
    });
    
    // Theme mode buttons
    document.querySelectorAll('.theme-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            applyThemeMode(mode);
            updateSelectedButton('.theme-mode-btn', this);
            saveSettings('themeMode', mode);
        });
    });
    
    // Layout option checkboxes
    document.getElementById('stickyHeader').addEventListener('change', function() {
        applyStickyHeader(this.checked);
        saveSettings('stickyHeader', this.checked);
    });
    
    document.getElementById('compactSidebar').addEventListener('change', function() {
        applyCompactSidebar(this.checked);
        saveSettings('compactSidebar', this.checked);
    });
    
    document.getElementById('showFooter').addEventListener('change', function() {
        applyShowFooter(this.checked);
        saveSettings('showFooter', this.checked);
    });
    
    // Font size slider
    document.getElementById('fontSizeSlider').addEventListener('input', function() {
        const size = parseInt(this.value);
        applyFontSize(size);
        saveSettings('fontSize', size);
    });
    
    // Reset button
    document.getElementById('resetCustomization').addEventListener('click', function() {
        resetToDefaults();
    });
    
    // Close button functionality
    document.querySelector('.btn-close').addEventListener('click', function() {
        const offcanvas = document.getElementById('customizationDrawer');
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
    });
}

/**
 * Apply selected color scheme to the UI
 */
function applyColorScheme(color) {
    // Define all possible color classes for consistency
    const colorMap = {
        blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', hoverText: 'hover:text-blue-500' },
        green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', text: 'text-green-600', hoverText: 'hover:text-green-500' },
        purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', text: 'text-purple-600', hoverText: 'hover:text-purple-500' },
        red: { bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-red-600', hoverText: 'hover:text-red-500' },
        yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-500', hoverText: 'hover:text-yellow-500' },
        pink: { bg: 'bg-pink-600', hover: 'hover:bg-pink-700', text: 'text-pink-600', hoverText: 'hover:text-pink-500' },
        indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-600', hoverText: 'hover:text-indigo-500' },
        gray: { bg: 'bg-gray-700', hover: 'hover:bg-gray-800', text: 'text-gray-600', hoverText: 'hover:text-gray-500' }
    };
    
    // Get all possible classes for each type
    const allBgClasses = Object.values(colorMap).map(c => c.bg);
    const allHoverClasses = Object.values(colorMap).map(c => c.hover);
    const allTextClasses = Object.values(colorMap).map(c => c.text);
    const allHoverTextClasses = Object.values(colorMap).map(c => c.hoverText);
    
    // Get the target classes for the selected color
    const targetBg = colorMap[color].bg;
    const targetHover = colorMap[color].hover;
    const targetText = colorMap[color].text;
    const targetHoverText = colorMap[color].hoverText;
    
    // Update navbar background
    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Remove all possible background classes
        allBgClasses.forEach(cls => navbar.classList.remove(cls));
        
        // Add the new background class
        navbar.classList.add(targetBg);
        
        // Update all links in navbar
        document.querySelectorAll('#navbar a').forEach(link => {
            // Remove all possible hover classes
            allHoverClasses.forEach(cls => link.classList.remove(cls));
            
            // Add the new hover class
            link.classList.add(targetHover);
        });
        
        // Update mobile menu button
        const mobileMenuBtn = document.querySelector('.mobile-menu-button');
        if (mobileMenuBtn) {
            allHoverClasses.forEach(cls => mobileMenuBtn.classList.remove(cls));
            mobileMenuBtn.classList.add(targetHover);
        }
        
        // Update customize button
        const customizeBtn = document.querySelector('.customize-button');
        if (customizeBtn) {
            allHoverClasses.forEach(cls => customizeBtn.classList.remove(cls));
            customizeBtn.classList.add(targetHover);
        }
    }
    
    // Update primary CTA button
    const ctaButton = document.getElementById('primary-cta');
    if (ctaButton) {
        // Remove all possible background and hover classes
        allBgClasses.forEach(cls => ctaButton.classList.remove(cls));
        allHoverClasses.forEach(cls => ctaButton.classList.remove(cls));
        
        // Add the new classes
        ctaButton.classList.add(targetBg, targetHover);
    }
    
    // Update college buttons
    const collegeBtnBgClasses = [
        'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
        'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    
    const collegeBtnHoverClasses = [
        'hover:bg-blue-600', 'hover:bg-green-600', 'hover:bg-purple-600', 'hover:bg-red-600',
        'hover:bg-yellow-600', 'hover:bg-pink-600', 'hover:bg-indigo-600', 'hover:bg-gray-600'
    ];
    
    document.querySelectorAll('.college-btn').forEach(btn => {
        // Remove all possible background and hover classes
        collegeBtnBgClasses.forEach(cls => btn.classList.remove(cls));
        collegeBtnHoverClasses.forEach(cls => btn.classList.remove(cls));
        
        // Add the new classes - note the different shade for college buttons
        btn.classList.add(`bg-${color}-500`, `hover:bg-${color}-600`);
    });
    
    // Update all text elements that use primary color
    document.querySelectorAll('[class*="text-"]').forEach(el => {
        const classList = Array.from(el.classList);
        
        // Check if element has any color text class
        const hasColorClass = classList.some(cls => {
            return allTextClasses.some(colorCls => cls === colorCls);
        });
        
        if (hasColorClass) {
            // Remove all possible text color classes
            allTextClasses.forEach(cls => el.classList.remove(cls));
            
            // Add the new text color class
            el.classList.add(targetText);
        }
    });
    
    // Update all hover text elements
    document.querySelectorAll('[class*="hover:text-"]').forEach(el => {
        const classList = Array.from(el.classList);
        
        // Check if element has any hover text class
        const hasHoverClass = classList.some(cls => {
            return allHoverTextClasses.some(hoverCls => cls === hoverCls);
        });
        
        if (hasHoverClass) {
            // Remove all possible hover text classes
            allHoverTextClasses.forEach(cls => el.classList.remove(cls));
            
            // Add the new hover text class
            el.classList.add(targetHoverText);
        }
    });
}

/**
 * Apply selected theme mode (light/dark/auto)
 */
function applyThemeMode(mode) {
    const htmlElement = document.documentElement;
    
    // Remove existing mode classes
    htmlElement.classList.remove('dark');
    
    // Ensure footer always stays dark regardless of theme mode
    const footerElement = document.querySelector('.footer-dark');
    if (footerElement) {
        footerElement.classList.remove('bg-white', 'bg-gray-100');
        footerElement.classList.add('bg-gray-800');
    }
    
    // Apply selected mode
    if (mode === 'dark') {
        // Apply dark mode using Tailwind's dark mode class
        htmlElement.classList.add('dark');
        
        // Ensure footer headings are white in dark mode
        document.querySelectorAll('#footer-info h3').forEach(heading => {
            heading.style.color = 'white';
        });
        
        // Update SVG icons for better contrast in dark mode
        document.querySelectorAll('svg.text-gray-500').forEach(svg => {
            svg.classList.remove('text-gray-500');
            svg.classList.add('text-gray-300');
        });
        
        // Enhance contrast for specific elements that need additional attention
        document.querySelectorAll('.news-card .text-gray-700').forEach(el => {
            el.classList.remove('text-gray-700');
            el.classList.add('dark:text-gray-300');
        });
        
        // Update card shadows for better visibility in dark mode
        document.querySelectorAll('.program-card, .news-card').forEach(card => {
            if (card.classList.contains('shadow')) {
                card.classList.remove('shadow');
                card.classList.add('shadow-lg');
            }
        });
        
    } else if (mode === 'auto') {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlElement.classList.add('dark');
            
            // Apply dark mode specific adjustments
            document.querySelectorAll('#footer-info h3').forEach(heading => {
                heading.style.color = 'white';
            });
            
            // Update card shadows for better visibility in dark mode
            document.querySelectorAll('.program-card, .news-card').forEach(card => {
                if (card.classList.contains('shadow')) {
                    card.classList.remove('shadow');
                    card.classList.add('shadow-lg');
                }
            });
        }
        
        // Listen for changes in system preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                htmlElement.classList.add('dark');
                
                // Apply dark mode specific adjustments
                document.querySelectorAll('#footer-info h3').forEach(heading => {
                    heading.style.color = 'white';
                });
                
                // Update card shadows for better visibility in dark mode
                document.querySelectorAll('.program-card, .news-card').forEach(card => {
                    if (card.classList.contains('shadow')) {
                        card.classList.remove('shadow');
                        card.classList.add('shadow-lg');
                    }
                });
            } else {
                htmlElement.classList.remove('dark');
                
                // Revert card shadows
                document.querySelectorAll('.program-card, .news-card').forEach(card => {
                    if (card.classList.contains('shadow-lg')) {
                        card.classList.remove('shadow-lg');
                        card.classList.add('shadow');
                    }
                });
            }
        });
    } else {
        // Light mode - simply remove dark mode class
        // Tailwind's dark mode will handle most styling automatically
        
        // Revert any specific dark mode adjustments
        document.querySelectorAll('svg.text-gray-300').forEach(svg => {
            svg.classList.remove('text-gray-300');
            svg.classList.add('text-gray-500');
        });
        
        // Revert card shadows
        document.querySelectorAll('.program-card, .news-card').forEach(card => {
            if (card.classList.contains('shadow-lg')) {
                card.classList.remove('shadow-lg');
                card.classList.add('shadow');
            }
        });
    }
    
    // Ensure customization drawer remains consistent regardless of theme mode
    preserveCustomizationDrawerAppearance();
}

/**
 * Apply sticky header setting
 */
function applyStickyHeader(isSticky) {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (isSticky) {
            navbar.classList.add('sticky', 'top-0', 'z-50');
        } else {
            navbar.classList.remove('sticky', 'top-0', 'z-50');
        }
    }
}

/**
 * Apply compact sidebar setting
 */
function applyCompactSidebar(isCompact) {
    // Implementation depends on sidebar structure
    // This is a placeholder for future sidebar implementation
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        if (isCompact) {
            sidebar.classList.add('compact-sidebar');
        } else {
            sidebar.classList.remove('compact-sidebar');
        }
    }
}

/**
 * Apply show footer setting
 */
function applyShowFooter(showFooter) {
    const footer = document.querySelector('footer');
    if (footer) {
        if (showFooter) {
            footer.classList.remove('hidden');
        } else {
            footer.classList.add('hidden');
        }
    }
}

/**
 * Apply font size setting
 */
function applyFontSize(size) {
    const htmlElement = document.documentElement;
    const sizes = {
        1: '0.875rem',  // Small
        2: '0.9375rem', // Medium-small
        3: '1rem',      // Medium (default)
        4: '1.0625rem', // Medium-large
        5: '1.125rem'   // Large
    };
    
    htmlElement.style.fontSize = sizes[size] || sizes[3];
}

/**
 * Update selected button styling
 */
function updateSelectedButton(selector, selectedButton) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500');
    });
    selectedButton.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
}

/**
 * Save settings to localStorage
 */
function saveSettings(key, value) {
    const currentSettings = JSON.parse(localStorage.getItem('themeSettings')) || {
        colorScheme: 'blue',
        themeMode: 'light',
        stickyHeader: false,
        compactSidebar: false,
        showFooter: true,
        fontSize: 3
    };
    
    currentSettings[key] = value;
    localStorage.setItem('themeSettings', JSON.stringify(currentSettings));
}

/**
 * Ensure the customization drawer maintains a consistent appearance
 * regardless of theme settings
 */
function preserveCustomizationDrawerAppearance() {
    // Get the customization drawer element
    const drawer = document.getElementById('customizationDrawer');
    if (!drawer) return;
    
    // Ensure drawer has consistent styling
    drawer.style.backgroundColor = '#ffffff';
    drawer.style.color = '#111827';
    
    // Ensure all text elements in the drawer have consistent color
    const textElements = drawer.querySelectorAll('h5, h6, label, span');
    textElements.forEach(el => {
        el.style.color = '#111827';
    });
    
    // Ensure background of header and body are consistent
    const header = drawer.querySelector('.offcanvas-header');
    const body = drawer.querySelector('.offcanvas-body');
    
    if (header) header.style.backgroundColor = '#ffffff';
    if (body) body.style.backgroundColor = '#ffffff';
}

/**
 * Reset all customization options to defaults
 */
function resetToDefaults() {
    const defaultSettings = {
        colorScheme: 'blue',
        themeMode: 'light',
        stickyHeader: false,
        compactSidebar: false,
        showFooter: true,
        fontSize: 3
    };
    
    // Clear any existing settings
    localStorage.removeItem('themeSettings');
    
    // Save default settings
    localStorage.setItem('themeSettings', JSON.stringify(defaultSettings));
    
    // Force a clean application of default settings
    // First, remove all possible theme-related classes from key elements
    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Remove all possible color background classes
        ['blue', 'green', 'purple', 'red', 'yellow', 'pink', 'indigo', 'gray'].forEach(color => {
            navbar.classList.remove(`bg-${color}-600`, `bg-${color}-500`, `bg-${color}-700`);
        });
    }
    
    // Reset body classes for dark mode
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark');
    
    // Apply default settings
    applyColorScheme(defaultSettings.colorScheme);
    applyThemeMode(defaultSettings.themeMode);
    applyStickyHeader(defaultSettings.stickyHeader);
    applyCompactSidebar(defaultSettings.compactSidebar);
    applyShowFooter(defaultSettings.showFooter);
    applyFontSize(defaultSettings.fontSize);
    
    // Update UI controls
    document.querySelectorAll('.color-scheme-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500');
        if (btn.dataset.color === defaultSettings.colorScheme) {
            btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
        }
    });
    
    document.querySelectorAll('.theme-mode-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-500');
        if (btn.dataset.mode === defaultSettings.themeMode) {
            btn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-500');
        }
    });
    
    // Update checkboxes
    document.getElementById('stickyHeader').checked = defaultSettings.stickyHeader;
    document.getElementById('compactSidebar').checked = defaultSettings.compactSidebar;
    document.getElementById('showFooter').checked = defaultSettings.showFooter;
    
    // Update font size slider
    document.getElementById('fontSizeSlider').value = defaultSettings.fontSize;
    
    // Reset any primary CTA button
    const ctaButton = document.getElementById('primary-cta');
    if (ctaButton) {
        // Remove all possible color classes
        ['blue', 'green', 'purple', 'red', 'yellow', 'pink', 'indigo', 'gray'].forEach(color => {
            ctaButton.classList.remove(
                `bg-${color}-600`, `bg-${color}-500`, `bg-${color}-700`,
                `hover:bg-${color}-700`, `hover:bg-${color}-600`, `hover:bg-${color}-800`
            );
        });
        
        // Add default classes
        ctaButton.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }
    
    // Ensure customization drawer remains consistent
    preserveCustomizationDrawerAppearance();
}
