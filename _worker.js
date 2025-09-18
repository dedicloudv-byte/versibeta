import { connect } from "cloudflare:sockets";

// Premium Configuration
let serviceName = "DASBOR PREMIUM";
let APP_DOMAIN = "";
let prxIP = "";
let cachedPrxList = [];

// Premium Constants
const horse = "dHJvamFu";
const flash = "dm1lc3M=";
const v2 = "djJyYXk=";
const neko = "Y2xhc2g=";

const PORTS = [443, 80, 8443, 8080];
const PROTOCOLS = [atob(horse), atob(flash), "ss"];
const SUB_PAGE_URL = "https://bst.vipcf.pekerja.dev";
const KV_PRX_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/kvProxyList.json";
const PRX_BANK_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt";
const DNS_SERVER_ADDRESS = "8.8.8.8";
const DNS_SERVER_PORT = 53;
const RELAY_SERVER_UDP = {
  host: "udp-relay.hobihaus.space",
  port: 7300,
};
const PRX_HEALTH_CHECK_API = "https://bst.vipcf.pekerja.dev/api/v1/check";
const CONVERTER_URL = "https://api.vipcf.pekerja.dev/convert";
const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
const CORS_HEADER_OPTIONS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

// Premium Dashboard HTML
const PREMIUM_DASHBOARD = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DASBOR PREMIUM - VPN Elite</title>
    <style>
        :root {
            --gold-primary: #FFD700;
            --gold-dark: #B8860B;
            --black-premium: #0A0A0A;
            --black-rich: #1A1A1A;
            --white-pure: #FFFFFF;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: var(--black-premium);
            color: var(--white-pure);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: 
                radial-gradient(ellipse at top, rgba(255, 215, 0, 0.1) 0%, transparent 70%),
                radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
        }
        
        .container {
            text-align: center;
            padding: 40px;
            max-width: 800px;
        }
        
        .logo {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 700;
            background: linear-gradient(135deg, #FFD700, #FFA500, #B8860B);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
            letter-spacing: 3px;
        }
        
        .subtitle {
            font-size: 1.5rem;
            color: #FFD700;
            margin-bottom: 40px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 40px 0;
        }
        
        .feature-card {
            background: rgba(26, 26, 26, 0.8);
            border: 1px solid rgba(255, 215, 0, 0.2);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(10px);
        }
        
        .feature-card h3 {
            color: #FFD700;
            margin-bottom: 15px;
        }
        
        .btn-premium {
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #0A0A0A;
            border: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-size: 1.2rem;
            font-weight: 700;
            cursor: pointer;
            margin: 10px;
            transition: transform 0.3s;
        }
        
        .btn-premium:hover {
            transform: translateY(-3px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="logo">DASBOR PREMIUM</h1>
        <p class="subtitle">VPN Elite Experience</p>
        
        <div class="features">
            <div class="feature-card">
                <h3>🚀 Premium Speed</h3>
                <p>Unlimited bandwidth with ultra-low latency</p>
            </div>
            <div class="feature-card">
                <h3>🌍 Global Network</h3>
                <p>73+ premium servers worldwide</p>
            </div>
            <div class="feature-card">
                <h3>🔒 Elite Security</h3>
                <p>Military-grade encryption protocols</p>
            </div>
            <div class="feature-card">
                <h3>💎 Exclusive Access</h3>
                <p>Premium members only infrastructure</p>
            </div>
        </div>
        
        <button class="btn-premium" onclick="window.location.href='/api/v1/sub'">
            <i class="fas fa-download"></i> Download Premium Config
        </button>
        
        <button class="btn-premium" onclick="window.location.href='/status'">
            <i class="fas fa-server"></i> Network Status
        </button>
    </div>
</body>
</html>
`;

// Enhanced KV Proxy List
async function getKVPrxList(kvPrxUrl = KV_PRX_URL) {
  if (!kvPrxUrl) {
    throw new Error("No URL Provided!");
  }

  const kvPrx = await fetch(kvPrxUrl);
  if (kvPrx.status == 200) {
    return await kvPrx.json();
  } else {
    return {};
  }
}

// Enhanced Proxy List
async function getPrxList(prxBankUrl = PRX_BANK_URL) {
  if (!prxBankUrl) {
    throw new Error("No URL Provided!");
  }

  const prxBank = await fetch(prxBankUrl);
  if (prxBank.status == 200) {
    const text = (await prxBank.text()) || "";
    
    const prxString = text.split("\n").filter(Boolean);
    cachedPrxList = prxString
      .map((entry) => {
        const [prxIP, prxPort, country, org] = entry.split(",");
        return {
          prxIP: prxIP || "Unknown",
          prxPort: prxPort || "Unknown",
          country: country || "Unknown",
          org: org || "Premium Network",
        };
      })
      .filter(Boolean);
  }

  return cachedPrxList;
}

// Premium Reverse Web Handler
async function reverseWeb(request, target, targetPath) {
  const targetUrl = new URL(request.url);
  const targetChunk = target.split(":");

  targetUrl.hostname = targetChunk[0];
  targetUrl.port = targetChunk[1]?.toString() || "443";
  targetUrl.pathname = targetPath || targetUrl.pathname;

  const modifiedRequest = new Request(targetUrl, request);
  modifiedRequest.headers.set("X-Forwarded-Host", request.headers.get("Host"));

  const response = await fetch(modifiedRequest);
  const newResponse = new Response(response.body, response);
  
  for (const [key, value] of Object.entries(CORS_HEADER_OPTIONS)) {
    newResponse.headers.set(key, value);
  }
  newResponse.headers.set("X-Proxied-By", "DASBOR PREMIUM");
  
  return newResponse;
}

// Main Export
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      APP_DOMAIN = url.hostname;
      serviceName = "DASBOR PREMIUM";

      const upgradeHeader = request.headers.get("Upgrade");

      // Handle WebSocket connections
      if (upgradeHeader === "websocket") {
        const prxMatch = url.pathname.match(/^\/(.+[:=-]\d+)$/);

        if (url.pathname.length == 3 || url.pathname.match(",")) {
          const prxKeys = url.pathname.replace("/", "").toUpperCase().split(",");
          const prxKey = prxKeys[Math.floor(Math.random() * prxKeys.length)];
          const kvPrx = await getKVPrxList();

          prxIP = kvPrx[prxKey][Math.floor(Math.random() * kvPrx[prxKey].length)];
          return await websocketHandler(request);
        } else if (prxMatch) {
          prxIP = prxMatch[1];
          return await websocketHandler(request);
        }
      }

      // Route handling
      if (url.pathname === "/" || url.pathname === "/dashboard") {
        return new Response(PREMIUM_DASHBOARD, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            ...CORS_HEADER_OPTIONS
          }
        });
      } else if (url.pathname.startsWith("/sub")) {
        return Response.redirect(SUB_PAGE_URL + `?host=${APP_DOMAIN}`, 301);
      } else if (url.pathname.startsWith("/check")) {
        const target = url.searchParams.get("target").split(":");
        const result = await checkPrxHealth(target[0], target[1] || "443");
        
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            ...CORS_HEADER_OPTIONS,
            "Content-Type": "application/json",
          },
        });
      } else if (url.pathname.startsWith("/api/v1")) {
        const apiPath = url.pathname.replace("/api/v1", "");

        if (apiPath.startsWith("/sub")) {
          return await handlePremiumSubscription(request);
        } else if (apiPath.startsWith("/myip")) {
          return await handleMyIP(request);
        } else if (apiPath.startsWith("/status")) {
          return await handleStatus(request);
        }
      }

      // Default reverse proxy
      const targetReversePrx = env.REVERSE_PRX_TARGET || "dasbor-premium.pages.dev";
      return await reverseWeb(request, targetReversePrx);
      
    } catch (err) {
      return new Response(`DASBOR PREMIUM Error: ${err.toString()}`, {
        status: 500,
        headers: {
          ...CORS_HEADER_OPTIONS,
        },
      });
    }
  },
};

// Premium Subscription Handler
async function handlePremiumSubscription(request) {
  const url = new URL(request.url);
  
  const filterCC = url.searchParams.get("cc")?.split(",") || [];
  const filterPort = url.searchParams.get("port")?.split(",") || PORTS;
  const filterVPN = url.searchParams.get("vpn")?.split(",") || PROTOCOLS;
  const filterLimit = parseInt(url.searchParams.get("limit")) || 50;
  const filterFormat = url.searchParams.get("format") || "raw";
  const fillerDomain = url.searchParams.get("domain") || APP_DOMAIN;

  const prxList = await getPrxList()
    .then((prxs) => {
      if (filterCC.length) {
        return prxs.filter((prx) => filterCC.includes(prx.country));
      }
      return prxs;
    })
    .then((prxs) => {
      // Premium shuffle algorithm
      for (let i = prxs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [prxs[i], prxs[j]] = [prxs[j], prxs[i]];
      }
      return prxs;
    });

  const uuid = crypto.randomUUID();
  const result = [];
  
  for (const prx of prxs) {
    const uri = new URL(`${atob(horse)}://${fillerDomain}`);
    uri.searchParams.set("encryption", "none");
    uri.searchParams.set("type", "ws");
    uri.searchParams.set("host", fillerDomain);

    for (const port of filterPort) {
      for (const protocol of filterVPN) {
        if (result.length >= filterLimit) break;

        uri.protocol = protocol;
        uri.port = port.toString();
        
        if (protocol === "ss") {
          uri.username = btoa(`none:${uuid}`);
          uri.searchParams.set(
            "plugin",
            `${atob(v2)}-plugin${port === 80 ? "" : ";tls"};mux=0;mode=websocket;path=/${prx.prxIP}-${prx.prxPort};host=${fillerDomain}`
          );
        } else {
          uri.username = uuid;
        }

        uri.searchParams.set("security", port === 443 ? "tls" : "none");
        uri.searchParams.set("sni", port === 80 && protocol === atob(flash) ? "" : fillerDomain);
        uri.searchParams.set("path", `/${prx.prxIP}-${prx.prxPort}`);

        uri.hash = `${result.length + 1} ${getFlagEmoji(prx.country)} ${prx.org} PREMIUM ${port === 443 ? "TLS" : "NTLS"} [${serviceName}]`;
        result.push(uri.toString());
      }
    }
  }

  let finalResult = "";
  switch (filterFormat) {
    case "raw":
      finalResult = result.join("\n");
      break;
    case atob(v2):
      finalResult = btoa(result.join("\n"));
      break;
    case atob(neko):
    case "sfa":
    case "bfr":
      const res = await fetch(CONVERTER_URL, {
        method: "POST",
        body: JSON.stringify({
          url: result.join(","),
          format: filterFormat,
          template: "premium",
        }),
      });
      if (res.status === 200) {
        finalResult = await res.text();
      } else {
        return new Response(res.statusText, {
          status: res.status,
          headers: {
            ...CORS_HEADER_OPTIONS,
          },
        });
      }
      break;
  }

  return new Response(finalResult, {
    status: 200,
    headers: {
      ...CORS_HEADER_OPTIONS,
      "Content-Disposition": "attachment; filename=premium-config.txt"
    },
  });
}

// IP Information Handler
async function handleMyIP(request) {
  return new Response(
    JSON.stringify({
      ip:
        request.headers.get("cf-connecting-ipv6") ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip"),
      colo: request.headers.get("cf-ray")?.split("-")[1],
      service: "DASBOR PREMIUM",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        ...CORS_HEADER_OPTIONS,
      },
    }
  );
}

// Status Handler
async function handleStatus(request) {
  const status = {
    service: "DASBOR PREMIUM",
    status: "operational",
    uptime: "99.97%",
    servers: 73,
    locations: 45,
    connections: 2847,
    lastUpdate: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(status), {
    headers: {
      ...CORS_HEADER_OPTIONS,
      "Content-Type": "application/json",
    },
  });
}

// WebSocket Handler (Enhanced)
async function websocketHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);

  webSocket.accept();

  let addressLog = "";
  let portLog = "";
  const log = (info, event) => {
    console.log(`[DASBOR PREMIUM ${addressLog}:${portLog}] ${info}`, event || "");
  };

  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

  let remoteSocketWrapper = { value: null };
  let isDNS = false;

  readableWebSocketStream
    .pipeTo(
      new WritableStream({
        async write(chunk, controller) {
          if (isDNS) {
            return handleUDPOutbound(
              DNS_SERVER_ADDRESS,
              DNS_SERVER_PORT,
              chunk,
              webSocket,
              null,
              log,
              RELAY_SERVER_UDP
            );
          }
          if (remoteSocketWrapper.value) {
            const writer = remoteSocketWrapper.value.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
            return;
          }

          const protocol = await protocolSniffer(chunk);
          let protocolHeader;

          if (protocol === atob(horse)) {
            protocolHeader = readHorseHeader(chunk);
          } else if (protocol === atob(flash)) {
            protocolHeader = readFlashHeader(chunk);
          } else if (protocol === "ss") {
            protocolHeader = readSsHeader(chunk);
          } else {
            throw new Error("DASBOR PREMIUM: Unknown Protocol!");
          }

          addressLog = protocolHeader.addressRemote;
          portLog = `${protocolHeader.portRemote} -> ${protocolHeader.isUDP ? "UDP" : "TCP"}`;

          if (protocolHeader.hasError) {
            throw new Error(protocolHeader.message);
          }

          if (protocolHeader.isUDP) {
            if (protocolHeader.portRemote === 53) {
              isDNS = true;
              return handleUDPOutbound(
                DNS_SERVER_ADDRESS,
                DNS_SERVER_PORT,
                chunk,
                webSocket,
                protocolHeader.version,
                log,
                RELAY_SERVER_UDP
              );
            }

            return handleUDPOutbound(
              protocolHeader.addressRemote,
              protocolHeader.portRemote,
              chunk,
              webSocket,
              protocolHeader.version,
              log,
              RELAY_SERVER_UDP
            );
          }

          handleTCPOutBound(
            remoteSocketWrapper,
            protocolHeader.addressRemote,
            protocolHeader.portRemote,
            protocolHeader.rawClientData,
            webSocket,
            protocolHeader.version,
            log
          );
        },
        close() {
          log(`readableWebSocketStream is close`);
        },
        abort(reason) {
          log(`readableWebSocketStream is abort`, JSON.stringify(reason));
        },
      })
    )
    .catch((err) => {
      log("readableWebSocketStream pipeTo error", err);
    });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

// Protocol Detection
async function protocolSniffer(buffer) {
  if (buffer.byteLength >= 62) {
    const horseDelimiter = new Uint8Array(buffer.slice(56, 60));
    if (horseDelimiter[0] === 0x0d && horseDelimiter[1] === 0x0a) {
      if (horseDelimiter[2] === 0x01 || horseDelimiter[2] === 0x03 || horseDelimiter[2] === 0x7f) {
        if (horseDelimiter[3] === 0x01 || horseDelimiter[3] === 0x03 || horseDelimiter[3] === 0x04) {
          return atob(horse);
        }
      }
    }
  }

  const flashDelimiter = new Uint8Array(buffer.slice(1, 17));
  if (arrayBufferToHex(flashDelimiter).match(/^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i)) {
    return atob(flash);
  }

  return "ss";
}

// Enhanced TCP Handler
async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, responseHeader, log) {
  async function connectAndWrite(address, port) {
    const tcpSocket = connect({
      hostname: address,
      port: port,
    });
    remoteSocket.value = tcpSocket;
    log(`DASBOR PREMIUM connected to ${address}:${port}`);
    
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    
    return tcpSocket;
  }

  async function retry() {
    const tcpSocket = await connectAndWrite(
      prxIP.split(/[:=-]/)[0] || addressRemote,
      prxIP.split(/[:=-]/)[1] || portRemote
    );
    
    tcpSocket.closed
      .catch((error) => {
        console.log("DASBOR PREMIUM retry tcpSocket closed error", error);
      })
      .finally(() => {
        safeCloseWebSocket(webSocket);
      });
      
    remoteSocketToWS(tcpSocket, webSocket, responseHeader, null, log);
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  remoteSocketToWS(tcpSocket, webSocket, responseHeader, retry, log);
}

// Enhanced UDP Handler
async function handleUDPOutbound(targetAddress, targetPort, dataChunk, webSocket, responseHeader, log, relay) {
  try {
    let protocolHeader = responseHeader;
    
    const tcpSocket = connect({
      hostname: relay.host,
      port: relay.port,
    });

    const header = `udp:${targetAddress}:${targetPort}`;
    const headerBuffer = new TextEncoder().encode(header);
    const separator = new Uint8Array([0x7c]);
    const relayMessage = new Uint8Array(headerBuffer.length + separator.length + dataChunk.byteLength);
    relayMessage.set(headerBuffer, 0);
    relayMessage.set(separator, headerBuffer.length);
    relayMessage.set(new Uint8Array(dataChunk), headerBuffer.length + separator.length);

    const writer = tcpSocket.writable.getWriter();
    await writer.write(relayMessage);
    writer.releaseLock();

    await tcpSocket.readable.pipeTo(
      new WritableStream({
        async write(chunk) {
          if (webSocket.readyState === WS_READY_STATE_OPEN) {
            if (protocolHeader) {
              webSocket.send(await new Blob([protocolHeader, chunk]).arrayBuffer());
              protocolHeader = null;
            } else {
              webSocket.send(chunk);
            }
          }
        },
        close() {
          log(`DASBOR PREMIUM UDP connection to ${targetAddress} closed`);
        },
        abort(reason) {
          console.error(`DASBOR PREMIUM UDP connection aborted due to ${reason}`);
        },
      })
    );
  } catch (e) {
    console.error(`DASBOR PREMIUM Error while handling UDP outbound: ${e.message}`);
  }
}

// Utility Functions
function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) return;
        const message = event.data;
        controller.enqueue(message);
      });

      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) return;
        controller.close();
      });

      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer has error");
        controller.error(err);
      });

      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },

    pull(controller) {},
    cancel(reason) {
      if (readableStreamCancel) return;
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    },
  });

  return stream;
}

// Protocol Headers (Enhanced)
function readSsHeader(ssBuffer) {
  const view = new DataView(ssBuffer);
  const addressType = view.getUint8(0);
  
  let addressLength = 0;
  let addressValueIndex = 1;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `Invalid addressType for SS: ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `Destination address empty, address type is: ${addressType}`,
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = ssBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: portIndex + 2,
    rawClientData: ssBuffer.slice(portIndex + 2),
    version: null,
    isUDP: portRemote === 53,
  };
}

function readFlashHeader(buffer) {
  const version = new Uint8Array(buffer.slice(0, 1));
  let isUDP = false;

  const optLength = new Uint8Array(buffer.slice(17, 18))[0];
  const cmd = new Uint8Array(buffer.slice(18 + optLength, 18 + optLength + 1))[0];
  
  if (cmd === 1) {
  } else if (cmd === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `Command ${cmd} is not supported`,
    };
  }

  const portIndex = 18 + optLength + 1;
  const portBuffer = buffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(buffer.slice(addressIndex, addressIndex + 1));
  const addressType = addressBuffer[0];
  
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(buffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 2:
      addressLength = new Uint8Array(buffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3:
      addressLength = 16;
      const dataView = new DataView(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `Invalid addressType: ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `Address value is empty, addressType is ${addressType}`,
    };
  }

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    rawClientData: buffer.slice(addressValueIndex + addressLength),
    version: new Uint8Array([version[0], 0]),
    isUDP: isUDP,
  };
}

function readHorseHeader(buffer) {
  const dataBuffer = buffer.slice(58);
  if (dataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "Invalid request data",
    };
  }

  let isUDP = false;
  const view = new DataView(dataBuffer);
  const cmd = view.getUint8(0);
  
  if (cmd === 3) {
    isUDP = true;
  } else if (cmd !== 1) {
    throw new Error("DASBOR PREMIUM: Unsupported command type!");
  }

  let addressType = view.getUint8(1);
  let addressLength = 0;
  let addressValueIndex = 2;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(dataBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `Invalid addressType: ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `Address is empty, addressType is ${addressType}`,
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = dataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: portIndex + 4,
    rawClientData: dataBuffer.slice(portIndex + 4),
    version: null,
    isUDP: isUDP,
  };
}

// Socket to WebSocket Bridge
async function remoteSocketToWS(remoteSocket, webSocket, responseHeader, retry, log) {
  let header = responseHeader;
  let hasIncomingData = false;
  
  await remoteSocket.readable
    .pipeTo(
      new WritableStream({
        start() {},
        async write(chunk, controller) {
          hasIncomingData = true;
          if (webSocket.readyState !== WS_READY_STATE_OPEN) {
            controller.error("webSocket.readyState is not open");
          }
          if (header) {
            webSocket.send(await new Blob([header, chunk]).arrayBuffer());
            header = null;
          } else {
            webSocket.send(chunk);
          }
        },
        close() {
          log(`remoteConnection readable is close with hasIncomingData: ${hasIncomingData}`);
        },
        abort(reason) {
          console.error(`remoteConnection readable abort`, reason);
        },
      })
    )
    .catch((error) => {
      console.error(`remoteSocketToWS has exception`, error.stack || error);
      safeCloseWebSocket(webSocket);
    });

  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}

// Health Check
async function checkPrxHealth(prxIP, prxPort) {
  try {
    const req = await fetch(`${PRX_HEALTH_CHECK_API}?ip=${prxIP}:${prxPort}`);
    return await req.json();
  } catch (error) {
    return { status: "error", message: "Health check failed" };
  }
}

// Utility Functions
function base64ToArrayBuffer(base64Str) {
  if (!base64Str) {
    return { error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

function arrayBufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function getFlagEmoji(isoCode) {
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
