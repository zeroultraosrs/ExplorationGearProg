// Get the parent element that contains all the images
// Get all elements with the "skill" class
var skillContainers = document.querySelectorAll(".skill");

// Add click event listener to each skill container
skillContainers.forEach(function (container) {
    container.addEventListener("click", function (event) {
        // Toggle the "green-background" class on the clicked skill container
        container.classList.toggle("green-background");
    });
});

// Get all images outside the "skill" containers
var imagesOutsideSkill = document.querySelectorAll(".flex-container img:not(.skill img)");

// Add click event listener to each image outside the "skill" containers
imagesOutsideSkill.forEach(function (image) {
    image.addEventListener("click", function (event) {
        // Toggle the "green-background" class on the clicked image
        image.classList.toggle("green-background");
    });
});