/** @type {import("next").NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "profile.line-scdn.net",
				pathname: "/**",
			}
		],
	},
};

export default nextConfig;
