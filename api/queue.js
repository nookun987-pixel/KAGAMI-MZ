export default async function handler(req, res) {
  const bridgeUrl = process.env.LOCAL_MIKAGE_BRIDGE_URL || 'http://localhost:3031';
  
  try {
    // Proxy to local bridge
    const response = await fetch(`${bridgeUrl}/queue`);
    const data = await response.json();
    
    res.status(response.ok ? 200 : 500).json(data);
    
  } catch (error) {
    console.error('[API] Get queue failed:', error);
    res.status(500).json({ error: error.message });
  }
}
