// TODO: After backend is deployed, update this URL:
const BACKEND_URL = "https://YOUR-BACKEND-URL.onrender.com";

const form = document.getElementById("sczn3-form");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultJson = document.getElementById("resultJson");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const distanceYards = Number(document.getElementById("distanceYards").value);
  const clickValueMOA = Number(document.getElementById("clickValueMOA").value);
  const offsetRightInches = Number(
    document.getElementById("offsetRightInches").value
  );
  const offsetUpInches = Number(
    document.getElementById("offsetUpInches").value
  );

  submitBtn.disabled = true;
  submitBtn.textContent = "Computing…";

  try {
    const res = await fetch(`${BACKEND_URL}/api/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        distanceYards,
        clickValueMOA,
        offsetRightInches,
        offsetUpInches,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      throw new Error(data.error || "Unknown error");
    }

    const { moaWindage, moaElevation, correction } = data.data || {};

    const wDir = correction?.windage?.direction ?? "None";
    const wClicks =
      correction?.windage?.clicks && correction.windage.clicks.toFixed
        ? correction.windage.clicks.toFixed(2)
        : "0.00";

    const eDir = correction?.elevation?.direction ?? "None";
    const eClicks =
      correction?.elevation?.clicks && correction.elevation.clicks.toFixed
        ? correction.elevation.clicks.toFixed(2)
        : "0.00";

    resultText.innerHTML = `
      <p><strong>SCZN3 Correction:</strong></p>
      <p>Windage: <strong>${wClicks} clicks ${wDir}</strong></p>
      <p>Elevation: <strong>${eClicks} clicks ${eDir}</strong></p>
      ${
        typeof moaWindage === "number" && typeof moaElevation === "number"
          ? `<p><small>POI MOA — Windage: ${moaWindage.toFixed(
              2
            )}, Elevation: ${moaElevation.toFixed(2)}</small></p>`
          : ""
      }
    `;

    resultJson.textContent = JSON.stringify(data, null, 2);
    resultBox.style.display = "block";
  } catch (err) {
    resultBox.style.display = "block";
    resultText.innerHTML = `<p style="color:#ff5252;">Error: ${
      err.message || "Failed to reach backend"
    }</p>`;
    resultJson.textContent = "";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Compute SCZN3 Correction";
  }
});