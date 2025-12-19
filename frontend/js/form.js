document
  .getElementById("mobile-menu-button")
  .addEventListener("click", function () {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("hidden");

    // Change icon based on menu state
    const icon = this.querySelector("i");
    if (mobileMenu.classList.contains("hidden")) {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    } else {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    }
  });
// Dropdown functionality
function toggleDropdown() {
  const dropdown = document.getElementById("dropdownContent");
  const arrow = document.getElementById("dropdownArrow");
  dropdown.classList.toggle("hidden");
  arrow.classList.toggle("rotate-180");

  if (!dropdown.classList.contains("hidden")) {
    document.addEventListener("click", function closeDropdown(e) {
      if (
        !e.target.closest("#dropdownContent") &&
        !e.target.closest("#dropdownButton")
      ) {
        dropdown.classList.add("hidden");
        arrow.classList.remove("rotate-180");
        document.removeEventListener("click", closeDropdown);
      }
    });
  }
}

// Update selection count and display
function updateSelection() {
  const checkboxes = document.querySelectorAll('input[name="sports"]:checked');
  const count = checkboxes.length;
  const selectedItems = document.getElementById("selectedItems");
  const selectionCount = document.getElementById("selectionCount");
  const selectedDisplay = document.getElementById("selectedDisplay");
  const selectedItemsList = document.getElementById("selectedItemsList");

  // Update counts
  selectedItems.textContent = `Select Sports (${count} selected)`;
  selectionCount.textContent = `${count}/3 selected`;

  // Update selected items display
  if (count > 0) {
    selectedDisplay.classList.remove("hidden");
    selectedItemsList.innerHTML = "";
    checkboxes.forEach((checkbox) => {
      const item = document.createElement("div");
      item.className =
        "bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg flex items-center gap-2";
      item.innerHTML = `
                        <span>${checkbox.value}</span>
                        <button type="button" onclick="deselectItem('${checkbox.value}')" class="text-red-500 hover:text-red-700">
                            ×
                        </button>
                    `;
      selectedItemsList.appendChild(item);
    });
  } else {
    selectedDisplay.classList.add("hidden");
  }
}

// Deselect individual item
function deselectItem(value) {
  const checkbox = document.querySelector(
    `input[name="sports"][value="${value}"]`
  );
  if (checkbox) {
    checkbox.checked = false;
    updateSelection();
  }
}

// Clear all selections
function clearSelections() {
  document.querySelectorAll('input[name="sports"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateSelection();
}

// Limit to max 3 selections
document.querySelectorAll('input[name="sports"]').forEach((checkbox) => {
  checkbox.addEventListener("change", function (e) {
    const checkedBoxes = document.querySelectorAll(
      'input[name="sports"]:checked'
    );
    if (checkedBoxes.length > 3) {
      this.checked = false;
      alert("⚠️ Maximum 3 sports can be selected");
    }
    updateSelection();
  });
});

// Initialize selection display
updateSelection();

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
      clearSelections();
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
