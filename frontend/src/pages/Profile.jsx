import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function UserIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function InputField({ icon: Icon, label, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          <Icon />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-shadow duration-200"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');

  const [accountHolder, setAccountHolder] = useState(user?.bankDetails?.accountHolder || '');
  const [accountNumber, setAccountNumber] = useState(user?.bankDetails?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(user?.bankDetails?.ifscCode || '');
  const [bankName, setBankName] = useState(user?.bankDetails?.bankName || '');
  const [bankSaving, setBankSaving] = useState(false);
  const [bankMsg, setBankMsg] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileSaving(true);
    try {
      const res = await api.put('/auth/profile', { name, email });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setProfileMsg('Profile updated successfully');
    } catch (err) {
      setProfileMsg(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordSaving(true);
    try {
      const res = await api.post('/auth/change-password', { currentPassword, newPassword });
      setPasswordMsg(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordMsg(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();
    setBankMsg('');
    setBankSaving(true);
    try {
      const res = await api.put('/auth/bank-details', { accountHolder, accountNumber, ifscCode, bankName });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setBankMsg('Bank details updated successfully');
    } catch (err) {
      setBankMsg(err.response?.data?.error || 'Failed to update bank details');
    } finally {
      setBankSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account profile and preferences</p>
      </div>

      <form onSubmit={handleProfileUpdate} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500">
            <UserIcon />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your name and email address</p>
          </div>
        </div>

        {profileMsg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            profileMsg.includes('successfully')
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {profileMsg.includes('successfully') ? <CheckIcon /> : null}
            {profileMsg}
          </div>
        )}

        <InputField icon={UserIcon} label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        <InputField icon={MailIcon} label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" />

        <button
          type="submit" disabled={profileSaving}
          className="w-full bg-gold-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-gold-200 flex items-center justify-center gap-2"
        >
          {profileSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <SaveIcon />
              Save Changes
            </>
          )}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500">
            <LockIcon />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change Password</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your account password</p>
          </div>
        </div>

        {passwordMsg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            passwordMsg.includes('successfully')
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {passwordMsg.includes('successfully') ? <CheckIcon /> : null}
            {passwordMsg}
          </div>
        )}

        <InputField icon={LockIcon} label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Enter current password" />
        <InputField icon={LockIcon} label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Enter new password (min 6 characters)" />

        <button
          type="submit" disabled={passwordSaving}
          className="w-full bg-gold-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-gold-200 flex items-center justify-center gap-2"
        >
          {passwordSaving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Updating...
            </>
          ) : (
            <>
              <LockIcon />
              Update Password
            </>
          )}
        </button>
      </form>

      {user?.role === 'author' && (
        <form onSubmit={handleBankUpdate} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500">
              <BankIcon />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Bank Details</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Update your payout bank information</p>
            </div>
          </div>

          {bankMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              bankMsg.includes('successfully')
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {bankMsg.includes('successfully') ? <CheckIcon /> : null}
              {bankMsg}
            </div>
          )}

          <InputField icon={BankIcon} label="Account Holder Name" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Name on bank account" />
          <InputField icon={BankIcon} label="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Bank account number" />
          <InputField icon={BankIcon} label="IFSC Code" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} placeholder="IFSC code" />
          <InputField icon={BankIcon} label="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Bank name" />

          <button
            type="submit" disabled={bankSaving}
            className="w-full bg-gold-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-gold-200 flex items-center justify-center gap-2"
          >
            {bankSaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <SaveIcon />
                Save Bank Details
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
