export default async function handler(req, res) {
  const bridgeUrl = process.env.LOCAL_MIKAGE_BRIDGE_URL || 'http://localhost:3031';
  
  try {
    const response = await fetch(`${bridgeUrl}/latest-run`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(200).json({
      error: `Bridge offline: ${error.message}`
    });
  }
}
