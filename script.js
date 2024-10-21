// Wrap your code in an IIFE to avoid polluting the global namespace
(function () {
    // Declare variables that will be used across functions
    // let backgroundStates = {
    //     skillContainers: [],
    //     imagesOutsideSkill: []
    // };
    let backgroundStates = {};

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
        console.log('darkModeToggle:', darkModeToggle); // Add this line
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
        skillContainers.forEach((container) => {
            container.addEventListener('click', () => {
                toggleBackground(container);
            });
        });

        // Bind click events for images outside skill containers
        imagesOutsideSkill.forEach((image) => {
            image.addEventListener('click', () => {
                toggleBackground(image);
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
        skillContainers.forEach((container) => {
            const id = container.id;
            if (backgroundStates[id] === 'on') {
                container.classList.add('green-background');
            } else {
                container.classList.remove('green-background');
            }
        });

        // Restore background states for images outside skill containers
        imagesOutsideSkill.forEach((image) => {
            const id = image.id;
            if (backgroundStates[id] === 'on') {
                image.classList.add('green-background');
            } else {
                image.classList.remove('green-background');
            }
        });
    }

    // Function to toggle the background color of an element and update its state
    function toggleBackground(element) {
        element.classList.toggle('green-background');
        const id = element.id;
        if (!id) {
            console.warn('Element does not have an ID:', element);
            return;
        }
        backgroundStates[id] = element.classList.contains('green-background') ? 'on' : 'off';
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
        let darkMode = localStorage.getItem('darkMode');
        if (!darkMode) {
            darkMode = 'enabled'; // Set dark mode as the default
            localStorage.setItem('darkMode', 'enabled');
        }
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
