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

    resultText.textContent = `Right: ${data.rightClicks} clicks | Up: ${data.upClicks} clicks`;
    resultJson.textContent = JSON.stringify(data, null, 2);
    resultBox.style.display = "block";
  } catch (err) {
    resultText.textContent = "Error contacting backend.";
    resultJson.textContent = err.toString();
    resultBox.style.display = "block";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Compute";
});