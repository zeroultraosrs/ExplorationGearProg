// Wrap your code in an IIFE to avoid polluting the global namespace
(function () {
    // Declare variables that will be used across functions
    let backgroundStates = {
        skillContainers: [],
        imagesOutsideSkill: []
    };
    let skillContainers;
    let imagesOutsideSkill;
    let darkModeToggle;

    // Function to initialize the application
    function init() {
        setImageAttributes();
        cacheDOMElements();
        loadStates();
        bindEvents();
        restoreStates();
        loadDarkMode();
    }

    // Function to set 'alt', 'title', and 'id' attributes based on the image 'src'
    function setImageAttributes() {
        const images = document.querySelectorAll('img');

        images.forEach(function (img) {
            const src = img.getAttribute('src');
            const fileNameWithExtension = src.substring(src.lastIndexOf('/') + 1);
            const fileName = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));
            let displayName = fileName.replace(/_/g, ' ');
            displayName = displayName.replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });
            const id = displayName.replace(/ /g, '-').toLowerCase();

            img.setAttribute('alt', displayName);
            img.setAttribute('title', displayName);
            img.setAttribute('id', id);
        });
    }

    // Function to cache frequently accessed DOM elements
    function cacheDOMElements() {
        skillContainers = document.querySelectorAll('.skill');
        imagesOutsideSkill = document.querySelectorAll('.flex-container img:not(.skill img)');
        darkModeToggle = document.getElementById('dark-mode-toggle');
    }

    // Function to load background and dark mode states from localStorage
    function loadStates() {
        // Load background states
        try {
            const savedBackgroundStates = JSON.parse(localStorage.getItem('backgroundStates'));
            if (savedBackgroundStates) {
                backgroundStates = savedBackgroundStates;
            }
        } catch (e) {
            console.error('Error parsing background states from localStorage:', e);
        }

        // Load dark mode state
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = 'Disable Dark Mode';
        } else {
            if (darkModeToggle) darkModeToggle.textContent = 'Enable Dark Mode';
        }
    }

    // Function to bind event listeners
    function bindEvents() {
        // Bind click events for skill containers
        skillContainers.forEach((container, index) => {
            container.addEventListener('click', () => {
                toggleBackground(container, index, 'skillContainers');
            });
        });

        // Bind click events for images outside skill containers
        imagesOutsideSkill.forEach((image, index) => {
            image.addEventListener('click', () => {
                toggleBackground(image, index, 'imagesOutsideSkill');
            });
            image.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        });

        // Bind dark mode toggle event
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }
    }

    // Function to restore background states
    function restoreStates() {
        // Restore background states for skill containers
        skillContainers.forEach((container, index) => {
            if (backgroundStates.skillContainers[index] === 'on') {
                container.classList.add('green-background');
            } else {
                container.classList.remove('green-background');
            }
        });

        // Restore background states for images outside skill containers
        imagesOutsideSkill.forEach((image, index) => {
            if (backgroundStates.imagesOutsideSkill[index] === 'on') {
                image.classList.add('green-background');
            } else {
                image.classList.remove('green-background');
            }
        });
    }

    // Function to toggle the background color of an element and update its state
    function toggleBackground(element, index, type) {
        element.classList.toggle('green-background');

        if (element.classList.contains('green-background')) {
            backgroundStates[type][index] = 'on';
        } else {
            backgroundStates[type][index] = 'off';
        }

        saveBackgroundStates();
    }

    // Function to save the current background states to localStorage
    function saveBackgroundStates() {
        localStorage.setItem('backgroundStates', JSON.stringify(backgroundStates));
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Disable Dark Mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeToggle.textContent = 'Enable Dark Mode';
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // Function to load dark mode state
    function loadDarkMode() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.textContent = 'Disable Dark Mode';
        } else {
            if (darkModeToggle) darkModeToggle.textContent = 'Enable Dark Mode';
        }
    }

    // Initialize the application when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
})();
