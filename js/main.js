/* main.js */
const defaultTheme = "super-vibrant";

/* Navbar Toggler */
const navbarToggler = document.getElementById('navbarToggler');
const navbarLinks = document.getElementById('navbarLinks');

navbarToggler.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
});

/* Dropdown Menu */
const themeDropdown = document.getElementById('themeDropdown');
const themeDropdownMenu = document.getElementById('themeDropdownMenu');

themeDropdown.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to window
    themeDropdownMenu.classList.toggle('active');
});

/* Close Dropdown When Clicking Outside */
window.addEventListener('click', (e) => {
    if (!themeDropdown.contains(e.target) && !themeDropdownMenu.contains(e.target)) {
        themeDropdownMenu.classList.remove('active');
    }
});

/* Accordion Functionality */
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`${id}Icon`);

    content.classList.toggle('active');
    if (content.classList.contains('active')) {
        icon.textContent = '-';
    } else {
        icon.textContent = '+';
    }

    // Close other accordions if open
    const allContents = document.querySelectorAll('.accordion-content');
    allContents.forEach((item) => {
        if (item.id !== id && item.classList.contains('active')) {
            item.classList.remove('active');
            const otherIcon = document.getElementById(`${item.id}Icon`);
            if (otherIcon) otherIcon.textContent = '+';
        }
    });
}

/* Theme Switcher */
function setTheme(themeName) {
    // Remove existing theme classes
    const themes = ['dark-mode-1', 'dark-mode-2', 'dark-mode-3', 'cyberpunk-1', 'cyberpunk-2', 'cyberpunk-3',
        'emerald-glow', 'electric-indigo', 'crimson-ember', 'super-vibrant'
    ];
    themes.forEach((theme) => {
        document.body.classList.remove(theme);
    });

    if (themeName) {
        document.body.classList.add(themeName);
        localStorage.setItem('theme', themeName);
    } else {
        localStorage.removeItem('theme');
    }

    // Close the dropdown after selecting a theme
    themeDropdownMenu.classList.remove('active');
}

/* Apply Saved Theme on Page Load */
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
    else{
        setTheme(`${defaultTheme}`);
    }
});