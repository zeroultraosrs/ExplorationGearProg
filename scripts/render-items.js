/**
 * Global storage for item data loaded from items.json.
 * - `itemsData`: Maps item names to their metadata (image, wiki link, etc.).
 * - `nodegroups`: Stores ordered lists of nodes as defined in sequence.json.
 */
let itemsData = {};
let nodegroups = [];

/**
 * Sanitizes a string to create a safe HTML element ID.
 * - Removes special characters.
 * - Replaces spaces with hyphens.
 * - Converts to lowercase.
 * @param {string} name - The string to sanitize.
 * @returns {string} - The sanitized ID.
 */
function sanitizeId(name) {
    return name
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .toLowerCase();           // Convert to lowercase
}

/**
 * Creates a node element for an item.
 * - Attaches an image and title.
 * - Adds a data attribute for the wiki link.
 * @param {string} node - The item name.
 * @returns {HTMLElement | null} - The created node div, or null if data is missing.
 */
function handle_item(node) {
    let nodeDiv = document.createElement("div");
    nodeDiv.classList.add("node");


    let itemData = itemsData[node];
    if (!itemData) {
        console.warn(`Missing data for item: ${node}`);
        return null;
    }

    nodeDiv.dataset.wikiLink = itemData.wikiLink;

    let img = document.createElement("img");
    img.src = itemData.imgSrc;
    img.alt = node;
    nodeDiv.title = node;
    nodeDiv.id = sanitizeId(node);
    nodeDiv.appendChild(img);
    return nodeDiv;
}

/**
 * Creates a node element for a skill milestone.
 * - Extracts level and skill name from the string format: "69 ranged".
 * - Generates an icon and displays the level.
 * @param {string} node - The skill requirement (e.g., "69 Ranged").
 * @returns {HTMLElement | null} - The created node div, or null if data is missing.
 */
function handle_skill(node) {
    let nodeDiv = document.createElement("div");
    nodeDiv.classList.add("node");

    let parts = node.split(" "); // Split into level and skill name
    let lvlNum = parts[0];
    let skillName = parts.slice(1).join(" ");
    let skillNameUppercase = skillName.charAt(0).toUpperCase() + skillName.slice(1);

    let skillDiv = document.createElement("div");
    skillDiv.classList.add("skill");

    let img = document.createElement("img");
    img.src = `images/${skillNameUppercase}_icon.webp`;

    let span = document.createElement("span");
    span.textContent = lvlNum;

    skillDiv.appendChild(img);
    skillDiv.appendChild(span);
    nodeDiv.alt = `Get ${lvlNum} ${skillName}`;
    nodeDiv.title = `Get ${lvlNum} ${skillName}`;
    nodeDiv.id = "lvl-" + sanitizeId(node);
    nodeDiv.appendChild(skillDiv);
    return nodeDiv;
}

function enableNodeInteractivity(chartContainer) {
    if (!chartContainer) {
        console.error("No valid chart container provided.");
        return;
    }

    chartContainer.addEventListener("click", (event) => {
        let node = event.target.closest(".node");
        if (!node) return;

        // Toggle green background
        if (node.classList.contains("green-background")) {
            node.classList.remove("green-background");
            localStorage.setItem(node.id, "off");
        } else {
            node.classList.add("green-background");
            localStorage.setItem(node.id, "on");
        }
    });
    return chartContainer; // Optional, for consistency if needed
}


/**
 * Renders the progression chart using nodegroups.
 * - Iterates over node groups and creates node elements.
 * - Appends arrows between groups for visual progression.
 * - Stores the rendered chart in localStorage for quick reloads.
 * @param {HTMLElement} chartContainer - The container where the chart is rendered.
 */
function renderChart(chartContainer) {
    if (!chartContainer) {
        console.error("No valid chart container provided.");
        return;
    }

    chartContainer.innerHTML = ""; // Clear any existing content

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
    enableNodeInteractivity(chartContainer);
    // Cache the chart for performance
    localStorage.setItem("cachedChart", chartContainer.innerHTML);
}

/**
 * Initializes the chart.
 * - Checks if a cached version exists in localStorage.
 * - If cached, loads from localStorage instead of fetching.
 * - If no cache exists, fetches required JSON files and renders the chart.
 */
function loadChart() {
    let chartContainer = document.getElementById("chart-container");
    if (!chartContainer) {
        console.error("No element with ID 'chart-container' found.");
        return;
    }

    let cachedChart = localStorage.getItem("cachedChart");

    if (cachedChart) {
        chartContainer.innerHTML = cachedChart;
        attachNodeListeners();
        restoreNodeStates();
        console.log("Cached chart found, loaded from storage.");
    } else {
        console.log("No cached chart found, fetching data...");

        Promise.all([
            fetch("data/items.json").then(res => res.json()),
            fetch("data/sequence.json").then(res => res.json())
        ])
            .then(([items, sequence]) => {
                itemsData = items;
                nodegroups = Object.values(sequence);
                renderChart(chartContainer);
                attachNodeListeners();
                restoreNodeStates();
            })
            .catch(error => console.error("Error loading JSON:", error));
    }
}


/**
 * Attaches event listeners to nodes for interactive behavior.
 * - Uses event delegation for efficient handling.
 */
function attachNodeListeners() {
    let chartContainer = document.getElementById("chart-container");
    if (!chartContainer) return;

    chartContainer.addEventListener("click", (event) => {
        let node = event.target.closest(".node");
        if (!node) return;

        node.classList.toggle("green-background");
        saveNodeState(node);
    });
}

/**
 * Saves the state of a node to localStorage.
 */
function saveNodeState(node) {
    let savedStates = JSON.parse(localStorage.getItem("nodeStates")) || {};
    savedStates[node.id] = node.classList.contains("green-background");
    localStorage.setItem("nodeStates", JSON.stringify(savedStates));
}

/**
 * Restores previously saved node states on page load.
 */
function restoreNodeStates() {
    let savedStates = JSON.parse(localStorage.getItem("nodeStates")) || {};

    for (let nodeId in savedStates) {
        let node = document.getElementById(nodeId);
        if (node && savedStates[nodeId]) {
            node.classList.add("green-background");
        }
    }
}

// Start rendering when the page is loaded
document.addEventListener("DOMContentLoaded", loadChart);
