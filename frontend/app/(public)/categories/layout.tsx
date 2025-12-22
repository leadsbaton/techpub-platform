import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CategoriesLayout({ children }: LayoutProps) {
  return (
    <div>
      <h1>Categories</h1>
      {children}
    </div>
  );
}