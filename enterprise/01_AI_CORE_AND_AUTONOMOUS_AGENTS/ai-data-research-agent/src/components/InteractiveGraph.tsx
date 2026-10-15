import React, { useState, useEffect, useRef } from 'react';
import { Domain, SubDomain, Connection } from '../types';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveGraphProps {
  domains: Domain[];
  subDomains: SubDomain[];
  connections: Connection[];
  selectedSubDomainId: string | null;
  onSelectSubDomain: (id: string | null) => void;
  searchQuery: string;
  connectionFilter: string; // 'all' or connection types
  onAddConnection?: (sourceId: string, targetId: string, type: string, desc: string) => void;
}

interface NodePosition {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  isDomain: boolean;
  parentId?: string;
  status?: string;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  domains,
  subDomains,
  connections,
  selectedSubDomainId,
  onSelectSubDomain,
  searchQuery,
  connectionFilter,
}) => {
  const containerRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<NodePosition[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ring' | 'grouped'>('ring');
  const [dimensions, setDimensions] = useState({ width: 800, height: 580 });

  // Update canvas sizing based on actual layout or container resize
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({
            width: Math.max(width, 700),
            height: Math.max(height, 500)
          });
        }
      });
      resizeObserver.observe(containerRef.current.parentElement as Element);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Compute initial node positions mathematically
  useEffect(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    const tempNodes: NodePosition[] = [];

    if (viewMode === 'ring') {
      // 1. Concentric Ring Layout: Domains in the center ring, subdomains in outer rings
      const domainRadius = 140;
      const numDomains = domains.length;

      domains.forEach((dom, dIdx) => {
        const domAngle = (dIdx * 2 * Math.PI) / numDomains - Math.PI / 2;
        const domX = cx + domainRadius * Math.cos(domAngle);
        const domY = cy + domainRadius * Math.sin(domAngle);

        tempNodes.push({
          id: dom.id,
          name: dom.name,
          x: domX,
          y: domY,
          color: dom.color,
          isDomain: true
        });

        // Filter subdomains for this domain
        const subDoms = subDomains.filter(s => s.domainId === dom.id);
        const numSubs = subDoms.length;
        const subRadius = 90; // offset from parent domain node

        subDoms.forEach((sub, sIdx) => {
          // Spread subdomains radially outwards centered around the parent domain angle
          const spreadAngle = 0.8; // angle span
          const subAngle = domAngle + (numSubs > 1 ? ((sIdx / (numSubs - 1)) - 0.5) * spreadAngle : 0);
          const subX = domX + subRadius * Math.cos(subAngle);
          const subY = domY + subRadius * Math.sin(subAngle);

          tempNodes.push({
            id: sub.id,
            name: sub.name,
            x: subX,
            y: subY,
            color: dom.color,
            isDomain: false,
            parentId: dom.id,
            status: sub.status
          });
        });
      });
    } else {
      // 2. Grouped Grid/Bento layout
      const cols = 4;
      const cardW = dimensions.width / cols;
      const cardH = dimensions.height / 2;

      domains.forEach((dom, dIdx) => {
        const colIdx = dIdx % cols;
        const rowIdx = Math.floor(dIdx / cols);
        
        const domX = colIdx * cardW + cardW / 2;
        const domY = rowIdx * cardH + 40;

        tempNodes.push({
          id: dom.id,
          name: dom.name,
          x: domX,
          y: domY,
          color: dom.color,
          isDomain: true
        });

        const subDoms = subDomains.filter(s => s.domainId === dom.id);
        const numSubs = subDoms.length;
        const subRadius = 55;

        subDoms.forEach((sub, sIdx) => {
          const subAngle = (sIdx * 2 * Math.PI) / numSubs - Math.PI / 2;
          const subX = domX + subRadius * Math.cos(subAngle);
          const subY = domY + subRadius * Math.sin(subAngle) + 40;

          tempNodes.push({
            id: sub.id,
            name: sub.name,
            x: subX,
            y: subY,
            color: dom.color,
            isDomain: false,
            parentId: dom.id,
            status: sub.status
          });
        });
      });
    }

    setNodes(tempNodes);
  }, [domains, subDomains, viewMode, dimensions.width, dimensions.height]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggedNodeId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    
    const svgRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    setNodes(prev =>
      prev.map(node => (node.id === draggedNodeId ? { ...node, x, y } : node))
    );
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Touch Support for dragging on mobile devices
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    e.stopPropagation();
    setDraggedNodeId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    
    const touch = e.touches[0];
    const svgRect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - svgRect.left;
    const y = touch.clientY - svgRect.top;

    setNodes(prev =>
      prev.map(node => (node.id === draggedNodeId ? { ...node, x, y } : node))
    );
  };

  // Helper to color codes
  const getColorHex = (colorName: string) => {
    const colors: Record<string, string> = {
      indigo: '#6366f1',
      emerald: '#10b981',
      sky: '#0ea5e9',
      amber: '#f59e0b',
      rose: '#f43f5e',
      purple: '#a855f7',
      teal: '#14b8a6',
      orange: '#f97316'
    };
    return colors[colorName] || '#64748b';
  };

  // Trace active pathways
  const getSubDomainConnections = (id: string) => {
    return connections.filter(c => c.sourceId === id || c.targetId === id);
  };

  const activeConnections = getSubDomainConnections(selectedSubDomainId || '');
  const activeConnectedSubDomainIds = activeConnections.map(c => 
    c.sourceId === selectedSubDomainId ? c.targetId : c.sourceId
  );

  // Search filtering condition
  const isMatchSearch = (node: NodePosition) => {
    if (!searchQuery) return true;
    return node.name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Filter connections to display on the map
  const filteredConnections = connections.filter(c => {
    if (connectionFilter === 'all') return true;
    return c.type === connectionFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
      {/* Top Map Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Icons.Layers className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-800 text-sm">Interactive Engineering Map</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('ring')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'ring'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Concentric Rings
          </button>
          <button
            onClick={() => setViewMode('grouped')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'grouped'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bento Groups
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 min-h-[400px] relative select-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        <svg
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* SVG Definitions for arrows and markers */}
          <defs>
            <marker
              id="arrow-dependency"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
            </marker>
            <marker
              id="arrow-data-flow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker
              id="arrow-security"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
            <marker
              id="arrow-integration"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
            </marker>
          </defs>

          {/* BACKGROUND LINKS: Drawing parent domain relationships */}
          {nodes.filter(n => !n.isDomain).map(node => {
            const parent = nodes.find(p => p.id === node.parentId);
            if (!parent) return null;
            return (
              <line
                key={`p-link-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke="#f1f5f9"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* INTER-DOMAIN CROSS CONNECTIONS */}
          {filteredConnections.map((conn) => {
            const sourceNode = nodes.find(n => n.id === conn.sourceId);
            const targetNode = nodes.find(n => n.id === conn.targetId);

            if (!sourceNode || !targetNode) return null;

            // Highlight connection if source or target is active/selected
            const isHighlighted = selectedSubDomainId === conn.sourceId || selectedSubDomainId === conn.targetId;
            const isHovered = hoveredNodeId === conn.sourceId || hoveredNodeId === conn.targetId;

            // Color scheme based on type
            let color = '#cbd5e1'; // gray base
            let markerId = 'arrow-dependency';
            if (conn.type === 'dependency') { color = '#6366f1'; markerId = 'arrow-dependency'; }
            else if (conn.type === 'data-flow') { color = '#10b981'; markerId = 'arrow-data-flow'; }
            else if (conn.type === 'security') { color = '#f43f5e'; markerId = 'arrow-security'; }
            else if (conn.type === 'integration') { color = '#a855f7'; markerId = 'arrow-integration'; }

            return (
              <g key={`conn-${conn.id}`}>
                {/* Glow behind highlighted connections */}
                {(isHighlighted || isHovered) && (
                  <path
                    d={`M ${sourceNode.x} ${sourceNode.y} Q ${(sourceNode.x + targetNode.x) / 2} ${(sourceNode.y + targetNode.y) / 2 - 15} ${targetNode.x} ${targetNode.y}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={5}
                    strokeOpacity={0.25}
                  />
                )}

                {/* Curved Connector path */}
                <path
                  d={`M ${sourceNode.x} ${sourceNode.y} Q ${(sourceNode.x + targetNode.x) / 2} ${(sourceNode.y + targetNode.y) / 2 - 15} ${targetNode.x} ${targetNode.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHighlighted ? 3 : isHovered ? 2 : 1.5}
                  strokeOpacity={isHighlighted ? 0.95 : isHovered ? 0.8 : 0.4}
                  strokeDasharray={isHighlighted ? '6 4' : undefined}
                  markerEnd={`url(#${markerId})`}
                  className={isHighlighted ? "animate-[dash_10s_linear_infinite]" : ""}
                />
              </g>
            );
          })}

          {/* NODES: Domains and Subdomains rendered as layered circles */}
          {nodes.map((node) => {
            const isSelected = selectedSubDomainId === node.id;
            const isActiveNeighbor = activeConnectedSubDomainIds.includes(node.id);
            const isMatched = isMatchSearch(node);

            // Opacity control based on active filters/selections
            let opacity = 1;
            if (searchQuery && !isMatched) {
              opacity = 0.2;
            } else if (selectedSubDomainId && !node.isDomain && !isSelected && !isActiveNeighbor) {
              opacity = 0.45;
            }

            // Sizes
            const radius = node.isDomain ? 24 : 14;
            const colorHex = getColorHex(node.color);

            return (
              <g
                key={`node-${node.id}`}
                transform={`translate(${node.x}, ${node.y})`}
                opacity={opacity}
                className="transition-opacity duration-300"
                onClick={() => !node.isDomain && onSelectSubDomain(isSelected ? null : node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onTouchStart={(e) => handleTouchStart(e, node.id)}
              >
                {/* Node Outer Ring / Focus Ring */}
                {(isSelected || isActiveNeighbor) && (
                  <circle
                    r={radius + 6}
                    fill="none"
                    stroke={isSelected ? colorHex : '#cbd5e1'}
                    strokeWidth={isSelected ? 2 : 1.5}
                    strokeDasharray={isActiveNeighbor ? "4 2" : undefined}
                    className={isSelected ? "animate-spin-slow" : ""}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={radius}
                  fill={node.isDomain ? '#ffffff' : colorHex}
                  stroke={colorHex}
                  strokeWidth={node.isDomain ? 3 : 2}
                  className="shadow-sm cursor-grab active:cursor-grabbing transition-colors"
                />

                {/* Subdomain status dots */}
                {!node.isDomain && node.status === 'completed' && (
                  <circle
                    cx={radius - 2}
                    cy={-radius + 2}
                    r={4}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                )}

                {/* Subdomain status dots for drafts */}
                {!node.isDomain && node.status === 'draft' && (
                  <circle
                    cx={radius - 2}
                    cy={-radius + 2}
                    r={4}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                )}

                {/* Inner Icon for Domains */}
                {node.isDomain && (
                  <g transform="translate(-8, -8)" className="pointer-events-none text-slate-700">
                    {(() => {
                      const IconComponent = (Icons as any)[
                        node.id === 'architecture' ? 'Layers' :
                        node.id === 'database' ? 'Database' :
                        node.id === 'apis' ? 'Network' :
                        node.id === 'ai-ml' ? 'Brain' :
                        node.id === 'security' ? 'Lock' :
                        node.id === 'devops' ? 'Infinity' :
                        node.id === 'testing' ? 'ClipboardCheck' : 'Activity'
                      ];
                      return IconComponent ? <IconComponent size={16} strokeWidth={2} style={{ color: colorHex }} /> : null;
                    })()}
                  </g>
                )}

                {/* Floating Node Label */}
                <text
                  y={node.isDomain ? 38 : 26}
                  textAnchor="middle"
                  className={`pointer-events-none font-sans select-none tracking-tight leading-none ${
                    node.isDomain
                      ? 'text-[11px] font-extrabold text-slate-800 uppercase'
                      : isSelected
                      ? 'text-xs font-bold text-slate-900 bg-slate-50'
                      : 'text-[11px] font-medium text-slate-600'
                  }`}
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Legends */}
        <div className="absolute bottom-4 left-4 p-4 rounded-xl border border-slate-100 bg-white/95 backdrop-blur shadow-sm max-w-xs space-y-3 pointer-events-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connection Types</div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500 rounded" />
              <span>Dependency</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded" />
              <span>Data-Flow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-500 rounded" />
              <span>Security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-500 rounded" />
              <span>Integration</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Draft</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span>Not Configured</span>
            </div>
          </div>
        </div>

        {/* Drag Guidance Prompt */}
        <div className="absolute top-4 left-4 text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-medium shadow-sm">
          💡 Drag any node to customize map layout
        </div>
      </div>
    </div>
  );
};
