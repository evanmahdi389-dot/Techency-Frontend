import React from 'react';
import OrderManagementTable from '../../components/OrderManagementTable';

const OrderManagement = () => {
  return (
    <div className="p-4 md:p-6 w-full h-full bg-[#EAEFF5]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[26px] font-extrabold text-[#002546]">Order Management</h2>
      </div>
      <OrderManagementTable role="Project Manager" />
    </div>
  );
};

export default OrderManagement;
