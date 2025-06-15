// =================================================================
// PART 2: The Frontend Brains - Using fetch() to call our API
// =================================================================

// !!! VERY IMPORTANT: PASTE YOUR GOOGLE APPS SCRIPT URL HERE !!!
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbx1Bl-674sLVf3kJLdSzD3-0-kJIXojXfs4I_vVCzkyprijRsk-_FmqeJ75mi2snjss/exec';

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("user-info-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }
});

function handleFormSubmit(event) {
  event.preventDefault();
  document.getElementById("loader").style.display = "flex";

  const form = event.target;
  const userInfo = {
    name: form.name.value,
    email: form.email.value,
    age: form.age.value,
    gender: form.gender.value,
    height: form.height.value,
    weight: form.weight.value,
    primaryGoal: form.primaryGoal.value,
    medicalConditions: getCheckedValues("medicalConditions"),
    bloodTestHighlights: getCheckedValues("bloodTestHighlights")
  };
  
  // --- This is the new way to call your backend ---
  fetch(GAS_API_URL, {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Required for GAS to parse correctly
    },
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'error') {
      showError({ message: data.message });
    } else {
      displayProgram(data);
    }
  })
  .catch(showError);
}

function displayProgram(program) {
  document.getElementById("loader").style.display = "none";
  document.getElementById("onboarding-section").style.display = "none";
  
  const programSection = document.getElementById("program-section");
  programSection.innerHTML = `
    <div class="form-header"><h1>Your Personalized Plan</h1></div>
    <div class="form-group">
      <h2>Monthly Goal</h2>
      <p>${program.monthlyGoal}</p>
    </div>
    <div class="form-group pillar">
      <h3>Movement (Your Daily Blend)</h3>
      ${program.dailyPlan.movement.map(e => `
        <div class="exercise-item">
          <strong>${e.name}</strong> (${e.type})<br>
          Sets: ${e.sets}, Reps: ${e.reps}<br>
          <a href="${e.link}" target="_blank">Watch Demo Video</a>
        </div>
      `).join('')}
    </div>
    <div class="form-group pillar">
      <h3>Nutrition (Your Fuel Plan)</h3>
      <ul>
        ${program.dailyPlan.nutrition.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>
    <div class="form-group pillar">
      <h3>Recovery (Your Recharge Guide)</h3>
      <p>${program.dailyPlan.recovery}</p>
    </div>
    <div class="form-group submit-group">
      <button onclick="startOver()">Generate New Program</button>
    </div>
  `;
  programSection.style.display = "block";
}

function showError(error) {
  document.getElementById("loader").style.display = "none";
  alert("An error occurred: " + error.message);
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
              .map(cb => cb.value)
              .join(', ');
}

function startOver() {
  window.location.reload();
}
