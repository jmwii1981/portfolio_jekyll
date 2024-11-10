export async function loadSvgIcon(svgUrl, containerId) {
    try {
        const response = await fetch(svgUrl);
        if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.statusText}`);

        const svgIcon = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = svgIcon;
        } else {
            console.warn(`Container with ID '${containerId}' not found.`);
        }
    } catch (error) {
        console.error("Error loading SVG:", error);
    }
}
