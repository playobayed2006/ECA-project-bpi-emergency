// --- SMART URL LOGIC ---
const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000" 
  : "https://eca-project-bpi-emergency.onrender.com/"; // <--- REPLACE THIS WITH YOUR RENDER URL
// -----------------------

function showPopup(message, loading = false) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupSpinner = document.getElementById("popup-spinner");
  const popupClose = document.getElementById("popup-close");

  popup.classList.remove("hidden");
  popupMessage.textContent = message;

  if (loading) {
    popupSpinner.classList.remove("hidden");
    popupClose.classList.add("hidden");
  } else {
    popupSpinner.classList.add("hidden");
    popupClose.classList.remove("hidden");
  }
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("popup-close").addEventListener("click", closePopup);

document.getElementById("downloadBtn").addEventListener("click", async () => {
  showPopup("Please Wait...", true);
  const faculty = document.getElementById("adminOnusod").value;

  try {
    // UPDATED: Uses BASE_URL and handles potential wake-up delays
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(faculty)}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${faculty}_students.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showPopup("CSV Downloaded");
    } else if (response.status === 403) {
      showPopup("Not authorized. Please log in as admin.");
      document.getElementById("popup-close").addEventListener("click", () => {
        closePopup();
        window.location.href = "/admin-login.html";
      });
    } else if (response.status === 404) {
      const result = await response.json();
      showPopup(result.message || "No data found for this one");
    } else {
      showPopup("Error downloading csv");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showPopup("Server is waking up or connection failed. Please try again in a few seconds.");
  }
});
