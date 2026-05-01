import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Canonical({ url }: { url: string }) {
  return (
    <Helmet>
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
