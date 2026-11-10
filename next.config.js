/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The old Video page was folded into Services in the 2026-11 redesign.
      { source: '/video', destination: '/services#video', permanent: true },
    ];
  },
};

module.exports = nextConfig;
