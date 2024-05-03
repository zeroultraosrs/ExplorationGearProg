// Get the parent element that contains all the images
// Get all elements with the "skill" class
var skillContainers = document.querySelectorAll(".skill");

// Add click event listener to each skill container
skillContainers.forEach(function (container, index) {
    container.addEventListener("click", function (event) {
        // Toggle the "green-background" class on the clicked skill container
        container.classList.toggle("green-background");
        // Save item background in local storage
        backgroundStates.skillContainers[index] = container.classList.contains('green-background') ? "on" : "off";
        localStorage.setItem('backgroundStates', JSON.stringify(backgroundStates));
    });
});

// Get all images outside the "skill" containers
var imagesOutsideSkill = document.querySelectorAll(".flex-container img:not(.skill img)");

// Add click event listener to each image outside the "skill" containers
imagesOutsideSkill.forEach(function (image, index) {
    image.addEventListener("click", function (event) {
        // Toggle the "green-background" class on the clicked image
        image.classList.toggle("green-background");
        // Save item background in local storage
        backgroundStates.imagesOutsideSkill[index] = image.classList.contains('green-background') ? "on" : "off";
        localStorage.setItem('backgroundStates', JSON.stringify(backgroundStates));
    });
});

// Initialize or load the state from localStorage
var savedBackgroundStates = JSON.parse(localStorage.getItem('backgroundStates'));
var backgroundStates = savedBackgroundStates || { skillContainers: [], imagesOutsideSkill: [] };

document.addEventListener('DOMContentLoaded', function() {
    // Set item backgrounds on load
    skillContainers.forEach((container, index) => {
        if (backgroundStates.skillContainers[index] === "on") {
            container.classList.add('green-background');
        } else {
            container.classList.remove('green-background');
        }
    });
    imagesOutsideSkill.forEach((image, index) => {
        if (backgroundStates.imagesOutsideSkill[index] === "on") {
            image.classList.add('green-background');
        } else {
            image.classList.remove('green-background');
        }
    });
});