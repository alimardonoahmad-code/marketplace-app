/** @type {import('next').NextConfig} */
const backendUrl = (
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'
).replace(/\/api\/?$/, '');

function getBackendImagePatterns() {
  const patterns = [
    { protocol: 'https', hostname: 'picsum.photos' },
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'http', hostname: 'localhost', port: '3001', pathname: '/uploads/**' },
    { protocol: 'http', hostname: '127.0.0.1', port: '3001', pathname: '/uploads/**' },
  ];

  try {
    const parsed = new URL(backendUrl);
    patterns.push({
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: '/uploads/**',
    });
  } catch {
    // ignore invalid backend URL at build time
  }

  return patterns;
}

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: getBackendImagePatterns(),
  },
  compress: true,
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backendUrl}/uploads/:path*` },
    ];
  },
};

module.exports = nextConfig;
