// Get the parent element that contains all the images
var imagesContainer = document.querySelector(".flex-container");

// Add click event listener to the parent element
imagesContainer.addEventListener("click", function (event) {
    // Check if the clicked element is an image
    console.log("Clicked element:", event.target);
    if (event.target.tagName === "IMG" || event.target.classList.contains("skill")) {
        // Toggle the "green-background" class on the clicked image
        event.target.classList.toggle("green-background");
    }
});
