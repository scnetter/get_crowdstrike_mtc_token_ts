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


// Bun exposes CLI arguments via Bun.argv
// Bun.argv[0] is the bun binary, Bun.argv[1] is the script path, Bun.argv[2] is the first argument
const deviceId = Bun.argv[2];

if(!deviceId){
    console.error("Error: Device ID is required");
  console.error("\nUsage: bun run get_crowdstrike_mtc_token.ts <device_id>");
  console.error("\n## To get the device ID, on the target host run one of the commands below based on your operating system. ##");
  console.error("Windows:");
  console.error("  reg query HKLM\\System\\CurrentControlSet\\services\\CSAgent\\Sim\\ /f AG");
  console.error("MacOS:");
  console.error("  sudo /Applications/Falcon.app/Contents/Resources/falconctl stats | grep agentID");
  console.error("Linux:");
  console.error("  sudo /opt/CrowdStrike/falconctl -g --aid");
  console.error("\nThe device id is the value returned. It will be listed as 'aid', agentID or AG depending on the system.");
  process.exit(1);
}

console.log(`Device ID: ${deviceId}`);

async function getAuthToken(baseUrl: string, clientId: string, clientSecret: string): Promise<string> {
    const url = `${baseUrl.replace(/\/$/, '')}/oauth2/token`;

    // Build the form-urlencoded payload
    const body = new URLSearchParams();
    body.append('client_id', clientId);
    body.append('client_secret', clientSecret);
    
    console.log("Autneticating with Crowstrike API...");

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: body
    });

    if(!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed (${response.status}); ${errorText}`);
    }

    // Parse the JSON response safely
    const data = await response.json() as { access_token: string };
    return data.access_token;
}