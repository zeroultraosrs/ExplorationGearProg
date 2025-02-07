document.addEventListener("DOMContentLoaded", () => {
    // Create menu container
    const contextMenu = document.createElement("div");
    contextMenu.id = "context-menu";

    // Title element
    const menuTitle = document.createElement("div");
    menuTitle.id = "menu-title";
    contextMenu.appendChild(menuTitle);

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";

    // Wiki button configuration
    const wikiButton = document.createElement("button");
    wikiButton.id = "wiki-button";
    wikiButton.classList.add("menu-button");

    // Create spans for colored text
    const whiteText = document.createElement("span");
    whiteText.classList.add("left-text");
    whiteText.textContent = "Go to ";

    const orangeText = document.createElement("span");
    orangeText.classList.add("right-text");
    orangeText.textContent = "Wiki";

    wikiButton.appendChild(whiteText);
    wikiButton.appendChild(orangeText);
    buttonContainer.appendChild(wikiButton);

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.id = "cancel-button";
    cancelButton.classList.add("menu-button");

    const cancelText = document.createElement("span");
    cancelText.classList.add("left-text"); // Only uses white text
    cancelText.textContent = "Cancel";

    cancelButton.appendChild(cancelText);
    buttonContainer.appendChild(cancelButton);

    // Append button container to menu
    contextMenu.appendChild(buttonContainer);

    // Add menu to the body
    document.body.appendChild(contextMenu);

    // Right-click event to show menu
    document.addEventListener("contextmenu", (event) => {
        let node = event.target.closest(".node");
        if (!node) return;

        event.preventDefault(); // Prevent default browser menu

        menuTitle.textContent = node.title || "Unknown Item";

        let wikiLink = node.dataset.wikiLink;
        if (!wikiLink) {
            console.log("wikiLink not found.");
        }

        // Set wiki button behavior
        wikiButton.style.display = "block";
        wikiButton.onclick = () => {
            window.open(wikiLink, "_blank");
            contextMenu.style.display = "none";
        };

        // Set cancel button behavior
        cancelButton.style.display = "block";
        cancelButton.onclick = () => {
            contextMenu.style.display = "none";
        };

        // Position and show menu
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = "block";
    });

    // Click outside closes menu
    document.addEventListener("click", (event) => {
        if (!contextMenu.contains(event.target)) {
            contextMenu.style.display = "none";
        }
    });
});
