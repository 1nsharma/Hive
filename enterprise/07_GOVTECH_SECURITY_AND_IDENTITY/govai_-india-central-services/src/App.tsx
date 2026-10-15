import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Users, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Activity
} from 'lucide-react';
import { GrievanceChat } from './components/GrievanceChat';
import { PolicyDashboard } from './components/PolicyDashboard';
import { IdentityWallet } from './components/IdentityWallet';
import { SecurityMonitor } from './components/SecurityMonitor';
import { FraudDetection } from './components/FraudDetection';
import { NationalInfrastructure } from './components/NationalInfrastructure';
import { MinistryOverview } from './components/MinistryOverview';
import { govService } from './services/govService';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCrisisActive, setIsCrisisActive] = useState(false);
  const grievances = govService.getMockGrievances();

  const navItems = [
    { id: 'dashboard', label: 'National Dashboard', icon: LayoutDashboard },
    { id: 'infrastructure', label: 'Critical Infra', icon: Zap },
    { id: 'grievances', label: 'Grievance Portal', icon: MessageSquare },
    { id: 'policies', label: 'Policy Tracking', icon: FileText },
    { id: 'fraud', label: 'Sovereign Security', icon: ShieldCheck },
    { id: 'training', label: 'Training Hub', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-gov-primary">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">National Grievances</div>
                  <div className="text-3xl font-bold text-gov-primary">1.4M</div>
                  <div className="text-[10px] text-gov-success font-bold mt-2">↑ 12% from last week</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-gov-accent">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">National Compliance</div>
                  <div className="text-3xl font-bold text-gov-primary">92.1%</div>
                  <div className="text-[10px] text-gov-success font-bold mt-2">↑ 3.2% from last month</div>
                </div>
                <div className="glass-card p-6 border-l-4 border-gov-success">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">Fraud Prevented</div>
                  <div className="text-3xl font-bold text-gov-primary">₹12.4K Cr</div>
                  <div className="text-[10px] text-gov-success font-bold mt-2">Sovereign AI Savings</div>
                </div>
              </div>

              <PolicyDashboard />
              <MinistryOverview />
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-8">
              <GrievanceChat />
              <NationalInfrastructure isCrisisActive={isCrisisActive} />
            </div>
          </div>
        );
      case 'infrastructure':
        return (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <NationalInfrastructure isCrisisActive={isCrisisActive} />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <SecurityMonitor isCrisisActive={isCrisisActive} />
            </div>
          </div>
        );
      case 'fraud':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">
                <FraudDetection />
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <IdentityWallet />
                <SecurityMonitor isCrisisActive={isCrisisActive} />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64 glass-card text-slate-400 italic">
            Module "{activeTab}" is under development in the Sovereign AI Sandbox.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-gov-primary text-white transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-gov-accent rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">GovAI</span>}
        </div>

        <nav className="flex-1 py-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 transition-all hover:bg-white/5",
                activeTab === item.id ? "bg-white/10 border-r-4 border-gov-accent" : "opacity-60"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search services, policies, or grievances..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gov-primary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-gov-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gov-danger rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">Officer Amit Sharma</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">IAS | District Admin</div>
              </div>
              <div className="w-10 h-10 bg-gov-primary rounded-full flex items-center justify-center text-white font-bold">
                AS
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Welcome Section */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')} Command Center</h2>
              <p className="text-slate-500">Welcome back, Officer. Here is your daily governance overview.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsCrisisActive(!isCrisisActive)}
                className={cn(
                  "gov-button flex items-center gap-2 transition-all",
                  isCrisisActive ? "bg-gov-danger animate-pulse" : "bg-white !text-gov-danger border border-gov-danger"
                )}
              >
                <AlertCircle size={16} />
                {isCrisisActive ? "Crisis Active: Deploying AI Defense" : "Simulate National Crisis"}
              </button>
              <button className="gov-button bg-white !text-gov-primary border border-slate-200">Export Report</button>
              <button className="gov-button">New Policy Directive</button>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
