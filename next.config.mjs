import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Exclude large music files from API route bundles
  outputFileTracingExcludes: {
    '/api/download-album': [
      './public/Music/Discography/**/*.wav',
      './public/Music/Discography/**/*.mp3',
      './public/Music/Discography/**/*.flac',
    ],
  },
};

export default withMDX(nextConfig);
