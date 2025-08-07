/**
 * Dropdown Menu JavaScript
 * Handles dropdown menu functionality for both desktop and mobile views
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown buttons
    const dropdownButtons = document.querySelectorAll('.dropdown-button');
    
    // Add click event listeners to all dropdown buttons
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the dropdown content associated with this button
            const dropdownContent = this.nextElementSibling;
            
            // Toggle the visibility of the dropdown content
            if (dropdownContent.classList.contains('hidden')) {
                // Close all other dropdowns first
                document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                    if (dropdown !== dropdownContent) {
                        dropdown.classList.add('hidden');
                        dropdown.classList.remove('block');
                    }
                });
                
                // Show this dropdown
                dropdownContent.classList.remove('hidden');
                dropdownContent.classList.add('block');
            } else {
                // Hide this dropdown
                dropdownContent.classList.add('hidden');
                dropdownContent.classList.remove('block');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.classList.add('hidden');
                dropdown.classList.remove('block');
            });
        }
    });
    
    // Handle mobile submenus in the mobile menu
    const mobileMenuItems = document.querySelectorAll('#mobile-menu .has-submenu');
    
    mobileMenuItems.forEach(item => {
        const submenuToggle = item.querySelector('.submenu-toggle');
        
        if (submenuToggle) {
            submenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('hidden');
                
                // Toggle the icon rotation
                const icon = this.querySelector('svg');
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
            });
        }
    });
});
