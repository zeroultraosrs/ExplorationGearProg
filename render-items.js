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

            if (Array.isArray(node)) {
                // 
                handle_skill(nodeGroupDiv, nodeDiv, node);
            }
            else {
                let itemName = node;
                nodeDiv.id = itemName;
                let itemData = itemsData[itemName];
                if (!itemData) {
                    console.warn(`Missing data for item: ${itemName}`);
                    continue;
                }

                // Create an image element for the item
                let img = document.createElement("img");
                img.src = itemData.imgSrc;
                img.alt = itemName;
                img.title = itemName;
                if (itemStates[itemName] === 1) {
                    img.style.backgroundColor = "green";
                }
            }



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


function handle_skill(nodeGroupDiv, nodeDiv, node) {
    let lvlNum = node[0];
    let skillName = node[1];
    let skillDiv = document.createElement("div");
    skillDiv.classList.add("skill");
    let img = document.createElement("img");
    img.src = `images/${skillName}_icon.webp`;
    skillDiv.appendChild(img);
    skillDiv.

}