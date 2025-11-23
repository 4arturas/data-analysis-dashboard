const normalizeData = (rawChartsData) => {
    if (!rawChartsData || rawChartsData.length === 0) {
        return [];
    }

    const normalizedData = [];

    rawChartsData.forEach(series => {
        let min = Infinity;
        let max = -Infinity;

        series.data.forEach(point => {
            const value = point[1];
            if (typeof value === 'number' && !isNaN(value)) {
                if (value < min) min = value;
                if (value > max) max = value;
            }
        });

        const range = max - min;
        const normalizedSeriesData = series.data.map(point => {
            const timestamp = point[0];
            const value = point[1];
            let normalizedValue = value;

            if (typeof value === 'number' && !isNaN(value)) {
                if (range === 0) {
                    normalizedValue = 0;
                } else {
                    normalizedValue = (value - min) / range;
                }
            }
            return [timestamp, normalizedValue];
        });

        normalizedData.push({
            name: series.name,
            payloadKey: series.payloadKey,
            data: normalizedSeriesData
        });
    });

    return normalizedData;
}

const calculateRValue = (seriesA, seriesB) => {
    if (seriesA.data.length !== seriesB.data.length || seriesA.data.length === 0) {
        return 0;
    }

    const n = seriesA.data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        const x = seriesA.data[i][1];
        const y = seriesB.data[i][1];

        if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
            return 0;
        }

        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
        sumY2 += y * y;
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

    if (denominator === 0) {
        return 0;
    }

    const rValue = numerator / denominator;
    return isNaN(rValue) ? 0 : rValue;
}

const calculateAllCorrelations = (chartsData) => {
    const correlations = [];
    const n = chartsData.length;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const rValue = calculateRValue(chartsData[i], chartsData[j]);
            correlations.push({
                key: `${chartsData[i].name}-${chartsData[j].name}`,
                seriesA: chartsData[i].name,
                seriesB: chartsData[j].name,
                payloadKeyA: chartsData[i].payloadKey,
                payloadKeyB: chartsData[j].payloadKey,
                rValue: rValue
            });
        }
    }
    return correlations;
}

const calculateDTW = (ts1, ts2, distanceFunction = (a, b) => Math.abs(a - b)) => {
    const n = ts1.length;
    const m = ts2.length;
    const dtw = Array(n).fill(null).map(() => Array(m).fill(Infinity));
    dtw[0][0] = distanceFunction(ts1[0], ts2[0]);

    for (let i = 1; i < n; i++) {
        dtw[i][0] = distanceFunction(ts1[i], ts2[0]) + dtw[i - 1][0];
    }

    for (let j = 1; j < m; j++) {
        dtw[0][j] = distanceFunction(ts1[0], ts2[j]) + dtw[0][j - 1];
    }

    for (let i = 1; i < n; i++) {
        for (let j = 1; j < m; j++) {
            const cost = distanceFunction(ts1[i], ts2[j]);
            dtw[i][j] = cost + Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);
        }
    }

    let path = [];
    let i = n - 1;
    let j = m - 1;
    path.push([i, j]);

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0) {
            const min = Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);
            if (min === dtw[i - 1][j - 1]) {
                i--;
                j--;
            } else if (min === dtw[i - 1][j]) {
                i--;
            } else {
                j--;
            }
        } else if (i > 0) {
            i--;
        } else {
            j--;
        }
        path.push([i, j]);
    }
    path.reverse();

    return {
        distance: dtw[n - 1][m - 1],
        path: path,
    };
}
