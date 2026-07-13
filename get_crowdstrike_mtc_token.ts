// bun automatically loads .env files, so no extra import is needed
const clientId = Bun.env.CROWDSTRIKE_CLIENT_ID;
const clientSecret = Bun.env.CROWDSTRIKE_CLIENT_SECRET;
const baseUrl = Bun.env.CROWDSTRIKE_BASE_URL;

// Validate the environment variables
if (!clientId || !clientSecret || !baseUrl) {
    console.error("Missing required environmnt variables.");
    console.error(`CROWDSTRIKE_CLIENT_ID: ${clientId}`);
    console.error(`CROWDSTRIKE_CLIENT_SECRET: ${clientSecret}`);
    console.error(`CROWDSTRIKE_BASE_URL: ${baseUrl}`);
    process.exit(1);
}

console.log("All credentials loaded successfully.");
