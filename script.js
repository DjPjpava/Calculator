let display = document.getElementById("display");
let historyList = document.getElementById("historyList");

function append(value) {
  if (display.innerText === "0") {
    display.innerText = value;
  } else {
    display.innerText += value;
  }
}

function clearDisplay() {
  display.innerText = "0";
}

function toggleSign() {
  display.innerText = String(-parseFloat(display.innerText));
}

function calculate() {
  try {
    let expression = display.innerText;
    let result = eval(expression);

    let item = document.createElement("li");
    item.textContent = expression + " = " + result;
    historyList.prepend(item);

    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
}
