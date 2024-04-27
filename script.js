// Get the parent element that contains all the images
// Get all elements with the "skill" class
var skillContainers = document.querySelectorAll(".skill");

// Add click event listener to each skill container
skillContainers.forEach(function (container, index) {
    container.addEventListener("click", function (event) {
        // Toggle the "green-background" class on the clicked skill container
        container.classList.toggle("green-background");
        // Save item background in local storage
        localStorage.setItem('containerIndex' + index, container.classList.contains('green-background') ? "on" : "off");
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
        localStorage.setItem('imageIndex' + index, image.classList.contains('green-background') ? "on" : "off");
    });
});

// Set item backgrounds on load
window.onload = function() {
    skillContainers.forEach((container, index) => {
        const background = localStorage.getItem('containerIndex' + index);
        if (background == "on") {
            container.classList.add('green-background');
        } else {
            container.classList.remove('green-background');
        }
    });
    imagesOutsideSkill.forEach((image, index) => {
        const background = localStorage.getItem('imageIndex' + index);
        if (background == "on") {
            image.classList.add('green-background');
        } else {
            image.classList.remove('green-background');
        }
    });
}