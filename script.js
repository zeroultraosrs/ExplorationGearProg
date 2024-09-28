// We wrap all of our code inside an Immediately Invoked Function Expression (IIFE)
// This helps to avoid polluting the global namespace and prevents variables
// from being accessible outside of this script
(function () {
    // Initialize or load the state from localStorage
    let backgroundStates;
    try {
        // Try to parse the saved background states from localStorage
        backgroundStates = JSON.parse(localStorage.getItem('backgroundStates'));
    } catch (e) {
        // If there's an error (e.g., the data is corrupted), we set backgroundStates to null
        backgroundStates = null;
    }
    // If we couldn't load backgroundStates from localStorage, we initialize it as an empty object
    if (!backgroundStates) {
        backgroundStates = {
            skillContainers: [],
            imagesOutsideSkill: []
        };
    }

    // Function to generate attributes based on the image source
    function setImageAttributes() {
        // Select all image elements
        const images = document.querySelectorAll('img');

        images.forEach(function (img) {
            // Get the 'src' attribute value
            const src = img.getAttribute('src');

            // Extract the file name with extension
            const fileNameWithExtension = src.substring(src.lastIndexOf('/') + 1);

            // Remove the file extension
            const fileName = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));

            // Replace underscores with spaces to create a display name
            let displayName = fileName.replace(/_/g, ' ');

            // Handle special cases or adjust formatting if needed
            // For example, if the file name has multiple underscores representing spaces

            // Capitalize the first letter of each word
            displayName = displayName.replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });

            // Generate 'id' by replacing spaces with hyphens and converting to lowercase
            const id = displayName.replace(/ /g, '-').toLowerCase();

            // Set the 'alt' attribute for accessibility
            img.setAttribute('alt', displayName);

            // Set the 'title' attribute for tooltip text
            img.setAttribute('title', displayName);

            // Set the 'id' attribute for potential future use
            img.setAttribute('id', id);
        });
    }

    // Function to save the current background states to localStorage
    function saveBackgroundStates() {
        // Convert the backgroundStates object into a JSON string and save it in localStorage
        localStorage.setItem('backgroundStates', JSON.stringify(backgroundStates));
    }

    // Function to toggle the background color of an element and update its state
    function toggleBackground(element, index, type) {
        // Toggle the 'green-background' class on the element
        element.classList.toggle('green-background');

        // Update the backgroundStates object to reflect the new state
        if (element.classList.contains('green-background')) {
            backgroundStates[type][index] = 'on';
        } else {
            backgroundStates[type][index] = 'off';
        }

        // Save the updated backgroundStates object to localStorage
        saveBackgroundStates();
    }

    // When the document content is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        // Set image attributes based on their 'src'
        setImageAttributes();

        // Now that the images have their attributes set, we can select them
        // Select all elements with the 'skill' class
        const skillContainers = document.querySelectorAll('.skill');

        // Select all images outside the 'skill' containers
        const imagesOutsideSkill = document.querySelectorAll('.flex-container img:not(.skill img)');

        // Add click event listeners to each skill container
        skillContainers.forEach((container, index) => {
            // Ensure that the backgroundStates array for skillContainers is initialized at this index
            if (backgroundStates.skillContainers[index] === undefined) {
                backgroundStates.skillContainers[index] = 'off';
            }

            // Add a click event listener to the container
            container.addEventListener('click', () => {
                // When the container is clicked, toggle its background and update the state
                toggleBackground(container, index, 'skillContainers');
            });
        });

        // Add click event listeners to each image outside the skill containers
        imagesOutsideSkill.forEach((image, index) => {
            // Ensure that the backgroundStates array for imagesOutsideSkill is initialized at this index
            if (backgroundStates.imagesOutsideSkill[index] === undefined) {
                backgroundStates.imagesOutsideSkill[index] = 'off';
            }

            // Add a click event listener to the image
            image.addEventListener('click', () => {
                // When the image is clicked, toggle its background and update the state
                toggleBackground(image, index, 'imagesOutsideSkill');
            });
        });

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
    });
})();
