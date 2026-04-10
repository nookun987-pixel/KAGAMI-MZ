/**
 * P0 FORENSIC TEST A: txt2img direct to raw Fooocus Gradio
 * Tests direct WebSocket call to Fooocus without proxy
 */
const WebSocket = require('ws');
const crypto = require('crypto');

const FOOOCUS_URL = process.env.FOOOCUS_GRADIO_URL || 'ws://127.0.0.1:7865';
const GENERATE_FN_INDEX = 67;

// Build minimal txt2img args (no image input)
function buildTxt2ImgArgs() {
    const nLoras = 5;
    const nCn = 4;
    const nEnhance = 3;

    const args = [
        null,  // Gradio state placeholder
        false, // Generate Image Grid
        "a red apple on a wooden table", // Prompt
        "",    // Negative Prompt
        [],    // Styles
        "Quality", // Performance
        "1024×1024", // Aspect Ratio
        1,     // Image Number
        "png", // Output Format
        "-1",  // Seed
        false, // Read wildcards in order
        2.0,   // Sharpness
        7.0,   // Guidance Scale
        "juggernautXL_v8Rundiffusion.safetensors", // Base Model
        "None", // Refiner
        0.5,   // Refiner Switch
    ];

    // LoRA slots
    for (let i = 0; i < nLoras; i++) {
        args.push(false, "None", 1.0);
    }

    // Image input block - NO IMAGE for txt2img
    args.push(
        false,       // Input Image checkbox
        "uov",       // current_tab
        "Disabled",  // Upscale or Variation
        null,        // UoV Image
        [],          // Outpaint Direction
        null,        // Inpaint Image
        "",          // Inpaint Additional Prompt
        null,        // Mask Upload
    );

    // Advanced settings (simplified)
    args.push(
        false, false, false, false, 1.5, 0.8, 0.3, 7.0, -1,
        "dpmpp_2m_sde_gpu", "karras", "Default (model)",
        -1, -1, -1, -1,
        -1.0, // Forced Vary Strength
        -1.0,
        false, false, false, false, 64, 128, "joint", 0.25,
        false, 1.01, 1.02, 0.99, 0.95,
        false, false, "v2.6", 1.0, 0.618, false, false, 0,
        false, false, "fooocus",
    );

    // CN slots
    for (let i = 0; i < nCn; i++) {
        args.push(null, 0.5, 0.6, "ImagePrompt");
    }

    // GroundingDINO + enhance header
    args.push(false, 0, false, null, false, "Disabled", "Before First Enhancement", "original");

    // Enhance slots
    for (let i = 0; i < nEnhance; i++) {
        args.push(false, "", "", "", "isnet-general-use", "full", "vit_b", 0.25, 0.3, 10, false, "v2.6", 1.0, 0.618, 0, false);
    }

    return args;
}

async function runDirectTest() {
    console.log("[TEST A] Direct txt2img to raw Fooocus Gradio");
    console.log("[TEST A] Target:", FOOOCUS_URL);

    const sessionHash = crypto.randomBytes(6).toString('hex');
    const wsUrl = FOOOCUS_URL.replace('http://', 'ws://').replace('https://', 'wss://') + '/queue/join';

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl, { maxPayload: 100 * 1024 * 1024 });
        const startTime = Date.now();
        let result = null;

        ws.on('open', () => {
            console.log("[TEST A] WebSocket connected");
        });

        ws.on('message', (data) => {
            const msg = JSON.parse(data.toString());
            const msgType = msg.msg;

            console.log(`[TEST A] WS recv: ${msgType}`);

            if (msgType === 'send_hash') {
                ws.send(JSON.stringify({
                    fn_index: GENERATE_FN_INDEX,
                    session_hash: sessionHash,
                }));
            } else if (msgType === 'send_data') {
                const args = buildTxt2ImgArgs();
                console.log(`[TEST A] Sending ${args.length} args`);
                console.log("[TEST A] Image arg (index 18):", args[18]);

                ws.send(JSON.stringify({
                    fn_index: GENERATE_FN_INDEX,
                    data: args,
                    session_hash: sessionHash,
                }));
            } else if (msgType === 'process_completed') {
                result = msg.output;
                const elapsed = Date.now() - startTime;
                console.log(`[TEST A] Completed in ${elapsed}ms`);
                console.log("[TEST A] Result:", JSON.stringify(result, null, 2).substring(0, 500));
                ws.close();
                resolve({ success: true, result, elapsed });
            } else if (msgType === 'close_stream') {
                ws.close();
                resolve({ success: false, error: 'Stream closed without result' });
            }
        });

        ws.on('error', (err) => {
            console.error("[TEST A] WebSocket error:", err.message);
            reject(err);
        });

        ws.on('close', () => {
            console.log("[TEST A] WebSocket closed");
        });

        setTimeout(() => {
            ws.close();
            reject(new Error('Timeout after 120s'));
        }, 120000);
    });
}

runDirectTest()
    .then(r => {
        console.log("\n[TEST A RESULT]", r.success ? "PASS" : "FAIL");
        process.exit(0);
    })
    .catch(e => {
        console.error("\n[TEST A RESULT] FAIL:", e.message);
        process.exit(1);
    });
