'use client';

import Link from 'next/link';
import { ChevronRight, Camera, ShieldCheck, ShieldAlert, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

export default function GuestProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();

  const displayName = user?.name || 'Guest';
  const displayEmail = user?.email || null;
  const displayPhone = user?.phone || null;
  const displayAvatar = user?.profile_pic_url || 'https://i.pravatar.cc/200?img=45';
  const memberSince = user?.created_at
    ? new Date(user.created_at).getFullYear().toString()
    : null;
  const isVerified = user?.is_verified === true;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Navbar />
        <main className="container-main py-8 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-[#1B3FA0] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0f2f5]">
        <Navbar />
        <main className="container-main py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
            <Link href="/signin" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navbar />
      <main className="container-main py-8">
        <nav className="flex items-center gap-2 py-4 text-gray-500 text-sm">
          <span>Account</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 font-bold">Profile</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Summary */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-card border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-6">
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  />
                  <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h1>
                {memberSince && (
                  <p className="text-sm text-gray-500 mb-4">Guest since {memberSince}</p>
                )}
                {isVerified && (
                  <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full mb-6">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm font-bold">Verified Member</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-200 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isVerified ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'}`}>
                {isVerified ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {isVerified ? 'Identity verified' : 'Verification pending'}
                </p>
                <p className="text-xs text-gray-500">
                  {isVerified ? 'Email, phone & ID confirmed' : 'Complete your profile verification'}
                </p>
              </div>
            </div>
          </aside>

          {/* Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={displayName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Email</label>
                  <input
                    type="email"
                    defaultValue={displayEmail || ''}
                    placeholder="Not provided"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-500 ml-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue={displayPhone || ''}
                    placeholder="Not provided"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Contact Preferences</h2>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email notifications', desc: 'Booking updates and offers' },
                  { icon: Phone, label: 'SMS alerts', desc: 'Time-sensitive trip reminders' },
                ].map((p) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={p.label}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-bold text-gray-800">{p.label}</p>
                          <p className="text-xs text-gray-500">{p.desc}</p>
                        </div>
                      </div>
                      <Link href="/account/settings" className="text-sm text-blue-600 font-bold hover:underline">
                        Manage
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
