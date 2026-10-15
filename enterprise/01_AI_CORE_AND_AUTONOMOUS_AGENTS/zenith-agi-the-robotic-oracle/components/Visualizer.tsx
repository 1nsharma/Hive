
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Node, Link } from '../types';

const Visualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes: Node[] = Array.from({ length: 40 }, (_, i) => ({
      id: i.toString(),
      group: Math.floor(Math.random() * 5)
    }));

    const links: Link[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.92) {
          links.push({ source: nodes[i].id, target: nodes[j].id });
        }
      }
    }

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    const link = svg.append("g")
      .attr("stroke", "#0ea5e9")
      .attr("stroke-opacity", 0.3)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 4)
      .attr("fill", "#38bdf8")
      .attr("class", "cursor-pointer")
      .call(d3.drag<SVGCircleElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("title").text(d => `Neuron Cluster ${d.id}`);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Pulse animation for nodes
    const pulse = () => {
      node.transition()
        .duration(1500)
        .attr("r", 6)
        .transition()
        .duration(1500)
        .attr("r", 4)
        .on("end", pulse);
    };
    pulse();

    return () => simulation.stop();
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-950/20">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Neural Sync: Active</span>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default Visualizer;
