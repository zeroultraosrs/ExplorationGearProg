/**
 * Global storage for item and node data.
 * - `itemsData`: Maps item names to their metadata (e.g., image source, wiki link).
 * - `nodegroups`: Stores ordered lists of nodes as defined in sequence-bare-bones.json.
 */
let itemsData = {};
let nodegroups = [];

/** Define a cache version to invalidate outdated stored charts */
const CACHE_VERSION = "1.2.1-bare-bones"; // Update this when making major changes

/**
 * Sanitizes a string to create a safe HTML element ID.
 */
function sanitizeId(name) {
    return name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
}

/**
 * Creates a node element representing an item.
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
 */
function handle_skill(node) {
    let nodeDiv = document.createElement("div");
    nodeDiv.classList.add("node");

    let parts = node.split(" ");
    let lvlNum = parts[0];
    let skillName = parts.slice(1).join(" ");
    let skillNameUppercase = skillName.charAt(0).toUpperCase() + skillName.slice(1);

    let skillDiv = document.createElement("div");
    skillDiv.classList.add("skill");

    let img = document.createElement("img");
    img.src = `/images/${skillNameUppercase}_icon.webp`;

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
 * Renders the progression chart and caches it in localStorage.
 */
function renderChart(chartContainer) {
    if (!chartContainer) {
        console.error("No valid chart container provided.");
        return;
    }

    chartContainer.innerHTML = "";

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

    localStorage.setItem("cachedChartBareBones", chartContainer.innerHTML);
    localStorage.setItem("cacheVersionBareBones", CACHE_VERSION); // Store the cache version
}

/**
 * Initializes the chart by checking for cached content.
 */
async function loadChart() {
    let chartContainer = document.getElementById("chart-container-bare-bones");
    if (!chartContainer) {
        console.error("No element with ID 'chart-container-bare-bones' found.");
        return Promise.reject("Chart container not found");
    }

    let cachedChart = localStorage.getItem("cachedChartBareBones");
    let cachedVersion = localStorage.getItem("cacheVersionBareBones");

    try {
        if (cachedChart && cachedVersion === CACHE_VERSION) {
            chartContainer.innerHTML = cachedChart;
            console.log("Cached chart loaded successfully.");
            return;
        } else {
            throw new Error("Cache outdated or missing"); // Forces a fallback
        }
    } catch (error) {
        console.warn("Cache load failed:", error);
        console.log("Fetching fresh data...");

        try {
            const [items, sequence] = await Promise.all([
                fetch("/data/items.json").then(res => res.json()),
                fetch("/data/sequence-bare-bones.json").then(res => res.json())
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
 * Saves and restores node states in localStorage.
 */
function saveNodeState(node) {
    let savedStates = JSON.parse(localStorage.getItem("sharedNodeStates")) || {}; // Use shared storage key
    savedStates[node.id] = node.classList.contains("green-background");
    localStorage.setItem("sharedNodeStates", JSON.stringify(savedStates)); // Store under shared key
}

function initializeNodeStates() {
    let chartContainer = document.getElementById("chart-container-bare-bones"); // Corrected ID for bare bones
    if (!chartContainer) return;

    let savedStates = JSON.parse(localStorage.getItem("sharedNodeStates")) || {}; // Load from shared storage

    chartContainer.addEventListener("click", (event) => {
        let node = event.target.closest(".node");
        if (!node) return;
        node.classList.toggle("green-background");
        saveNodeState(node); // Save state under shared key
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
 */
function preventDragging() {
    document.querySelector("#chart-container-bare-bones").addEventListener("dragstart", (event) => {
        if (event.target.tagName === "IMG") {
            event.preventDefault();
        }
    });
}

/**
 * Initializes the application.
 */
async function init() {
    await loadChart();
    initializeNodeStates();
    preventDragging();
}

// Start rendering when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
