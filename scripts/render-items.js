/**
 * Global storage for item and node data.
 * - `itemsData`: Maps item names to their metadata (e.g., image source, wiki link).
 * - `nodegroups`: Stores ordered lists of nodes as defined in sequence.json.
 */
let itemsData = {};
let nodegroups = [];

/**
 * Sanitizes a string to create a safe HTML element ID.
 * - Removes special characters.
 * - Replaces spaces with hyphens.
 * - Converts the string to lowercase.
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
 * Creates a node element representing an item.
 * - Attaches an image and title.
 * - Adds a data attribute for the item's wiki link.
 * @param {string} node - The item name.
 * @returns {HTMLElement | null} - The created node element, or null if the item data is missing.
 */
function handle_item(node) {
    let nodeDiv = document.createElement("div");
    nodeDiv.classList.add("node");

    let itemData = itemsData[node];
    if (!itemData) {
        console.warn(`Missing data for item: ${node}`);
        return null;
    }

    let img = document.createElement("img");
    img.src = itemData.imgSrc;
    img.alt = node;
    nodeDiv.title = node;
    nodeDiv.id = sanitizeId(node);
    nodeDiv.appendChild(img);
    nodeDiv.dataset.wikiLink = itemData.wikiLink;

    return nodeDiv;
}

/**
 * Creates a node element representing a skill milestone.
 * - Parses the level and skill name from a string (e.g., "69 Ranged").
 * - Generates an icon and displays the required level.
 * @param {string} node - The skill requirement (e.g., "69 Ranged").
 * @returns {HTMLElement | null} - The created node element, or null if the data is missing.
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

/**
 * Renders the progression chart using nodegroups.
 * - Iterates over node groups and creates node elements.
 * - Appends arrows between groups for visual progression.
 * - Caches the rendered chart in localStorage for faster reloads.
 * @param {HTMLElement} chartContainer - The container where the chart is rendered.
 */
function renderChart(chartContainer) {
    if (!chartContainer) {
        console.error("No valid chart container provided.");
        return;
    }

    chartContainer.innerHTML = ""; // Clear existing content

    for (let nodegroup of nodegroups) {
        let nodeGroupDiv = document.createElement("div");
        nodeGroupDiv.classList.add("node-group");

        for (let node of nodegroup) {
            let nodeDiv = !isNaN(node.charAt(0)) ? handle_skill(node) : handle_item(node);
            if (nodeDiv) nodeGroupDiv.appendChild(nodeDiv);
        }

        chartContainer.appendChild(nodeGroupDiv);

        if (nodegroup !== nodegroups[nodegroups.length - 1]) {
            let arrowDiv = document.createElement("div");
            arrowDiv.classList.add("arrow");
            arrowDiv.textContent = "→";
            chartContainer.appendChild(arrowDiv);
        }
    }

    localStorage.setItem("cachedChart", chartContainer.innerHTML); // Cache the chart for performance
}

/**
 * Initializes the chart by checking for cached content.
 * - Loads from localStorage if available.
 * - If not, fetches JSON data and renders the chart.
 * @returns {Promise<void>}
 */
async function loadChart() {
    let chartContainer = document.getElementById("chart-container");
    if (!chartContainer) {
        console.error("No element with ID 'chart-container' found.");
        return Promise.reject("Chart container not found");
    }

    let cachedChart = localStorage.getItem("cachedChart");

    if (cachedChart) {
        chartContainer.innerHTML = cachedChart;
        console.log("Cached chart found, loaded from storage.");
        return Promise.resolve();
    } else {
        console.log("No cached chart found, fetching data...");
        try {
            const [items, sequence] = await Promise.all([
                fetch("data/items.json").then(res => res.json()),
                fetch("data/sequence.json").then(res => res.json())
            ]);
            itemsData = items;
            nodegroups = Object.values(sequence);
            renderChart(chartContainer);
        } catch (error) {
            console.error("Error loading JSON:", error);
        }
    }
}

/**
 * Saves the current state of a node (green background) to localStorage.
 * @param {HTMLElement} node - The node element whose state is being saved.
 */
function saveNodeState(node) {
    let savedStates = JSON.parse(localStorage.getItem("nodeStates")) || {};
    savedStates[node.id] = node.classList.contains("green-background");
    localStorage.setItem("nodeStates", JSON.stringify(savedStates));
}

/**
 * Initializes node states and interactivity.
 * - Restores previously saved node states.
 * - Attaches click listeners to toggle the green background and save state.
 */
function initializeNodeStates() {
    let chartContainer = document.getElementById("chart-container");
    if (!chartContainer) return;

    let savedStates = JSON.parse(localStorage.getItem("nodeStates")) || {};

    chartContainer.addEventListener("click", (event) => {
        let node = event.target.closest(".node");
        if (!node) return;
        node.classList.toggle("green-background");
        saveNodeState(node);
    });

    for (let nodeId in savedStates) {
        let node = document.getElementById(nodeId);
        if (node && savedStates[nodeId]) {
            node.classList.add("green-background");
        }
    }
}

/**
 * Prevents dragging images within the chart container.
 * This ensures that images cannot be accidentally dragged around the page.
 */
function preventDragging() {
    document.querySelector("#chart-container").addEventListener("dragstart", (event) => {
        if (event.target.tagName === "IMG") {
            event.preventDefault();
        }
    });
}

/**
 * Initializes the application.
 * - Loads the chart.
 * - Initializes node states and interactions.
 * - Prevents image dragging.
 */
async function init() {
    await loadChart();
    initializeNodeStates();
    preventDragging();
}

// Start rendering when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
