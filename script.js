// SCZN3 SEC Engine (Shooter Experience Card)

// Utility: format number to two decimals as a string
function toTwoDecimals(value) {
  const num = Number(value);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}

// Core SEC render function
function renderSEC(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const wind = toTwoDecimals(data.windage_clicks);
  const elev = toTwoDecimals(data.elevation_clicks);
  const index = data.sec_index || "SEC-001";

  container.innerHTML = `
    <div style="max-width: 420px; margin: 0 auto; padding: 24px; border: 1px solid #eee; background:#ffffff;">
      <h2 style="text-align:center; margin-top:0; margin-bottom:18px; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        SCZN3 Shooter Experience Card (SEC)
      </h2>
      <div style="text-align:center; margin: 30px 0; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size:20px; line-height:1.6;">
        <div>Windage: <strong>${wind} clicks</strong></div>
        <div>Elevation: <strong>${elev} clicks</strong></div>
      </div>
      <div style="text-align:center; font-style:italic; color:#555; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        ${index}
      </div>
    </div>
  `;
}

// --- INDEX PAGE LOGIC (single-page flow) ---

// Fake "processing" → SEC demo for now
function handleUploadSubmit(event) {
  event.preventDefault();

  const fileInput = document.getElementById("targetUpload");
  const file = fileInput && fileInput.files[0];

  const statusEl = document.getElementById("uploadStatus");
  const secContainer = document.getElementById("secContainer");

  if (!file) {
    if (statusEl) statusEl.textContent = "Please select a target image first.";
    return;
  }

  // Show simple status while we "process"
  if (statusEl) statusEl.textContent = "Processing your target and generating SEC…";

  // For now this is a demo: we simulate computed values.
  // Later this will call the backend (UGEO + POIB + clicks).
  setTimeout(() => {
    if (statusEl) statusEl.textContent = "Done. SEC generated below.";

    const demoData = {
      windage_clicks: "2.75",
      elevation_clicks: "1.50",
      sec_index: "SEC-001"
    };

    if (secContainer) {
      renderSEC("secContainer", demoData);
      secContainer.scrollIntoView({ behavior: "smooth" });
    }
  }, 1000);
}

// --- SEC PAGE LOGIC (sec.html) ---

// Parse query params like ?w=2.75&e=1.50&idx=007
function getQueryParams() {
  const params = {};
  const search = window.location.search.substring(1);
  if (!search) return params;

  search.split("&").forEach(pair => {
    const [key, value] = pair.split("=");
    if (!key) return;
    params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  });

  return params;
}

function initSecFromQuery() {
  const params = getQueryParams();
  const wind = params.w || "0.00";
  const elev = params.e || "0.00";
  const idxRaw = params.idx || "001";

  const data = {
    windage_clicks: wind,
    elevation_clicks: elev,
    sec_index: `SEC-${idxRaw.padStart(3, "0")}`
  };

  renderSEC("secStandaloneContainer", data);
}

// Auto-wire events depending on which page we're on
document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", handleUploadSubmit);
  }

  const secStandalone = document.getElementById("secStandaloneContainer");
  if (secStandalone) {
    initSecFromQuery();
  }
});
