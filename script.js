// Get display input
const display = document.getElementById("display");

// Add character to the display
function appendToDisplay(value) {
  display.value += value;
  playClickSound();
}

// Clear the display
function clearDisplay() {
  display.value = "";
}

// Calculate and display result
function calculate() {
  let expression = display.value;
  expression = balanceParentheses(expression); // auto-balance ( )

  try {
    // Replace custom functions with JS equivalents
    expression = expression
      .replace(/√/g, "Math.sqrt")
      .replace(/log/g, "Math.log10")
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/\^/g, "**")
      .replace(/%/g, "/100");

    const result = eval(expression);
    saveToHistory(display.value, result);
    display.value = result;
  } catch (e) {
    alert("Invalid expression");
  }
}

// Auto-balance parentheses before calculation
function balanceParentheses(expr) {
  const open = (expr.match(/\(/g) || []).length;
  const close = (expr.match(/\)/g) || []).length;
  return expr + ")".repeat(open - close);
}

// Save calculation to localStorage
function saveToHistory(expression, result) {
  const history = JSON.parse(localStorage.getItem("calc-history")) || [];
  history.unshift({ expression, result });
  localStorage.setItem("calc-history", JSON.stringify(history));
  renderHistory();
}

// Display stored history
function renderHistory() {
  const historyList = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("calc-history")) || [];

  historyList.innerHTML = "";
  history.slice(0, 10).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.expression} = ${entry.result}`;
    historyList.appendChild(li);
  });
}

// Keyboard support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (!isNaN(key) || ["+", "-", "*", "/", ".", "(", ")"].includes(key)) {
    appendToDisplay(key);
  } else if (key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key.toLowerCase() === "c") {
    clearDisplay();
  } else if (key === "^") {
    appendToDisplay("^");
  } else if (key === "%") {
    appendToDisplay("%");
  } else if (key.toLowerCase() === "l") {
    appendToDisplay("log(");
  } else if (key.toLowerCase() === "r") {
    appendToDisplay("√(");
  } else if (key.toLowerCase() === "s") {
    appendToDisplay("sin(");
  } else if (key.toLowerCase() === "t") {
    appendToDisplay("tan(");
  } else if (key.toLowerCase() === "o") {
    toggleCalculator(); // shrink/hide on "o"
  }
});

// Click sound effect
const clickSound = new Audio("click.mp3");
clickSound.playbackRate = 2; // Speed up sound

function playClickSound() {
  clickSound.currentTime = 0.2;
  clickSound.play();
}

// Toggle calculator visibility (off/on)
function toggleCalculator() {
  const calculator = document.querySelector(".calculator");
  calculator.classList.toggle("off");
}

// Render history when page loads
window.onload = renderHistory;

// Simulate power-off: hide calculator, show ON button
function powerOff() {
  const calculator = document.getElementById("calculator");
  const powerBtn = document.getElementById("power-on");

  // Start fade out
  calculator.classList.add("hidden");

  // Wait for fade to finish before hiding it completely
  setTimeout(() => {
    calculator.style.display = "none";
    powerBtn.style.display = "block";
  }, 500); // Match the transition duration
  clickSound.play();
}

function powerOn() {
  const calculator = document.getElementById("calculator");
  const powerBtn = document.getElementById("power-on");

  powerBtn.style.display = "none";
  calculator.style.display = "block";

  // Start fade in
  setTimeout(() => {
    calculator.classList.remove("hidden");
  }, 10); // Short delay to trigger transition
  clickSound.play();
}
// Open modal with animation
function openHistoryModal() {
  renderHistory(); // Refresh history list
  const modal = document.getElementById('historyModal');
  modal.style.display = 'flex'; // Enable flex centering
}

// Close modal
function closeHistoryModal() {
  document.getElementById('historyModal').style.display = 'none';
}

// Render history to modal
function renderHistory() {
  const history = JSON.parse(localStorage.getItem('calc-history')) || [];
  const historyListModal = document.getElementById('historyListModal');
  historyListModal.innerHTML = '';

  history.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.expression} = ${entry.result}`;

    // When clicked, reuse in display
    li.onclick = () => {
      document.getElementById('display').value = entry.expression;
      closeHistoryModal();
    };

    historyListModal.appendChild(li);
  });
}

// Clear history
function clearHistory() {
  localStorage.removeItem('calc-history');
  renderHistory(); // Refresh list
}
