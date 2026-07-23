import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { LuUser as User, LuShoppingBag as ShoppingBag, LuMapPin as MapPin } from 'react-icons/lu';
import { fetchUserOrders } from '../../order/slice/orderSlice';

import ProfileDetails from '../components/ProfileDetails';
import MyOrders from '../components/MyOrders';
import MyAddresses from '../components/MyAddresses';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const currentTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (user?.id) {
       dispatch(fetchUserOrders(user.id));
    }
  }, [dispatch, user?.id]);

  const tabs = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'My Addresses', icon: MapPin },
  ];

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-50/50 dark:bg-background py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Tabs */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm sticky top-8">
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
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {currentTab === 'profile' && <ProfileDetails user={user} />}
            {currentTab === 'orders' && <MyOrders />}
            {currentTab === 'addresses' && <MyAddresses />}
          </div>
        </div>
      </div>
    </div>
  );
}
