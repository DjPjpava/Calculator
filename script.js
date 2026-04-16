// Elements
const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const sound = document.getElementById("clickSound");

let currentInput = "";
let history = [];

// 🔊 Sound
function playSound() {
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// ✨ Display update
function updateDisplay(value) {
  display.style.transform = "scale(1.1)";
  setTimeout(() => display.style.transform = "scale(1)", 100);
  display.innerText = value;
}

// ➕ Append
function append(value) {
  playSound();

  const operators = ['+', '-', '*', '/'];
  const lastChar = currentInput.slice(-1);

  if (operators.includes(lastChar) && operators.includes(value)) return;

  currentInput += value;
  updateDisplay(currentInput);
}

// 🧹 Clear
function clearDisplay() {
  playSound();
  currentInput = "";
  updateDisplay("🧹 Cleared");
  setTimeout(() => updateDisplay("0"), 800);
}

// 🔁 Toggle sign
function toggleSign() {
  playSound();
  if (!currentInput) return;

  currentInput = (parseFloat(currentInput) * -1).toString();
  updateDisplay(currentInput);
}

// 🧮 SAFE CALCULATION (no eval)
function calculate() {
  playSound();

  try {
    if (!currentInput) return;

    let result = safeEvaluate(currentInput);

    history.unshift(`${currentInput} = ${result}`);
    updateHistory();

    currentInput = result.toString();
    updateDisplay("✨ " + result);

  } catch {
    updateDisplay("⚠️ Invalid");
    currentInput = "";
  }
}

// 🔐 Safe evaluator
function safeEvaluate(expr) {
  // Replace % with /100
  expr = expr.replace(/%/g, "/100");

  // Tokenize
  let tokens = expr.match(/(\d+\.?\d*|\+|\-|\*|\/)/g);

  if (!tokens) throw "Invalid";

  // First pass (* and /)
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      let a = parseFloat(tokens[i - 1]);
      let b = parseFloat(tokens[i + 1]);

      let result = tokens[i] === '*' ? a * b : a / b;

      tokens.splice(i - 1, 3, result.toString());
      i--;
    }
  }

  // Second pass (+ and -)
  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    let op = tokens[i];
    let num = parseFloat(tokens[i + 1]);

    if (op === '+') result += num;
    else result -= num;
  }

  return result;
}

// 📜 History
function updateHistory() {
  historyList.innerHTML = "";

  history.slice(0, 5).forEach(item => {
    let li = document.createElement("li");
    li.innerText = "🧾 " + item;

    li.onclick = () => {
      currentInput = item.split("=")[1].trim();
      updateDisplay(currentInput);
    };

    historyList.appendChild(li);
  });
}

// ⌨️ Keyboard Support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    append(key);
  } else if (key === "Enter") {
    calculate();
  } else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || "0");
  } else if (key === "Escape") {
    clearDisplay();
  }
});
