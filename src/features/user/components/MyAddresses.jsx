import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress, clearAddressError } from '../redux/addressSlice';
import { LuMapPin as MapPin, LuPlus as Plus, LuTrash2 as Trash, LuPencil as Edit, LuCheck as CheckCircle2, LuLoader as Loader2 } from 'react-icons/lu';
import { toast } from 'sonner';

export default function MyAddresses() {
  const dispatch = useDispatch();
  const { addresses, loading } = useSelector((state) => state.address);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false,
  });

  const handleOpenForm = (address = null) => {
    if (address) {
      setEditingId(address.id);
      setFormData({
        title: address.title || '',
        addressLine: address.addressLine || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        isDefault: address.isDefault || false,
      });
      setIsAdding(false);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        addressLine: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false,
      });
      setIsAdding(true);
    }
  };

  const handleCloseForm = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const result = await dispatch(updateAddress({ addressId: editingId, addressData: formData }));
      if (updateAddress.fulfilled.match(result)) {
        toast.success('Address updated successfully');
        handleCloseForm();
      } else {
        toast.error(result.payload || 'Failed to update address');
      }
    } else {
      const result = await dispatch(addAddress(formData));
      if (addAddress.fulfilled.match(result)) {
        toast.success('Address added successfully');
        handleCloseForm();
      } else {
        toast.error(result.payload || 'Failed to add address');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const result = await dispatch(deleteAddress(id));
      if (deleteAddress.fulfilled.match(result)) {
        toast.success('Address deleted');
      } else {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id) => {
    const result = await dispatch(setDefaultAddress(id));
    if (setDefaultAddress.fulfilled.match(result)) {
      toast.success('Default address updated');
    }
  };

  if (loading && addresses.length === 0) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Addresses</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your saved delivery locations</p>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={() => handleOpenForm()}
            className="bg-primary-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center shadow-sm shadow-primary-500/20"
            disabled={addresses.length >= 10}
          >
            <Plus className="w-5 h-5 mr-2" /> Add Address
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold mb-6">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Address Title</label>
                <input required name="title" value={formData.title} onChange={handleChange} placeholder="Home, Office, etc." className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-foreground">Street Address</label>
                <textarea required name="addressLine" value={formData.addressLine} onChange={handleChange} rows="2" className="w-full p-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">State/Province</label>
                <input required name="state" value={formData.state} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Postal Code</label>
                <input required name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Country</label>
                <input required name="country" value={formData.country} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-background border-2 border-muted hover:border-border focus:border-primary-500 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-medium" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500" />
              <label htmlFor="isDefault" className="text-sm font-medium text-foreground cursor-pointer">Set as default address</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
              <button type="button" onClick={handleCloseForm} className="px-6 py-2.5 rounded-xl font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button type="submit" className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-sm">Save Address</button>
            </div>
          </form>
        </div>
      )}

      {!isAdding && !editingId && addresses.length === 0 && (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-6">Add an address for a quicker checkout experience.</p>
          <button onClick={() => handleOpenForm()} className="bg-primary-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors">
            Add Your First Address
          </button>
        </div>
      )}

      {!isAdding && !editingId && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-card border-2 rounded-2xl p-5 transition-all ${addr.isDefault ? 'border-primary-500 shadow-md' : 'border-border hover:border-primary-500/50 hover:shadow-sm'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-foreground text-lg">{addr.title}</span>
                  {addr.isDefault && <span className="bg-primary-500/10 text-primary-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Default</span>}
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleOpenForm(addr)} className="p-2 text-muted-foreground hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-foreground text-sm font-medium mb-1">{addr.addressLine}</p>
              <p className="text-muted-foreground text-sm">{addr.city}, {addr.state} {addr.postalCode}</p>
              <p className="text-muted-foreground text-sm">{addr.country}</p>
              
              {!addr.isDefault && (
                <button onClick={() => handleSetDefault(addr.id)} className="mt-4 text-primary-500 text-sm font-bold hover:underline">
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
