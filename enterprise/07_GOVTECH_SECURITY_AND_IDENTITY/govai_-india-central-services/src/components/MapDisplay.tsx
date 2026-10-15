import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MapDisplayProps {
  vulnerablePoints: string[];
}

export const MapDisplay: React.FC<MapDisplayProps> = ({ vulnerablePoints }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    
    // Create a grid background
    const gridSize = 40;
    for (let x = 0; x <= width; x += gridSize) {
      svg.append("line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", "#1a1a1a")
        .attr("stroke-width", 1);
    }
    for (let y = 0; y <= height; y += gridSize) {
      svg.append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", width)
        .attr("y2", y)
        .attr("stroke", "#1a1a1a")
        .attr("stroke-width", 1);
    }

    // Mock Kasi Sector 4 Wireframe
    const sectors = [
      { id: "Point-A", x: 100, y: 100, label: "THE COMPLEX GATE" },
      { id: "Dust-Canyon", x: 300, y: 250, label: "DUST CANYON" },
      { id: "Scrap-Heap-Beta", x: 500, y: 400, label: "SCRAP HEAP BETA" },
      { id: "Kasi-Gate", x: 700, y: 500, label: "KASI SECTOR 4" },
    ];

    // Draw paths
    const lineGenerator = d3.line<{x: number, y: number}>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    svg.append("path")
      .datum(sectors)
      .attr("d", lineGenerator as any)
      .attr("fill", "none")
      .attr("stroke", "#00ff41")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("opacity", 0.5);

    // Draw nodes
    sectors.forEach(sector => {
      const isVulnerable = vulnerablePoints.includes(sector.id);
      
      const g = svg.append("g")
        .attr("transform", `translate(${sector.x}, ${sector.y})`);

      // Outer ring
      g.append("circle")
        .attr("r", 15)
        .attr("fill", "none")
        .attr("stroke", isVulnerable ? "#f27d26" : "#00ff41")
        .attr("stroke-width", 1)
        .attr("class", isVulnerable ? "animate-pulse" : "");

      // Inner dot
      g.append("circle")
        .attr("r", 4)
        .attr("fill", isVulnerable ? "#f27d26" : "#00ff41");

      // Label
      g.append("text")
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("fill", isVulnerable ? "#f27d26" : "#00ff41")
        .attr("font-size", "10px")
        .attr("class", "font-mono")
        .text(sector.label);

      if (isVulnerable) {
        g.append("text")
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .attr("fill", "#f27d26")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text("VULNERABILITY DETECTED");
      }
    });

  }, [vulnerablePoints]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-terminal-bg border border-terminal-dim relative overflow-hidden">
      <div className="absolute top-4 left-4 text-[10px] opacity-50">KASI_SECTOR_4_WIREFRAME_v2.0</div>
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-full max-w-4xl"
      />
    </div>
  );
};
