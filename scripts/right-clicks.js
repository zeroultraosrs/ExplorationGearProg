document.addEventListener("DOMContentLoaded", () => {
    // create and append menu on page load
    const contextMenu = document.createElement("div");
    contextMenu.id = "custom-context-menu";


    // title element
    const menuTitle = document.createElement("div");

    contextMenu.appendChild(menuTitle); // Add title to the menu

    const wikiButton = document.createElement("button");
    wikiButton.id = "wiki-button";

    // Create spans for different colors
    const whiteText = document.createElement("span");
    whiteText.classList.add("white-text");
    whiteText.textContent = "Go to ";

    const orangeText = document.createElement("span");
    orangeText.classList.add("orange-text");
    orangeText.textContent = "Wiki";

    // Append spans to button
    wikiButton.appendChild(whiteText);
    wikiButton.appendChild(orangeText);

    contextMenu.appendChild(wikiButton); // Add button to menu

    document.body.appendChild(contextMenu); // Add the menu to the page


    // Right click on node opens menu
    document.addEventListener("contextmenu", (event) => {
        let node = event.target.closest(".node");
        if (!node) return;

        event.preventDefault(); // Prevent default browser menu

        menuTitle.textContent = node.title || "Unknown Item";

        let wikiLink = node.dataset.wikiLink;
        console.log("Wiki Link:", node.dataset.wikiLink);
        if (wikiLink) {
            wikiButton.style.display = "block"; // Show button if a wiki link exists
            wikiButton.onclick = () => {
                window.open(wikiLink, "_blank"); // Open in a new tab
                contextMenu.style.display = "none"; // Hide menu after click
            };
        } else {
            wikiButton.style.display = "none"; // Hide button if no link
            console.log("wikiLink not found")
        }


        // Position and display the menu
        contextMenu.style.top = `${event.pageY}px`;
        contextMenu.style.left = `${event.pageX}px`;
        contextMenu.style.display = "block";
    });
    // click closes menu
    document.addEventListener("click", (event) => {
        // If the click was **not** inside the menu, hide it
        if (!contextMenu.contains(event.target)) {
            contextMenu.style.display = "none";
        }
    });
})