import * as d3 from "d3";
import React, { useState, useEffect, useRef } from "react";
import { getAnalysisData } from "../../../../services/JournalService";

interface HeatmapDataPoint {
  mood: number;
  theme: string;
  correlation: number;
}

interface AnalysisBackendData {
  matrix: number[][];
  themes: string[];
}

type HeatmapData = HeatmapDataPoint[];

const prepareDataForHeatmap = (data: AnalysisBackendData): HeatmapData => {
  const heatmapData: HeatmapData = [];
  const moodRatings = [1, 2, 3, 4, 5]; // Assuming mood ratings are 1 through 5

  data.matrix.forEach((row, rowIndex) => {
    row.forEach((correlation, columnIndex) => {
      heatmapData.push({
        mood: moodRatings[rowIndex],
        theme: data.themes[columnIndex],
        correlation,
      });
    });
  });

  return heatmapData;
};
const D3Heatmap: React.FC<{ data: HeatmapData }> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current && data) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      // Adjusted dimensions and margins
      const margin = { top: 30, right: 30, bottom: 30, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Adjusted scales
      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(data.map((d) => d.mood.toString()))
        .padding(0.05);

      const yScale = d3
        .scaleBand()
        .range([height, 0])
        .domain(data.map((d) => d.theme))
        .padding(0.05);

      // Adjusted color scale
      const myColor = d3
        .scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, 1]); // Assuming correlation values are between 0 and 1

      // Create the squares
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.mood.toString())!) // Non-null assertion here
        .attr("y", (d) => yScale(d.theme)!) // Non-null assertion here
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", (d) => myColor(d.correlation));

      // Append X axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},${height + margin.top})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Append Y axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(d3.axisLeft(yScale));
    }
  }, [data]);

  return <svg ref={ref} width={600} height={400}></svg>;
};

// Assuming you have these interfaces for your data

const AnalysisDisplay: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisBackendData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userId = 1;
  //fetching the data from the backend  and setting the state of analysisData
  useEffect(() => {
    // Fetch the analysis data from the backend
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAnalysisData(userId); // Update with your actual endpoint
        if (!response) {
          throw new Error("Network response was not ok");
        }
        console.log("Heatmap data: ", response); // This will print the data to the console

        setAnalysisData(response);
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!analysisData) {
    return <div>Not enough data available</div>;
  }

  const preparedHeatmapData = analysisData
    ? prepareDataForHeatmap(analysisData)
    : [];

  return (
    <div className="container mx-auto p-4">
      <h1>Your Mood Analysis</h1>
      <p>Explore how various themes correlate with your mood over time.</p>

      <h2>Theme-Mood Correlation</h2>
      <D3Heatmap data={preparedHeatmapData} />

      {/* Additional narrative and explanations */}
    </div>
  );
};

export default AnalysisDisplay;
