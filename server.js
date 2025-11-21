const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/components', express.static(path.join(__dirname, 'public/components')));

// Mock data generator for Grafana-like response
function generateMockData(from, to, payload) {
    const fromTime = new Date(from).getTime();
    const toTime = new Date(to).getTime();
    const step = (toTime - fromTime) / 100; // 100 data points

    const timestamps = [];
    const values = [];

    let seriesName = "Mock Series";
    let expr = "";

    // Extract the expression from the payload
    if (payload && payload.targets && payload.targets.length > 0 && payload.targets[0].expr) {
        expr = payload.targets[0].expr;
        seriesName = expr; // Use the friendly name from the payload as the series name
    }

    let randomWalkValue = 50;
    let dbConnections = 20;

    for (let i = 0; i < 100; i++) {
        const t = fromTime + i * step;
        timestamps.push(t);
        let val;

        // Generate data based on the friendly name (expression)
        switch (expr) {
            case "HTTP Requests":
            case "Correlated Wave":
                // Sine wave for rate
                val = 50 + 20 * Math.sin(i * 0.1) + (Math.random() * 5);
                break;
            case "Inverted Wave":
                // Inverted sine wave for negative correlation
                val = 50 - 20 * Math.sin(i * 0.1) + (Math.random() * 5);
                break;
            case "Request Latency":
                // Latency-like spikes
                val = 0.1 + (Math.random() * 0.05);
                if (Math.random() > 0.9) {
                    val += Math.random() * 0.4;
                }
                break;
            case "Users Online":
                // Random walk for low correlation
                randomWalkValue += (Math.random() - 0.5) * 10;
                val = randomWalkValue;
                break;
            case "CPU Usage":
                // CPU usage, correlated with http requests
                val = 40 + 20 * Math.sin(i * 0.1) + (Math.random() * 10);
                break;
            case "RAM Usage":
                // Memory usage, slowly increasing
                val = 8 + (i / 100) * 4 + (Math.random() - 0.5);
                break;
            case "DB Connections":
                // DB connections, fluctuating
                dbConnections += (Math.random() - 0.5) * 3;
                dbConnections = Math.max(5, Math.min(40, dbConnections));
                val = dbConnections;
                break;
            case "DB Latency":
                // DB latency, occasional spikes
                val = 50 + (Math.random() * 10);
                if (Math.random() > 0.95) {
                    val += Math.random() * 100;
                }
                break;
            default:
                // If the expression doesn't match, generate generic random data.
                // The name will be "Mock Series" only if the payload was invalid.
                val = Math.random() * 100;
                break;
        }
        values.push(val);
    }

    return {
        results: {
            A: {
                frames: [
                    {
                        schema: {
                            name: seriesName,
                            fields: [
                                { name: "Time", type: "time" },
                                { name: "Value", type: "number" }
                            ]
                        },
                        data: {
                            values: [
                                timestamps,
                                values
                            ]
                        }
                    }
                ]
            }
        }
    };
}

app.post('/run-request', (req, res) => {
    const { from, to, payload } = req.body;
    // The console.log below is useful for debugging what the server receives
    console.log('Received request with payload:', payload);

    const data = generateMockData(from, to, payload);

    // Wrap in data.data structure as expected by frontend
    res.json({ data: data });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
