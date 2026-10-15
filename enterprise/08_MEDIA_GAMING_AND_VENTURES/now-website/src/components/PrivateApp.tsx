import React, { useState } from "react";
import {
  Truck,
  User,
  Bell,
  Wrench,
  AlertCircle,
  Package,
  TrendingUp,
  ArrowUp,
  Mic,
  Camera,
  Phone,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Shield,
  Layers,
  Cpu,
  Database,
  ExternalLink,
  MessageCircle,
  FileCheck,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Flame,
  Compass,
} from "lucide-react";
import { UserRole, UserProfile, WorkItem } from "../types";
import { INITIAL_USER_PROFILES } from "../truckWalaData";
import { startPrivateDashboardTour } from "../utils/tours";

interface PrivateAppProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onLogout: () => void;
  workItems: WorkItem[];
  onOpenTimeline: (item: WorkItem) => void;
  onOpenVoiceInput: () => void;
  onOpenPhotoEvidence: () => void;
  onOpenEmergency: () => void;
  onOpenNewJob: () => void;
  activeView: string;
  onChangeActiveView: (view: string) => void;
  children?: React.ReactNode;
}

export const PrivateApp: React.FC<PrivateAppProps> = ({
  currentRole,
  onChangeRole,
  onLogout,
  workItems,
  onOpenTimeline,
  onOpenVoiceInput,
  onOpenPhotoEvidence,
  onOpenEmergency,
  onOpenNewJob,
  activeView,
  onChangeActiveView,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profile: UserProfile =
    INITIAL_USER_PROFILES[currentRole] || INITIAL_USER_PROFILES.owner;

  // Filter today's work
  const filteredWork = workItems.filter((item) => {
    const matchesSearch =
      item.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === "ALL") return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const activeJobsCount = workItems.filter((w) => w.status !== "Completed").length;
  const emergencyJobsCount = workItems.filter(
    (w) => w.category === "Suspension" || w.category === "Brake" || w.status === "Needs Action"
  ).length;
  const partsPendingCount = workItems.filter((w) => w.partsStatus === "Pending").length;
  const totalRevenueToday = workItems.reduce(
    (acc, cur) => acc + (cur.actualAmount || cur.estimateAmount || 0),
    0
  );

  return (
    <div id="privateSection" className="min-h-screen bg-surface text-secondary">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div id="tour-dashboard-header" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-red-500/20">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-secondary tracking-tight">TRUCK WALA</h1>
                <p className="text-[10px] text-primary font-bold -mt-1 tracking-wider uppercase">OPERATIONS</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* System Tour Launcher */}
              <button
                id="btn-private-tour"
                onClick={startPrivateDashboardTour}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                title="Run Driver.js interactive system walkthrough"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span className="hidden sm:inline">System Tour</span>
              </button>

              {/* Role Selector */}
              <div id="tour-role-selector" className="flex items-center space-x-2 bg-surface px-3 py-1.5 rounded-xl border border-gray-200">
                <User className="w-4 h-4 text-gray-500 shrink-0" />
                <select
                  id="roleSelector"
                  value={currentRole}
                  onChange={(e) => onChangeRole(e.target.value as UserRole)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-secondary focus:outline-none cursor-pointer"
                >
                  <option value="owner">Owner (Rajesh)</option>
                  <option value="worker">Worker (Amit)</option>
                  <option value="engineer">Engineer (Vikram)</option>
                  <option value="admin">Admin User</option>
                </select>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 text-gray-600 hover:text-primary relative rounded-lg hover:bg-gray-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full pulse-dot"></span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                      <span className="font-bold text-secondary">Live Workshop Alerts</span>
                      <span className="text-[10px] bg-red-100 text-primary font-bold px-2 py-0.5 rounded-full">
                        3 New
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="p-2 bg-red-50 rounded-xl border border-red-100">
                        <p className="font-bold text-red-900">SOS: RJ 14 GB 4412</p>
                        <p className="text-gray-600 text-[11px]">Mobile Van 2 bearing repair completed on NH-48.</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="font-bold text-blue-900">Approval Required</p>
                        <p className="text-gray-600 text-[11px]">UP 32 XX 1234 brake liner estimate ₹9,200 pending.</p>
                      </div>
                      <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="font-bold text-amber-900">Low Stock Alert</p>
                        <p className="text-gray-600 text-[11px]">Clutch plates stock dropped to 6 units (Rack A-2).</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile / Logout */}
              <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200">
                <div
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm"
                  id="userInitial"
                >
                  {profile.initial}
                </div>
                <button
                  id="btn-private-logout"
                  onClick={onLogout}
                  className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-primary flex items-center gap-1 transition"
                >
                  <LogOut className="w-3.5 h-3.5 hidden sm:inline" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div id="tour-nav-tabs" className="border-t border-gray-200 bg-gray-50/70 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 py-1 text-xs font-semibold whitespace-nowrap">
            <button
              onClick={() => onChangeActiveView("dashboard")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "dashboard"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Workshop Board</span>
            </button>

            <button
              onClick={() => onChangeActiveView("audit")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "audit"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Audit Queue</span>
              <span className="px-1.5 py-0.2 bg-red-100 text-primary text-[10px] rounded-full font-bold">2</span>
            </button>

            <button
              onClick={() => onChangeActiveView("inventory")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "inventory"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Shelf Scanner & Parts</span>
            </button>

            <button
              onClick={() => onChangeActiveView("emergency")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "emergency"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-error" />
              <span>Emergency SOS Fleet</span>
            </button>

            <button
              onClick={() => onChangeActiveView("whatsapp")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "whatsapp"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Stream</span>
            </button>

            <button
              onClick={() => onChangeActiveView("lifecycle")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "lifecycle"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Job Lifecycle Engine</span>
            </button>

            <button
              onClick={() => onChangeActiveView("learning")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "learning"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Controlled Learning</span>
            </button>

            <button
              onClick={() => onChangeActiveView("blueprint")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "blueprint"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Master Blueprint</span>
            </button>

            <button
              onClick={() => onChangeActiveView("trust")}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                activeView === "trust"
                  ? "bg-white text-primary font-bold shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-100"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Data Trust Center</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView !== "dashboard" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <button
                  onClick={() => onChangeActiveView("dashboard")}
                  className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Back to Workshop Board</span>
                </button>
                <span>/</span>
                <span className="font-semibold text-secondary capitalize">{activeView.replace("-", " ")}</span>
              </div>
              <button
                onClick={() => onChangeActiveView("dashboard")}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Workshop Board
              </button>
            </div>
            {children}
          </div>
        ) : (
          <>
            {/* Greeting & Quick Stats */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight mb-1" id="greetingText">
              Welcome, {profile.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600" id="roleSubtitle">
              Role: <span className="font-bold text-primary capitalize">{profile.role}</span> • {profile.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="tour-new-vehicle"
              onClick={onOpenNewJob}
              className="px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Vehicle Entry</span>
            </button>
            <button
              id="tour-voice-note"
              onClick={onOpenVoiceInput}
              className="px-4 py-2.5 bg-secondary text-white rounded-xl hover:bg-gray-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Mic className="w-4 h-4 text-red-400" />
              <span>Voice Note</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div id="tour-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Jobs</span>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-black text-secondary font-mono mb-1">{activeJobsCount}</p>
            <p className="text-xs text-success font-semibold flex items-center">
              <ArrowUp className="w-3.5 h-3.5 mr-1" />
              <span>2 completed today</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Emergency SOS</span>
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-error" />
              </div>
            </div>
            <p className="text-3xl font-black text-secondary font-mono mb-1">{emergencyJobsCount}</p>
            <p className="text-xs text-primary font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-error mr-1.5 pulse-dot"></span>
              <span>1 mobile van on site</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Parts Pending</span>
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-3xl font-black text-secondary font-mono mb-1">{partsPendingCount}</p>
            <p className="text-xs text-warning font-semibold">Needs owner authorization</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-xs hover:border-gray-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Today's Revenue</span>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-black text-secondary font-mono mb-1">
              ₹{totalRevenueToday.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-success font-semibold flex items-center">
              <ArrowUp className="w-3.5 h-3.5 mr-1" />
              <span>+18% vs yesterday</span>
            </p>
          </div>
        </div>

        {/* Quick Actions (Matching HTML) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-secondary tracking-tight">Quick Actions</h3>
            <span className="text-xs text-gray-500 font-medium">One-tap workshop controls</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={onOpenVoiceInput}
              className="flex items-center space-x-3 p-4 bg-surface rounded-xl hover:bg-primary hover:text-white transition group border border-gray-200 hover:border-primary text-left cursor-pointer"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition shrink-0">
                <Mic className="w-5 h-5 text-primary group-hover:text-white transition" />
              </div>
              <div>
                <p className="font-bold text-sm">Voice Input</p>
                <p className="text-xs text-gray-500 group-hover:text-white/80">Record audio note</p>
              </div>
            </button>

            <button
              onClick={onOpenPhotoEvidence}
              className="flex items-center space-x-3 p-4 bg-surface rounded-xl hover:bg-blue-600 hover:text-white transition group border border-gray-200 hover:border-blue-600 text-left cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition shrink-0">
                <Camera className="w-5 h-5 text-blue-600 group-hover:text-white transition" />
              </div>
              <div>
                <p className="font-bold text-sm">Photo Evidence</p>
                <p className="text-xs text-gray-500 group-hover:text-white/80">Upload part image</p>
              </div>
            </button>

            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-3 p-4 bg-surface rounded-xl hover:bg-error hover:text-white transition group border border-gray-200 hover:border-error text-left cursor-pointer"
            >
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition shrink-0">
                <Phone className="w-5 h-5 text-error group-hover:text-white transition" />
              </div>
              <div>
                <p className="font-bold text-sm">Emergency SOS</p>
                <p className="text-xs text-gray-500 group-hover:text-white/80">Highway mobile van</p>
              </div>
            </button>

            <button
              onClick={() => onChangeActiveView("inventory")}
              className="flex items-center space-x-3 p-4 bg-surface rounded-xl hover:bg-amber-600 hover:text-white transition group border border-gray-200 hover:border-amber-600 text-left cursor-pointer"
            >
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition shrink-0">
                <Package className="w-5 h-5 text-warning group-hover:text-white transition" />
              </div>
              <div>
                <p className="font-bold text-sm">Parts Request</p>
                <p className="text-xs text-gray-500 group-hover:text-white/80">Issue from inventory</p>
              </div>
            </button>
          </div>
        </div>

        {/* Today's Work & Live Updates (2 col + 1 col Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Work (2 columns) */}
          <div id="tour-active-jobs" className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-black text-secondary tracking-tight">Today's Work Orders</h3>
                <p className="text-xs text-gray-500">Real-time status of commercial vehicles in workshop bays</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vehicle..."
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary font-medium"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:ring-1 focus:ring-primary"
                >
                  <option value="ALL">All Status</option>
                  <option value="In Process">In Process</option>
                  <option value="Needs Action">Needs Action</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Work Items List */}
            <div className="space-y-4">
              {filteredWork.length === 0 ? (
                <div className="text-center py-12 bg-surface rounded-xl border border-dashed border-gray-200">
                  <Truck className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-600">No vehicles match current filters</p>
                  <p className="text-xs text-gray-400 mt-1">Try clearing your search keyword</p>
                </div>
              ) : (
                filteredWork.map((item, idx) => {
                  const isCompleted = item.status === "Completed";
                  const isInProcess = item.status === "In Process";
                  const isNeedsAction = item.status === "Needs Action";

                  return (
                    <div
                      key={item.id}
                      id={idx === 0 ? "tour-timeline-action" : undefined}
                      onClick={() => onOpenTimeline(item)}
                      className="border border-gray-200 rounded-2xl p-4 sm:p-5 hover:border-primary transition cursor-pointer bg-white hover:shadow-md group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-black text-secondary text-base group-hover:text-primary transition">
                              {item.vehicleNumber}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isCompleted
                                  ? "bg-green-100 text-success"
                                  : isInProcess
                                  ? "bg-yellow-100 text-yellow-800"
                                  : isNeedsAction
                                  ? "bg-red-100 text-error"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-700 mt-0.5">
                            {item.vehicleModel} • <span className="text-gray-900 font-bold">{item.issue}</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="font-mono font-black text-secondary text-base">
                            ₹{item.estimateAmount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Parts:{" "}
                            <span
                              className={`font-bold ${
                                item.partsStatus === "OK"
                                  ? "text-success"
                                  : item.partsStatus === "Issued"
                                  ? "text-blue-600"
                                  : "text-warning"
                              }`}
                            >
                              {item.partsStatus === "OK" ? "Parts ✓" : item.partsStatus}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Progress summary & click hint */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Updated: {item.lastUpdate}</span>
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5 text-gray-400" />
                            <span>{item.evidenceCount} photos</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform">
                          <span>View Complete Timeline</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Live WhatsApp Stream & Telemetry (1 column) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 pulse-dot"></div>
                  <h3 className="text-lg font-black text-secondary tracking-tight">Live WhatsApp Stream</h3>
                </div>
                <button
                  onClick={() => onChangeActiveView("whatsapp")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Full View
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Audio voice notes & driver messages streaming from WhatsApp Business API
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 hover:bg-gray-100/80 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-secondary">Driver Harpreet (Tata 1618)</span>
                    <span className="text-[10px] text-gray-400 font-mono">09:12 AM</span>
                  </div>
                  <p className="text-xs text-gray-600 italic">"Clutch dabane par slip ho rahi hai gaadi..."</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      AI Parsed: Clutch Plate
                    </span>
                    <button
                      onClick={() => onOpenTimeline(workItems[0])}
                      className="text-primary font-bold hover:underline"
                    >
                      Audit
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 hover:bg-gray-100/80 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-secondary">Owner Rajesh Kumar</span>
                    <span className="text-[10px] text-gray-400 font-mono">10:02 AM</span>
                  </div>
                  <p className="text-xs text-gray-600 italic">"₹12,500 ka estimate approve hai. Kaam shuru karo."</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Authorization Logged
                    </span>
                    <span className="text-gray-400">Signed WhatsApp</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 hover:bg-gray-100/80 transition">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-secondary">Mobile Van 2 (Ramesh)</span>
                    <span className="text-[10px] text-gray-400 font-mono">02:15 PM</span>
                  </div>
                  <p className="text-xs text-gray-600 italic">"Wheel bearing installed on NH-48. Trial pass."</p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Highway Job Complete
                    </span>
                    <button
                      onClick={() => onChangeActiveView("emergency")}
                      className="text-primary font-bold hover:underline"
                    >
                      Track Van
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Record Callout */}
            <div className="mt-6 pt-4 border-t border-gray-200 bg-surface rounded-xl p-3 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-secondary">Send Voice / Audio</p>
                  <p className="text-[11px] text-gray-500">Dictate Hindi/Hinglish instructions</p>
                </div>
                <button
                  onClick={onOpenVoiceInput}
                  className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition shadow"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
};
