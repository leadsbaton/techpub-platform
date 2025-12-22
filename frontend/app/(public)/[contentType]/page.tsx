import React from "react";

interface PageProps {
  params: {
    contentType: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <h1>Content Type: {params.contentType}</h1>
      <p>Browse content of type: {params.contentType}</p>
    </div>
  );
}