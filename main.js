
function parseCSVFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');

        const timeIndex = headers.findIndex(h => h.toLowerCase().includes('date') || h.toLowerCase().includes('time'));
        const openIndex = headers.findIndex(h => h.toLowerCase().includes('open'));
        const highIndex = headers.findIndex(h => h.toLowerCase().includes('high'));
        const lowIndex = headers.findIndex(h => h.toLowerCase().includes('low'));
        const closeIndex = headers.findIndex(h => h.toLowerCase().includes('close'));

        const candlestick = [];
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            candlestick.push({
                time: Math.floor(new Date(row[timeIndex]).getTime() / 1000),
                open: parseFloat(row[openIndex]),
                high: parseFloat(row[highIndex]),
                low: parseFloat(row[lowIndex]),
                close: parseFloat(row[closeIndex]),
            });
        }
        callback(candlestick);
    };
    reader.readAsText(file);
}

const chart = LightweightCharts.createChart(document.getElementById('chart'), {
    width: document.getElementById('chart').clientWidth,
    height: 500,
    layout: { background: { type: 'solid', color: '#ffffff' }, textColor: '#000' },
});

const candlestickSeries = chart.addCandlestickSeries();

document.getElementById('csvFile').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        parseCSVFile(file, candlestickData => {
            candlestickSeries.setData(candlestickData);
        });
    }
});
