import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { LuUser as User, LuShoppingBag as ShoppingBag, LuMapPin as MapPin, LuShield as Shield, LuLogOut } from 'react-icons/lu';
import { fetchUserOrders } from '../../order/slice/orderSlice';
import { fetchUserAddresses } from '../redux/addressSlice';
import { logout } from '../../auth/redux/authThunk';

import ProfileDetails from '../components/ProfileDetails';
import MyOrders from '../components/MyOrders';
import MyAddresses from '../components/MyAddresses';
import SecuritySettings from '../components/SecuritySettings';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const currentTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (user?.id) {
       dispatch(fetchUserOrders({ userId: user.id, page: 0, size: 5 }));
       dispatch(fetchUserAddresses());
    }
  }, [dispatch, user?.id]);

  const tabs = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-50/50 dark:bg-background py-8 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm sticky top-[104px]">
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 custom-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <div className="hidden lg:block my-2 border-t border-border"></div>
                
                <button
                  onClick={async () => {
                      await dispatch(logout());
                      window.location.href = '/';
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap text-red-500 hover:bg-red-500/10 hover:text-red-600"
                >
                  <LuLogOut className="w-5 h-5 text-red-500" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {currentTab === 'profile' && <ProfileDetails user={user} />}
            {currentTab === 'orders' && <MyOrders />}
            {currentTab === 'addresses' && <MyAddresses />}
            {currentTab === 'security' && <SecuritySettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
