"use client";

import CategoryManage from "./CategoryManage";
import UserManage from "./UserManage";

const Admin = () => {
  return (
    <div className="flex flex-col gap-4 items-center py-20">
      <h1 className="font-bold text-2xl">Admin</h1>
      <CategoryManage />
      <UserManage />
    </div>
  );
};

export default Admin;
