/**
 * P0 FORENSIC TEST C: img2img through proxy with denoise=0.01
 * Tests proxy endpoint with image-to-image generation
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PROXY_URL = process.env.PROXY_URL || 'http://127.0.0.1:7866';

// Create a minimal 1x1 PNG for testing (or load existing test image)
function getTestImageBase64() {
    // Minimal valid 1x1 red PNG in base64
    // This is a 1x1 red pixel PNG
    const minimalPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    return `data:image/png;base64,${minimalPng}`;
}

// Try to load a real test image if available
function loadTestImage() {
    const testPaths = [
        'd:\\KAGAMI-MZ\\data\\test_source.txt', // This is text, skip
        'd:\\KAGAMI-MZ\\runs\\MASK_MACRO_RUN_01\\final_decision.json', // json
    ];

    // Search for any PNG in runs directory
    const runsDir = 'd:\\KAGAMI-MZ\\runs';
    try {
        const files = fs.readdirSync(runsDir, { recursive: true });
        for (const f of files) {
            if (typeof f === 'string' && f.endsWith('.png')) {
                const fullPath = path.join(runsDir, f);
                try {
                    const data = fs.readFileSync(fullPath);
                    console.log(`[TEST C] Found test image: ${fullPath} (${data.length} bytes)`);
                    return `data:image/png;base64,${data.toString('base64')}`;
                } catch (e) {
                    // continue
                }
            }
        }
    } catch (e) {
        console.log("[TEST C] Could not scan runs directory, using minimal test image");
    }

    return getTestImageBase64();
}

const testImageBase64 = loadTestImage();

const testPayload = {
    prompt: "a red apple on a wooden table, photorealistic, detailed",
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
    generation_mode: "reproduction",
    reproduction_anchor_mode: "image_anchored",
    preservation_mode: "strong_preservation",
    anchor_image_base64: testImageBase64,
    denoise_strength: 0.01,  // Very low denoise for img2img
    anchor_strength: 0.95
};

async function runProxyImg2ImgTest() {
    console.log("[TEST C] img2img through proxy with denoise=0.01");
    console.log("[TEST C] Target:", PROXY_URL + '/generate');
    console.log("[TEST C] Image base64 length:", testImageBase64.length);
    console.log("[TEST C] Payload (no base64):", JSON.stringify({
        ...testPayload,
        anchor_image_base64: `[${testImageBase64.length} chars]`
    }, null, 2));

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
                'Content-Length': Buffer.byteLength(data)
            }
        };

        console.log("[TEST C] Request body size:", Buffer.byteLength(data), "bytes");

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const elapsed = Date.now() - startTime;
                try {
                    const result = JSON.parse(body);
                    console.log(`[TEST C] Response in ${elapsed}ms:`);
                    console.log("[TEST C] Status:", res.statusCode);

                    if (Array.isArray(result) && result.length > 0 && result[0].base64) {
                        console.log("[TEST C] Images returned:", result.length);
                        console.log("[TEST C] First image base64 length:", result[0].base64?.length);
                        resolve({ success: true, statusCode: res.statusCode, result, elapsed });
                    } else if (result.success === false) {
                        console.log("[TEST C] Error:", result.error);
                        resolve({ success: false, statusCode: res.statusCode, error: result.error, elapsed });
                    } else {
                        console.log("[TEST C] Response:", JSON.stringify(result, null, 2).substring(0, 500));
                        resolve({ success: res.statusCode === 200, statusCode: res.statusCode, result, elapsed });
                    }
                } catch (e) {
                    console.log("[TEST C] Raw response:", body.substring(0, 500));
                    resolve({ success: false, error: e.message, raw: body, elapsed });
                }
            });
        });

        req.on('error', (err) => {
            console.error("[TEST C] Request error:", err.message);
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

runProxyImg2ImgTest()
    .then(r => {
        console.log("\n[TEST C RESULT]", r.success ? "PASS" : "FAIL");
        process.exit(0);
    })
    .catch(e => {
        console.error("\n[TEST C RESULT] FAIL:", e.message);
        process.exit(1);
    });
