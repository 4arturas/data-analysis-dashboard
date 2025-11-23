# Log Analysis Tutorial: Finding Relationships in Data

This tutorial provides a brief guide on how to analyze logs to find relationships between different data series.

## The Shape of Data

As you suspected, when different metrics are related, their graphs will often have similar shapes. For example, a spike in `HTTP Requests` might be followed by a spike in `CPU Usage` and `RAM Usage`. This visual similarity is a good indicator of a potential relationship.

## Quantifying Similarity with Correlation

While visual inspection is useful, it's not precise. To quantify the relationship between two data series, we can use statistical methods like **correlation**.

### Pearson Correlation Coefficient (R-value)

A common method is the **Pearson correlation coefficient (R-value)**. The R-value measures the linear relationship between two data series. It ranges from -1 to 1:

*   **R = 1:** Perfect positive correlation. When one metric goes up, the other goes up by a proportional amount.
*   **R = -1:** Perfect negative correlation. When one metric goes up, the other goes down by a proportional amount.
*   **R = 0:** No linear correlation. The two metrics are not linearly related.

This project's "R-Values (Correlation)" tab already calculates the Pearson correlation coefficient for you.

## Advanced Algorithms

For more complex analysis, you can use other algorithms:

*   **Dynamic Time Warping (DTW):** This algorithm can find similarities between two time series that are out of phase or have different lengths. For example, it could identify the relationship between `HTTP Requests` and `Database Latency`, even if the latency spikes a few seconds after the requests.
*   **Cross-Correlation:** This method can be used to find the time lag between two signals. It helps to answer questions like "How long after a spike in requests does the CPU usage increase?".

By using these techniques, you can move from visual inspection to a more data-driven approach to log analysis.
