import React from "react";

interface PageProps {
  params: {
    contentType: string;
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <h1>Content Type: {params.contentType}</h1>
      <h2>Slug: {params.slug}</h2>
      <p>Dynamic content page for {params.contentType}/{params.slug}</p>
    </div>
  );
}