import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  ShieldAlert, 
  Users, 
  Bell, 
  CheckCircle2, 
  Navigation, 
  Sparkles,
  Phone,
  MessageSquare,
  Filter,
  Plus,
  Compass,
  Clock
} from 'lucide-react';
import { audioService } from '../lib/audioService';

export interface RadarNode {
  id: string;
  name: string;
  breed: string;
  status: 'lost' | 'sighting' | 'volunteer' | 'shelter';
  distance: string;
  distanceKm: number;
  location: string;
  timeAgo: string;
  phone: string;
  xPercent: number; // Position on map 0-100
  yPercent: number;
}

const SEEDED_RADAR_NODES: RadarNode[] = [
  {
    id: 'node-1',
    name: 'Bruno (Lost)',
    breed: 'Golden Retriever · Red Collar',
    status: 'lost',
    distance: '0.8 km away',
    distanceKm: 0.8,
    location: 'Linking Road, Bandra W, Mumbai',
    timeAgo: '12 mins ago',
    phone: '+91 98765 43210',
    xPercent: 35,
    yPercent: 42,
  },
  {
    id: 'node-2',
    name: 'Simba (Sighting)',
    breed: 'Persian Cat · White',
    status: 'sighting',
    distance: '1.4 km away',
    distanceKm: 1.4,
    location: 'Near Bakery Lane, Andheri W',
    timeAgo: '5 mins ago',
    phone: '+91 98111 22233',
    xPercent: 68,
    yPercent: 28,
  },
  {
    id: 'node-3',
    name: 'Mumbai Volunteer Patrol #4',
    breed: '14 Active Searchers',
    status: 'volunteer',
    distance: '2.1 km away',
    distanceKm: 2.1,
    location: 'Juhu Tara Road Junction',
    timeAgo: 'Active now',
    phone: '+91 99999 88888',
    xPercent: 22,
    yPercent: 75,
  },
  {
    id: 'node-4',
    name: 'PetCare 24/7 Emergency Hospital',
    breed: 'ICU & Trauma Station',
    status: 'shelter',
    distance: '3.5 km away',
    distanceKm: 3.5,
    location: 'S V Road, Andheri West',
    timeAgo: 'Open 24 Hours',
    phone: '+91 91111 00000',
    xPercent: 80,
    yPercent: 70,
  },
  {
    id: 'node-5',
    name: 'Rocky (Sighting)',
    breed: 'Indie Dog · Black & Tan',
    status: 'sighting',
    distance: '4.2 km away',
    distanceKm: 4.2,
    location: 'Versova Beach Entrance',
    timeAgo: '26 mins ago',
    phone: '+91 98200 44556',
    xPercent: 48,
    yPercent: 85,
  }
];

export const SOSRadarMap: React.FC = () => {
  const [nodes, setNodes] = useState<RadarNode[]>(SEEDED_RADAR_NODES);
  const [selectedNode, setSelectedNode] = useState<RadarNode | null>(SEEDED_RADAR_NODES[0]);
  const [activeResponders, setActiveResponders] = useState<number>(48);
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [filterType, setFilterType] = useState<string>('all');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [showAddPinModal, setShowAddPinModal] = useState<boolean>(false);
  const [newSightingLocation, setNewSightingLocation] = useState('');
  const [newSightingNote, setNewSightingNote] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveResponders((prev) => Math.max(30, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSelectNode = (node: RadarNode) => {
    audioService.playRadarPing();
    setSelectedNode(node);
  };

  const handleRadiusChange = (km: number) => {
    audioService.playSuccess();
    setSelectedRadius(km);
  };

  const handleTriggerBroadcast = () => {
    audioService.playSosAlarm();
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
      setTimeout(() => setBroadcastSent(false), 5000);
    }, 1200);
  };

  const handleAddSightingPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSightingLocation.trim()) return;

    audioService.playSuccess();
    const newNode: RadarNode = {
      id: `node-${Date.now()}`,
      name: 'New Sighting Spot',
      breed: newSightingNote || 'Observed pet in area',
      status: 'sighting',
      distance: '0.4 km away',
      distanceKm: 0.4,
      location: newSightingLocation,
      timeAgo: 'Just now',
      phone: '+91 63937 41171',
      xPercent: 45 + Math.floor(Math.random() * 20),
      yPercent: 40 + Math.floor(Math.random() * 20)
    };

    setNodes(prev => [newNode, ...prev]);
    setSelectedNode(newNode);
    setShowAddPinModal(false);
    setNewSightingLocation('');
    setNewSightingNote('');
  };

  const filteredNodes = nodes.filter(node => {
    const radiusMatches = node.distanceKm <= selectedRadius;
    if (!radiusMatches) return false;
    if (filterType === 'all') return true;
    return node.status === filterType;
  });

  const getNodeColor = (status: RadarNode['status']) => {
    switch (status) {
      case 'lost': return 'bg-red-500 border-red-300 text-red-400 shadow-red-500/50';
      case 'sighting': return 'bg-amber-500 border-amber-300 text-amber-400 shadow-amber-500/50';
      case 'volunteer': return 'bg-cyan-500 border-cyan-300 text-cyan-400 shadow-cyan-500/50';
      case 'shelter': return 'bg-emerald-500 border-emerald-300 text-emerald-400 shadow-emerald-500/50';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12 bg-[#06120D] border border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-emerald-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-full mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" /> LIVE COMMUNITY EMERGENCY BROADCAST RADAR
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3 font-serif">
            <ShieldAlert className="w-8 h-8 text-red-400" />
            Live SOS Incident Radar
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Real-time emergency ping radius notifying verified pet parents, emergency vets, and volunteer rescue networks.
          </p>
        </div>

        {/* Live Network Stats */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-emerald-800/50 font-mono text-xs shrink-0">
          <div>
            <div className="text-slate-400 text-[10px]">ACTIVE RESPONDERS</div>
            <div className="text-base font-extrabold text-emerald-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" /> {activeResponders} Nearby
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-slate-400 text-[10px]">RADAR RADIUS</div>
            <div className="text-base font-extrabold text-amber-400">{selectedRadius}.0 KM</div>
          </div>
        </div>
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-950/70 p-3 rounded-2xl border border-emerald-900/40">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {[
            { id: 'all', label: 'All Markers' },
            { id: 'lost', label: '🚨 Lost Pets' },
            { id: 'sighting', label: '👁️ Sightings' },
            { id: 'volunteer', label: '🛡️ Search Patrols' },
            { id: 'shelter', label: '🏥 24/7 Vets' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${
                filterType === f.id
                  ? 'bg-emerald-500 text-stone-950 shadow-xs'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Radius:</span>
          {[1, 3, 5, 10].map(km => (
            <button
              key={km}
              onClick={() => handleRadiusChange(km)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                selectedRadius === km
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {km}km
            </button>
          ))}
          <button
            onClick={() => setShowAddPinModal(true)}
            className="ml-2 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Report Sighting
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Screen (Left) + Active Node Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* RADAR MAP SCREEN CONTAINER */}
        <div className="lg:col-span-2 relative aspect-square sm:aspect-[16/10] bg-slate-950 rounded-3xl border border-emerald-800/80 overflow-hidden shadow-inner flex items-center justify-center">
          
          {/* Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#175741 1px, transparent 1px), linear-gradient(to right, rgba(23, 87, 65, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(23, 87, 65, 0.15) 1px, transparent 1px)`,
              backgroundSize: `40px 40px`
            }}
          />

          {/* Concentric Distance Rings */}
          <div className="absolute w-[85%] aspect-square rounded-full border border-emerald-800/40 pointer-events-none flex items-center justify-center">
            <span className="absolute top-2 text-[10px] font-mono text-emerald-600">{selectedRadius} KM RADIUS</span>
          </div>
          <div className="absolute w-[55%] aspect-square rounded-full border border-emerald-700/50 pointer-events-none flex items-center justify-center">
            <span className="absolute top-2 text-[10px] font-mono text-emerald-500">{(selectedRadius * 0.6).toFixed(1)} KM</span>
          </div>
          <div className="absolute w-[25%] aspect-square rounded-full border border-emerald-500/60 pointer-events-none flex items-center justify-center">
            <span className="absolute top-1 text-[9px] font-mono text-emerald-400">{(selectedRadius * 0.25).toFixed(1)} KM</span>
          </div>

          {/* Center Origin Node (User Location) */}
          <div className="absolute z-20 flex flex-col items-center">
            <div className="w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-lg shadow-emerald-400/80 animate-ping absolute" />
            <div className="w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-950">
              YOU
            </div>
          </div>

          {/* ROTATING RADAR SWEEP BEAM */}
          <div 
            className="absolute inset-0 pointer-events-none animate-spin origin-center"
            style={{
              animationDuration: '5s',
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 300deg, rgba(16, 185, 129, 0.25) 360deg)'
            }}
          />

          {/* RADAR PINS / NODES */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => handleSelectNode(node)}
                style={{ top: `${node.yPercent}%`, left: `${node.xPercent}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 group cursor-pointer ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-110'
                }`}
              >
                <div className={`relative p-2 rounded-full border shadow-xl flex items-center justify-center ${getNodeColor(node.status)}`}>
                  <MapPin className="w-4 h-4 text-white" />
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${getNodeColor(node.status)}`} />
                </div>
                
                {/* Tooltip on Hover */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-bold whitespace-nowrap text-white shadow-2xl opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {node.name} ({node.distance})
                </div>
              </button>
            );
          })}

        </div>

        {/* NODE DETAILS & BROADCAST ACTION (Right Side Drawer) */}
        <div className="space-y-6">
          {selectedNode ? (
            <div className="bg-slate-950 border border-emerald-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    selectedNode.status === 'lost' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    selectedNode.status === 'sighting' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {selectedNode.status === 'lost' ? '🚨 LOST PET SOS' : selectedNode.status === 'sighting' ? '👁️ SIGHTING REPORT' : selectedNode.status === 'shelter' ? '🏥 24/7 EMERGENCY VET' : '🛡️ COMMUNITY PATROL'}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-2 font-serif">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-400">{selectedNode.breed}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 font-mono">
                <div className="flex justify-between"><span className="text-slate-500">Distance:</span> <strong className="text-emerald-400">{selectedNode.distance}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Last Location:</span> <strong className="text-white">{selectedNode.location}</strong></div>
                <div className="flex justify-between"><span className="text-slate-500">Timestamp:</span> <strong className="text-amber-400">{selectedNode.timeAgo}</strong></div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-2">
                <a
                  href={`tel:${selectedNode.phone}`}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Contact ({selectedNode.phone})
                </a>

                <button
                  onClick={handleTriggerBroadcast}
                  disabled={isBroadcasting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" /> 
                  {isBroadcasting 
                    ? 'Transmitting Frequency...' 
                    : broadcastSent 
                      ? `✓ Broadcast Sent to ${activeResponders} Responders!` 
                      : `Broadcast Alert (${selectedRadius}km Radius)`}
                </button>
              </div>

            </div>
          ) : (
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
              Click on any glowing radar pin on the map to view lost pet details or contact nearby emergency responders.
            </div>
          )}

          {/* Quick Info Box */}
          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Automatic Hyper-Local Relay
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              When a pet is marked LOST, an immediate push notification &amp; SMS alert goes out to all registered PetJanu parents and shelters within {selectedRadius} kilometers.
            </p>
          </div>

        </div>

      </div>

      {/* Sighting Submission Modal */}
      {showAddPinModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full text-white space-y-4 shadow-2xl">
            <h3 className="font-serif font-black text-xl text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" /> Report a Pet Sighting
            </h3>
            <p className="text-xs text-slate-300">
              Seen an unaccompanied pet? Drop a location pin to notify the community instantly.
            </p>

            <form onSubmit={handleAddSightingPin} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 font-bold mb-1 uppercase text-[10px]">Location / Landmark</label>
                <input
                  type="text"
                  required
                  value={newSightingLocation}
                  onChange={(e) => setNewSightingLocation(e.target.value)}
                  placeholder="e.g. Near HDFC ATM, Linking Road"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold mb-1 uppercase text-[10px]">Pet Description / Collar Note</label>
                <input
                  type="text"
                  value={newSightingNote}
                  onChange={(e) => setNewSightingNote(e.target.value)}
                  placeholder="e.g. Golden Indie dog with blue collar, looked tired"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-700 text-stone-400 hover:bg-stone-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black shadow-md"
                >
                  Publish Sighting Pin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
