/**
 * Global storage for item data loaded from items.json
 */
let itemsData = {};

/**
 * Define the sequence of node groups (each representing a step in the progression).
 * Each node group contains a list of game IDs corresponding to specific items.
 */
let nodegroup1 = [
    "1725", // Amulet of Strength
    "3105", // Climbing Boots
    "12791", // Rune Pouch
];

let nodegroup2 = [
    "12658", // Iban's Staff (u)
    "4675",  // Ancient Staff
];

let nodegroups = [nodegroup1, nodegroup2];

/**
 * Fetch item data from items.json and initiate rendering once the data is available.
 */
fetch("items.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        itemsData = data; // Store the fetched data globally
        console.log("JSON loaded:", itemsData);
        startRenderProgression();
    })
    .catch(error => console.error("Error loading JSON:", error));

/**
 * Generates and appends a chart based on the defined nodegroups.
 * The chart consists of sequentially placed node-groups, each representing a milestone.
 * Arrows are inserted between node-groups to indicate progression.
 */
function startRenderProgression() {
    // Create the main chart container
    let chartDiv = document.createElement("div");
    chartDiv.classList.add("chart");

    // Iterate over nodegroups and dynamically build the chart
    for (let nodegroup of nodegroups) {
        // Create a node-group container
        let nodeGroupDiv = document.createElement("div");
        nodeGroupDiv.classList.add("node-group");

        // Populate the node-group with individual nodes
        for (let gameID of nodegroup) {
            let nodeDiv = document.createElement("div");
            nodeDiv.classList.add("node");

            let itemData = itemsData[gameID];
            if (!itemData) {
                console.warn(`⚠️ Missing data for GameID: ${gameID}`);
                continue;
            }

            // Create an image element for the item
            let img = document.createElement("img");
            img.src = itemData.imgSrc;
            img.alt = itemData.itemName;

            // Append the image inside the node container
            nodeDiv.appendChild(img);
            nodeGroupDiv.appendChild(nodeDiv);
        }

        // Append the node-group to the chart
        chartDiv.appendChild(nodeGroupDiv);

        // Insert an arrow after the node-group unless it's the last one
        if (nodegroup !== nodegroups[nodegroups.length - 1]) {
            let arrowDiv = document.createElement("div");
            arrowDiv.classList.add("arrow");
            arrowDiv.textContent = "→";
            chartDiv.appendChild(arrowDiv);
        }
    }

    // Locate the chart container in the HTML and append the generated chart
    let chartContainer = document.getElementById("chart-container");
    if (chartContainer) {
        chartContainer.appendChild(chartDiv);
    } else {
        console.error("No element with ID 'chart-container' found in the document.");
    }
}
