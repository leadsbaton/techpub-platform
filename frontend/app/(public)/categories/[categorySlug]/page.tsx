import React from "react";

interface PageProps {
  params: {
    categorySlug: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <h1>Category: {params.categorySlug}</h1>
      <p>Browse content in category: {params.categorySlug}</p>
    </div>
  );
}