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
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			}
		],
	},
};

export default nextConfig;
