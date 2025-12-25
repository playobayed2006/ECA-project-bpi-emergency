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

document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const roll = document.getElementById("roll").value;
  const semester = document.getElementById("semester").value;
  const department = document.getElementById("department").value;
  const shift = document.getElementById("shift").value;
  const phone = document.getElementById("phone").value;
  const faculty = document.getElementById("onusod").value;
  const checkboxes = document.querySelectorAll('input[name="sports"]:checked');
  let sportsArr = [];
  checkboxes.forEach((checkbox) => {
    sportsArr.push(checkbox.value);
  });

  let sports = sportsArr.join(", ");
  console.log(sports);

  if (roll.length !== 6) {
    showPopup("Roll number must be exactly 6 characters");
    return;
  }

  if (phone.length !== 11) {
    showPopup("Phone number must be exactly 11 characters");
    return;
  }

  try {
    showPopup("Please Wait...", true);
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        roll,
        phone,
        gender,
        semester,
        department,
        shift,
        faculty,
        sports,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      showPopup(result.message || "Submitted!");
      document.getElementById("studentForm").reset();
    } else if (response.status === 409) {
      showPopup(result.message || "This roll number is already registered");
    } else {
      showPopup(result.message || "Submission failed. Please try again");
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Please try again.");
  }
});
