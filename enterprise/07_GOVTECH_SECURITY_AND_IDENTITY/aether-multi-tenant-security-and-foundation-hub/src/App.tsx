import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IdentitySwitcher } from './components/IdentitySwitcher';
import { OverviewSection } from './components/OverviewSection';
import { PrivilegedActionStudio } from './components/PrivilegedActionStudio';
import { AuditLogViewer } from './components/AuditLogViewer';
import { MultiTenantManager } from './components/MultiTenantManager';
import { RLSTestSuiteRunner } from './components/RLSTestSuiteRunner';
import { SchemaInspector } from './components/SchemaInspector';
import { NextJsCodeViewer } from './components/NextJsCodeViewer';
import { MerchantDashboard } from './components/m02/MerchantDashboard';
import { PublicMenuPage } from './components/m02/PublicMenuPage';
import { OrderTrackingPage } from './components/m02/OrderTrackingPage';
import { InternalTestPaymentsPortal } from './components/m03/InternalTestPaymentsPortal';
import { AdminApprovalsPanel } from './components/m03/AdminApprovalsPanel';
import { StaffOrdersView } from './components/m03/StaffOrdersView';
import { UserProfile, Shop, AuditLog, RLSTestCase, StaffRole } from './types/database';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [testCases, setTestCases] = useState<RLSTestCase[]>([]);
  const [testSummary, setTestSummary] = useState({
    total: 12,
    passed: 12,
    failed: 0,
    passRate: '100%',
    timestamp: new Date().toISOString(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [testLoading, setTestLoading] = useState<boolean>(false);

  // M02 & M03 State
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('ord-001');
  const [activeMenuSlug, setActiveMenuSlug] = useState<string>('apex-athletics');
  const [staffPortalRole, setStaffPortalRole] = useState<StaffRole>('kitchen');

  // Load initial session & data
  const loadInitialData = async () => {
    try {
      setLoading(true);

      // 1. Session context
      const sessionRes = await fetch('/api/auth/session');
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        setCurrentUser(sessionData.user);
        setCurrentShop(sessionData.activeShop);
        if (sessionData.activeShop?.slug) {
          setActiveMenuSlug(sessionData.activeShop.slug);
        }
      }

      // 2. All users (for demo persona switcher)
      const usersRes = await fetch('/api/auth/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      // 3. All shops
      const shopsRes = await fetch('/api/shops');
      if (shopsRes.ok) {
        const shopsData = await shopsRes.json();
        setShops(shopsData);
      }

      // 4. Audit logs
      await fetchAuditLogs();

      // 5. Automated RLS test suite
      await executeRLSTestSuite();
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      } else {
        setAuditLogs([]);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    }
  };

  const executeRLSTestSuite = async () => {
    setTestLoading(true);
    try {
      const res = await fetch('/api/security/run-rls-test-suite');
      if (res.ok) {
        const data = await res.json();
        setTestCases(data.tests || []);
        setTestSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to run test suite:', err);
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setCurrentShop(data.activeShop);
        if (data.activeShop?.slug) {
          setActiveMenuSlug(data.activeShop.slug);
        }
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const handleSwitchShop = async (shopId: string) => {
    try {
      const res = await fetch('/api/auth/switch-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentShop(data.shop);
        if (data.shop?.slug) {
          setActiveMenuSlug(data.shop.slug);
        }
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Failed to switch shop:', err);
    }
  };

  const handleActionCompleted = async () => {
    await fetchAuditLogs();
    await executeRLSTestSuite();
  };

  if (loading || !currentUser || !currentShop) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-mono text-zinc-400">
            Bootstrapping Multi-Tenant Postgres Engine & GCP Services...
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = currentUser.system_role === 'super_admin';
  const isOperations = currentUser.system_role === 'operations';
  const isShopOwner = currentShop.owner_id === currentUser.id || isSuperAdmin;
  const isStaff = currentUser.system_role === 'staff' || isShopOwner;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header with Navigation */}
      <Header
        user={currentUser}
        shop={currentShop}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        passedCount={testSummary.passed}
        totalTests={testSummary.total}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Identity & Multi-Tenant Simulation Control Bar */}
        <IdentitySwitcher
          currentUser={currentUser}
          currentShop={currentShop}
          users={users}
          shops={shops}
          onSwitchUser={handleSwitchUser}
          onSwitchShop={handleSwitchShop}
          isShopOwner={isShopOwner}
          isOperations={isOperations}
          isSuperAdmin={isSuperAdmin}
        />

        {/* Milestone 02: Merchant Dashboard */}
        {activeTab === 'dashboard' && (
          <MerchantDashboard
            currentShop={currentShop}
            currentUser={currentUser}
            isShopOwner={isShopOwner}
            isStaff={isStaff}
            onOpenPublicMenu={(slug) => {
              setActiveMenuSlug(slug);
              setActiveTab('menu');
            }}
            onOpenOrderTracking={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setActiveTab('tracking');
            }}
            onOpenAdminApprovals={() => setActiveTab('admin-approvals')}
            onOpenStaffPortal={(role) => {
              if (role) setStaffPortalRole(role);
              setActiveTab('staff');
            }}
            onRefreshShop={loadInitialData}
          />
        )}

        {/* Milestone 03 REVISED: Staff Portal /staff (MRC-04) */}
        {activeTab === 'staff' && (
          <StaffOrdersView
            currentShop={currentShop}
            currentUser={currentUser}
            initialRole={staffPortalRole}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onNavigateToInvoice={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setActiveTab('tracking');
            }}
          />
        )}

        {/* Milestone 03 REVISED: Secure Merchant Approval Flow /admin/approvals */}
        {activeTab === 'admin-approvals' && (
          <AdminApprovalsPanel
            currentUser={currentUser}
            currentShop={currentShop}
            onSelectShop={(shopId) => {
              handleSwitchShop(shopId);
            }}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* Milestone 02: Public QR Menu /s/[shop_slug] */}
        {activeTab === 'menu' && (
          <PublicMenuPage
            shopSlug={activeMenuSlug || currentShop.slug}
            onNavigateToTracking={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setActiveTab('tracking');
            }}
            onBackToApp={() => setActiveTab('dashboard')}
          />
        )}

        {/* Milestone 02: Live Order Tracking /o/[order_id] */}
        {activeTab === 'tracking' && (
          <OrderTrackingPage
            orderId={activeTrackingOrderId}
            onBackToMenu={() => setActiveTab('menu')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            currentUser={currentUser}
            currentShop={currentShop}
          />
        )}

        {/* Milestone 03: Internal Payment Testing & Fraud Lab */}
        {activeTab === 'test-payments' && (
          <InternalTestPaymentsPortal
            currentUser={currentUser}
            currentShop={currentShop}
            onOpenFraudQueue={() => setActiveTab('dashboard')}
            onOpenOrderTracking={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setActiveTab('tracking');
            }}
          />
        )}

        {/* M01 Foundation & Security Tab Views */}
        {activeTab === 'overview' && <OverviewSection />}

        {activeTab === 'privileged-studio' && (
          <PrivilegedActionStudio
            currentUser={currentUser}
            currentShop={currentShop}
            onActionCompleted={handleActionCompleted}
          />
        )}

        {activeTab === 'audit-logs' && (
          <AuditLogViewer
            logs={auditLogs}
            currentUser={currentUser}
            currentShop={currentShop}
            onRefresh={fetchAuditLogs}
            isShopOwner={isShopOwner}
            isOperations={isOperations}
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {activeTab === 'multi-tenant' && (
          <MultiTenantManager
            currentShop={currentShop}
            currentUser={currentUser}
            shops={shops}
            onShopCreated={loadInitialData}
            isShopOwner={isShopOwner}
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {activeTab === 'test-suite' && (
          <RLSTestSuiteRunner
            tests={testCases}
            summary={testSummary}
            onRunTests={executeRLSTestSuite}
            loading={testLoading}
          />
        )}

        {activeTab === 'schema-sql' && <SchemaInspector />}

        {activeTab === 'nextjs-code' && <NextJsCodeViewer />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-4 text-xs text-zinc-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Aether Commerce Engine</span>
            <span>·</span>
            <span>M03: Payment Verification, Fraud Engine, Custom Receipt & GST Bill Flow</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-mono">
            <span>KOT: 58mm Thermal with Barcode</span>
            <span>·</span>
            <span>Realtime: Firestore shop_{currentShop.id}_live_orders</span>
            <span>·</span>
            <span>UPI & HMAC Webhook</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
