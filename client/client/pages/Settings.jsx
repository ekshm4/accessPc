import { useState } from 'react';
import { SettingsIcon, UserIcon, ShieldIcon, ClockIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { useAuth } from '../../lib/AuthContext';

export default function Settings() {
  const { user: currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'history', label: 'Watch History', icon: ClockIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="flex flex-col md:flex-row h-[calc(100%-60px)]">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors
                    ${activeTab === tab.id
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Profile Information</h2>
                <div className="card p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Username</Label>
                      <Input value={currentUser?.username || ''} disabled />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={currentUser?.email || ''} disabled />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Account Stats</h2>
                <div className="card p-6">
                  <p className="text-muted-foreground">
                    Watch history entries: {currentUser?._count?.watchHistory || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Change Password</h2>
                <div className="card p-6 space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h2>
                <div className="card p-6">
                  <Button variant="destructive" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Watch History</h2>
                <Button variant="outline" size="sm">Clear All</Button>
              </div>
              <p className="text-muted-foreground">
                Your watch history will appear here as you view media.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
