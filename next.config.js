/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "image.tmdb.org",
      "www.freepnglogos.com",
      "lh3.googleusercontent.com",
      "lottiefiles.com",
    ],
  },
};

module.exports = nextConfig;
