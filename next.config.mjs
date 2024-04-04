/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["utfs.io"],
        remotePatterns: [
            {
                hostname: "utfs.io",
                protocol: "https"
            }
        ]
    }
};

export default nextConfig;
