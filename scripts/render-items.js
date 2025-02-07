/**
 * Global storage for item data loaded from items.json
*/
let itemsData = {};
let nodegroups = [];

function sanitizeId(name) {
    return name
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .toLowerCase();           // Convert to lowercase
}

function handle_item(node) {
    let nodeDiv = document.createElement("div");
    nodeDiv.classList.add("node");
    let itemData = itemsData[node];
    if (!itemData) {
        console.warn(`Missing data for item: ${node}`);
        return null;
    }
    nodeDiv.dataset.wikiLink = itemData.wikiLink;
    // Create an image element for the item
    let img = document.createElement("img");
    img.src = itemData.imgSrc;
    img.alt = node;
    nodeDiv.title = node;
    nodeDiv.id = sanitizeId(node);
    nodeDiv.appendChild(img);
    return nodeDiv;
}

function handle_skill(node) {
    let nodeDiv = document.createElement("div");
    nodeDiv.classList.add("node");

    let itemData = itemsData[node];
    if (!itemData) {
        console.warn(`Missing data for item: ${node}`);
        return null;
    }
    nodeDiv.dataset.wikiLink = itemsData.wikiLink;

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
    return nodeDiv;
}


function renderChart(chartContainer) {
    if (!chartContainer) {
        console.error("No valid chart container provided.");
        return;
    }
    // Clear chartContainer before appending new elements
    chartContainer.innerHTML = "";

    // Iterate over nodegroups and dynamically build the chart
    for (let nodegroup of nodegroups) {
        let nodeGroupDiv = document.createElement("div");
        nodeGroupDiv.classList.add("node-group");

        for (let node of nodegroup) {
            let nodeDiv = !isNaN(node.charAt(0)) ? handle_skill(node) : handle_item(node);
            if (nodeDiv) {
                nodeGroupDiv.appendChild(nodeDiv);
            }
        }

        chartContainer.appendChild(nodeGroupDiv);

        if (nodegroup !== nodegroups[nodegroups.length - 1]) {
            let arrowDiv = document.createElement("div");
            arrowDiv.classList.add("arrow");
            arrowDiv.textContent = "→";
            chartContainer.appendChild(arrowDiv);
        }
    }
    // Store rendered chart in localStorage for future use
    localStorage.setItem("cachedChart", chartContainer.innerHTML);
}

function loadChart() {
    let chartContainer = document.getElementById("chart-container");
    if (!chartContainer) {
        console.error("No element with ID 'chart-container' found.");
    }

    let cachedChart = localStorage.getItem("cachedChart");


    if (!cachedChart) {
        chartContainer.innerHTML = cachedChart;
        console.log("Cached chart found.")
    } else {
        console.log("No cached chart found, rendering new one...");

        // Fetch nescesary data before rendering
        Promise.all([
            fetch("data/items.json").then(res => res.json()),
            fetch("data/sequence.json").then(res => res.json())
        ])
            .then(([items, sequence]) => {
                itemsData = items;
                nodegroups = Object.values(sequence);
                renderChart(chartContainer);
            })
            .catch(error => console.error("Error loading JSON:", error));
    }
}

document.addEventListener("DOMContentLoaded", loadChart);
