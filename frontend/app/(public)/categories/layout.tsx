import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CategoriesLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
