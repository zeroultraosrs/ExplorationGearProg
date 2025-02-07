/**
 * Global storage for item data loaded from items.json
 */
let itemsData = {};
let nodegroups = [];
let itemStates = {};


/**
 * Fetch item data from items.json and initiate rendering once the data is available.
 */

Promise.all([
    fetch("items.json").then(res => res.json()),
    fetch("sequence.json").then(res => res.json()),
    fetch("state.json").then(res => res.json())
])
    .then(([items, sequence, state]) => {
        itemsData = items;
        itemStates = state;
        nodegroups = Object.values(sequence); // Extract values in order
        console.log("JSON loaded:", itemsData, nodegroups);
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
        for (let node of nodegroup) {
            let nodeDiv = document.createElement("div");
            nodeDiv.classList.add("node");
            console.log(sanitizeId(node));
            if (!isNaN(node.charAt(0))) {
                // if string started with number, then this means its on the form "<number> <skill>"
                handle_skill(nodeDiv, node);
            }
            else {
                // string is an item name
                handle_item(nodeDiv, node);
            }
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

function handle_item(nodeDiv, node) {
    let itemData = itemsData[node];
    if (!itemData) {
        console.warn(`Missing data for item: ${node}`);
        return;
    }
    // Create an image element for the item
    let img = document.createElement("img");
    img.src = itemData.imgSrc;
    img.alt = node;
    nodeDiv.title = node;
    // Append the image inside the node container
    if (itemStates[node] === 1) {
        nodeDiv.style.backgroundColor = "green";
    }
    nodeDiv.id = sanitizeId(node);
    nodeDiv.appendChild(img);
}

function handle_skill(nodeDiv, node) {
    // Expected format of node: "69 ranged"
    let parts = node.split(" "); // Split string into parts
    let lvlNum = parts[0]; // Extract the number part
    let skillName = parts.slice(1).join(" "); // Extract the skill name
    let skillNameUppercase = skillName.charAt(0).toUpperCase() + skillName.slice(1); // Capitalize first letter

    // Create skill container
    let skillDiv = document.createElement("div");
    skillDiv.classList.add("skill");

    // Create image element
    let img = document.createElement("img");
    img.src = `images/${skillNameUppercase}_icon.webp`;

    // Create span for level number
    let span = document.createElement("span");
    span.textContent = lvlNum;

    // Append elements
    skillDiv.appendChild(img);
    skillDiv.appendChild(span);
    nodeDiv.alt = `Get ${lvlNum} ${skillName}`;
    nodeDiv.title = `Get ${lvlNum} ${skillName}`;
    nodeDiv.id = "lvl-" + sanitizeId(node);
    nodeDiv.appendChild(skillDiv);
}

function sanitizeId(name) {
    return name
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .toLowerCase();           // Convert to lowercase
}