// Global Variables
let currentCharts = []; // Hold the references to active charts
const chartTypeSelect = document.getElementById('chartType'); // Dropdown for selecting chart type

// Function to load and parse the CSV file
async function loadAndParseCSV() {
    try {
        const response = await fetch('http://localhost:8000/IOT_received_dataset.csv'); // Update this URL to your actual CSV location
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const csvData = await response.text();
        const parsedData = parseCSV(csvData);
        updateCharts(parsedData, chartTypeSelect.value); // Update charts based on selected type
    } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
    }
}

// Parse CSV data
function parseCSV(csvData) {
    const rows = csvData.split('\n');
    const temperature1 = [];
    const humidity1 = [];
    const temperature2 = [];
    const humidity2 = [];

    rows.forEach((row, index) => {
        const cols = row.split(',');
        if (index > 0 && cols.length >= 4) { // Skip header and ensure enough columns
            temperature1.push(parseFloat(cols[0]));
            humidity1.push(parseFloat(cols[1]));
            temperature2.push(parseFloat(cols[2]));
            humidity2.push(parseFloat(cols[3]));
        }
    });

    return { temperature1, humidity1, temperature2, humidity2 };
}

// Update or create charts dynamically
function updateCharts(data, chartType) {
    // Destroy existing charts
    currentCharts.forEach(chart => chart.destroy());
    currentCharts = []; // Clear the array

    if (chartType === 'pie') {
        drawPieCharts(data);
    } else {
        drawLineOrBarCharts(chartType, data);
    }
}

// Function to draw line or bar charts
function drawLineOrBarCharts(chartType, data) {
    const chart1Ctx = document.getElementById('chart1').getContext('2d');
    const chart2Ctx = document.getElementById('chart2').getContext('2d');

    const animationOptions = {
        duration: 1000, // 1 second animation duration
        easing: 'easeInOutCubic', // Smooth easing effect
    };

    const chart1 = new Chart(chart1Ctx, {
        type: chartType,
        data: {
            labels: data.temperature1,
            datasets: [{
                label: 'Humidity 1',
                data: data.humidity1,
                backgroundColor: chartType === 'bar' ? '#36A2EB' : 'rgba(0,0,0,0)',
                borderColor: '#36A2EB',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature 1 vs Humidity 1',
                },
            },
            animation: animationOptions, // Add animation options
            scales: {
                x: { title: { display: true, text: 'Temperature 1' } },
                y: { title: { display: true, text: 'Humidity 1' } },
            },
        },
    });

    const chart2 = new Chart(chart2Ctx, {
        type: chartType,
        data: {
            labels: data.temperature2,
            datasets: [{
                label: 'Humidity 2',
                data: data.humidity2,
                backgroundColor: chartType === 'bar' ? '#FF6384' : 'rgba(0,0,0,0)',
                borderColor: '#FF6384',
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperature 2 vs Humidity 2',
                },
            },
            animation: animationOptions, // Add animation options
            scales: {
                x: { title: { display: true, text: 'Temperature 2' } },
                y: { title: { display: true, text: 'Humidity 2' } },
            },
        },
    });

    currentCharts.push(chart1, chart2);
}

// Function to draw pie charts
function drawPieCharts(data) {
    const chart1Ctx = document.getElementById('chart1').getContext('2d');
    const chart2Ctx = document.getElementById('chart2').getContext('2d');

    const chart1 = new Chart(chart1Ctx, {
        type: 'pie',
        data: {
            labels: ['Temperature 1', 'Humidity 1'],
            datasets: [{
                data: [
                    data.temperature1.reduce((a, b) => a + b, 0),
                    data.humidity1.reduce((a, b) => a + b, 0)
                ],
                backgroundColor: ['#FF6384', '#36A2EB'],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparison of Temperature 1 and Humidity 1',
                },
            },
        },
    });

    const chart2 = new Chart(chart2Ctx, {
        type: 'pie',
        data: {
            labels: ['Temperature 2', 'Humidity 2'],
            datasets: [{
                data: [
                    data.temperature2.reduce((a, b) => a + b, 0),
                    data.humidity2.reduce((a, b) => a + b, 0)
                ],
                backgroundColor: ['#FF9F40', '#4BC0C0'],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparison of Temperature 2 and Humidity 2',
                },
            },
        },
    });

    currentCharts.push(chart1, chart2);
}

// Event listener for chart type change
chartTypeSelect.addEventListener('change', () => {
    loadAndParseCSV(); // Reload the graph with the new chart type
});

// Fetch data every 5 seconds
setInterval(loadAndParseCSV, 5000);

// Initial load
loadAndParseCSV();
