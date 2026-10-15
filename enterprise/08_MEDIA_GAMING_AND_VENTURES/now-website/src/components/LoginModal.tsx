import React, { useState } from "react";
import { X, Lock, Phone, UserCheck, Shield, Check } from "lucide-react";
import { UserRole } from "../types";
import { INITIAL_USER_PROFILES } from "../truckWalaData";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole, phone: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("owner");
  const [phone, setPhone] = useState<string>("+91 98101 23456");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(selectedRole, phone);
    }, 400);
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setPhone(INITIAL_USER_PROFILES[role]?.phone || "+91 98765 43210");
  };

  return (
    <div
      id="loginModal"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">Login to Truck Wala</h2>
              <p className="text-xs text-gray-500">Commercial Operations Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(["owner", "worker", "engineer", "admin"] as const).map((role) => {
                const profile = INITIAL_USER_PROFILES[role];
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-gray-600">{role}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-sm font-bold text-secondary truncate mt-1">{profile.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{profile.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXXXXXXX"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm text-secondary font-medium"
              />
            </div>
          </div>

          <div className="bg-surface rounded-xl p-3 border border-gray-200 text-xs text-gray-600 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <span>Authenticated session loads live fleet dispatch, inventory stock & WhatsApp audio queue.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <UserCheck className="w-5 h-5" />
            <span>{isSubmitting ? "Authenticating..." : `Login as ${INITIAL_USER_PROFILES[selectedRole].name}`}</span>
          </button>

          <p className="text-center text-xs text-gray-500">
            For highway emergency help without login:{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                const emergencyBtn = document.getElementById("btn-public-emergency-help");
                if (emergencyBtn) emergencyBtn.click();
              }}
              className="text-primary font-bold hover:underline"
            >
              Open Roadside SOS
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
