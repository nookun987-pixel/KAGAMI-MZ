export default async function handler(req, res) {
  const bridgeUrl = process.env.LOCAL_MIKAGE_BRIDGE_URL || 'http://localhost:3031';
  
  try {
    const response = await fetch(`${bridgeUrl}/health`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(200).json({
      system: "MIKAGE",
      status: "BRIDGE_OFFLINE",
      time: new Date().toISOString(),
      services: {
        bridge: {
          status: "DOWN",
          detail: `Cannot connect to ${bridgeUrl}: ${error.message}`
        }
      }
    });
  }
}
