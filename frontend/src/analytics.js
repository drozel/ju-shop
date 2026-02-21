let analyticsInitialized = false;

const SCRIPT_ID = "ju-shop-analytics-script";

function normalizeHost(host) {
  return host.replace(/\/+$/, "");
}

function buildRuntimeConfigUrl() {
  // Prefer relative path first to support BASE_PATH deployments.
  return "api/runtime-config";
}

function buildRuntimeConfigUrlCandidates() {
  const candidates = [buildRuntimeConfigUrl(), "/api/runtime-config"];
  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    candidates.push(`/${segments[0]}/api/runtime-config`);
  }
  return [...new Set(candidates)];
}

async function fetchRuntimeConfig() {
  const candidates = buildRuntimeConfigUrlCandidates();
  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      return await response.json();
    } catch (error) {
      // Try next candidate.
    }
  }
  return null;
}

function setupUmami(config) {
  const host = normalizeHost(config.host || "");
  const siteId = (config.siteId || "").trim();
  const proxyEnabled = config.proxyEnabled !== false;
  const proxyBase = normalizeHost(config.proxyBase || "api/u");

  if (!siteId) {
    return;
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.defer = true;
  script.dataset.websiteId = siteId;
  if (proxyEnabled) {
    script.dataset.hostUrl = proxyBase;
    script.src = `${proxyBase}/script.js`;
  } else if (host) {
    script.src = `${host}/script.js`;
  } else {
    return;
  }
  document.head.appendChild(script);
}

export async function initAnalytics() {
  if (analyticsInitialized) {
    return;
  }
  analyticsInitialized = true;

  const payload = await fetchRuntimeConfig();
  const analytics = payload?.analytics;
  if (!analytics?.enabled) {
    return;
  }

  setupUmami(analytics);
}
