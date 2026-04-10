/**
 * P0 FORENSIC TEST B: txt2img through proxy
 * Tests proxy endpoint with text-only generation
 */
const http = require('http');

const PROXY_URL = process.env.PROXY_URL || 'http://127.0.0.1:7866';

const testPayload = {
    prompt: "a red apple on a wooden table, photorealistic",
    negative_prompt: "",
    seed: -1,
    width: 1024,
    height: 1024,
    performance_selection: "Speed",
    style_selections: [],
    image_number: 1,
    guidance_scale: 7.0,
    steps: 15,
    sharpness: 2.0,
    generation_mode: "exploration"
    // NO anchor_image - this is txt2img
};

async function runProxyTest() {
    console.log("[TEST B] txt2img through proxy");
    console.log("[TEST B] Target:", PROXY_URL + '/generate');
    console.log("[TEST B] Payload:", JSON.stringify(testPayload, null, 2));

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        const data = JSON.stringify(testPayload);
        const options = {
            hostname: '127.0.0.1',
            port: 7866,
            path: '/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const elapsed = Date.now() - startTime;
                try {
                    const result = JSON.parse(body);
                    console.log(`[TEST B] Response in ${elapsed}ms:`);
                    console.log("[TEST B] Status:", res.statusCode);

                    if (Array.isArray(result) && result.length > 0 && result[0].base64) {
                        console.log("[TEST B] Images returned:", result.length);
                        console.log("[TEST B] First image base64 length:", result[0].base64?.length);
                        resolve({ success: true, statusCode: res.statusCode, result, elapsed });
                    } else if (result.success === false) {
                        console.log("[TEST B] Error:", result.error);
                        resolve({ success: false, statusCode: res.statusCode, error: result.error, elapsed });
                    } else {
                        console.log("[TEST B] Response:", JSON.stringify(result, null, 2).substring(0, 500));
                        resolve({ success: res.statusCode === 200, statusCode: res.statusCode, result, elapsed });
                    }
                } catch (e) {
                    console.log("[TEST B] Raw response:", body.substring(0, 500));
                    resolve({ success: false, error: e.message, raw: body, elapsed });
                }
            });
        });

        req.on('error', (err) => {
            console.error("[TEST B] Request error:", err.message);
            reject(err);
        });

        req.write(data);
        req.end();

        setTimeout(() => {
            req.destroy();
            reject(new Error('Timeout after 120s'));
        }, 120000);
    });
}

runProxyTest()
    .then(r => {
        console.log("\n[TEST B RESULT]", r.success ? "PASS" : "FAIL");
        process.exit(0);
    })
    .catch(e => {
        console.error("\n[TEST B RESULT] FAIL:", e.message);
        process.exit(1);
    });
