let display = document.getElementById("display");
let historyContainer = document.getElementById("history-container");
let resultBox = document.getElementById("resultB");
let historyData = JSON.parse(localStorage.getItem("history")) || [];

let currentValue = "";
let isResultShown = false;

// ================= DISPLAY =================

function updateDisplay() {
  display.value = currentValue;
}

function calculate(value) {

  // Result ke baad number → reset
  if (isResultShown && !["+", "-", "*", "/", "%"].includes(value)) {
    currentValue = "";
  }

  // Result ke baad operator → continue
  if (isResultShown && ["+", "-", "*", "/", "%"].includes(value)) {
    isResultShown = false;
    currentValue += value;
    updateDisplay();
    return;
  }

  isResultShown = false;
  currentValue += value;
  calculateLive();
  updateDisplay();
}

function calculateLive() {
  try {
    let expression = currentValue;
    if (/[+\-*/.]$/.test(expression)) {
      return
    }
    let result = evaluate(expression);
    resultBox.innerText = result;
    
    resultBox.classList.remove("result-animate");
    void resultBox.offsetWidth;
    resultBox.classList.add("result-animate");
    
  } catch {
    resultBox.innerText = "";
  }
}

function clearAll() {
  currentValue = "";
  resultBox.innerText = "";
  isResultShown = false;
  updateDisplay();
}

function backslash() {
  if (isResultShown) {
    currentValue = "";
    isResultShown = false;
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
  // LIVE CALCULATE TRIGGER
  if (currentValue !== "") {
    try {
      let result = evaluate(currentValue);
      calculateLive(result);
    } catch {
      calculateLive("");
    }
  } else {
    calculateLive("");
  }

}



// ================= CALCULATE =================

function showResult() {
  try {
    let expression = currentValue;
    let result = evaluate(expression);

    if (result === undefined || result === "Error") {
      currentValue = "Error";
    } else {
      // Save history
     addToHistory(expression, result);

      currentValue = result.toString();
      resultBox.innerText = "";
    }

    isResultShown = true;
    updateDisplay();

  } catch {
    currentValue = "Error";
    isResultShown = true;
    updateDisplay();
  }
}



// ================= HISTORY =================

// 👉 Clear history button
function clearHistory() {
  historyData = [];
  localStorage.removeItem("history");
  updateHistory();
}


function historyOpen() {
  let pageOpen = document.getElementById("historyContainer");
  pageOpen.classList.toggle("active");
  
  if (pageOpen.classList.contains("active")) {
    document.getElementById("historyContainer").style.display = "block";
    document.getElementById("buttons1").style.display = "none";
    
  } else {
    document.getElementById("historyContainer").style.display = "none";
    document.getElementById("buttons1").style.display = "grid";
    
  }
  
}

function addToHistory(expression, result) {
  let item = expression + " = " + result;
  
  historyData.push({
    exp: expression,
    res: result
  });
  
  // Limit history (last 20 items)
  if (historyData.length > 20) {
    historyData.shift();
  }
  
  localStorage.setItem("history", JSON.stringify(historyData));
  updateHistory();
}

function updateHistory() {
  let list = document.getElementById("historyList");
  list.innerHTML = "";
  
  historyData.forEach(item => {
    let li = document.createElement("li");
    li.innerHTML = `
     <div class="exp">${item.exp}</div>
     <div class="res"> = ${item.res}</div>
    `;
    
    // Click reuse (safe)
    li.onclick = () => {
      currentValue = item.exp.toString();
      result = item.res.toString();
      document.getElementById("display").value = currentValue;
      document.getElementById("resultB").innerText = result;
    };
    
    list.appendChild(li);
  });
}

function loadHistory() {
  let saved = localStorage.getItem("history");
  historyData = saved ? JSON.parse(saved) : [];
  updateHistory();
}

// Call this on page load
loadHistory();



// ================= CALCULATOR LOGIC =================

// Priority
function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/" || op === "%") return 2;
  return 0;
}

// Apply operations
function applyOp(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (isNaN(a) || isNaN(b)) return "0";

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;

  if (op === "/") {
    if (b === 0) return "Error";
    return a / b;
  }

  if (op === "%") {
    if (b === 0) return "Error";
    return ((a % b) + b) % b;
  }
}

// Scientific
function applyFunction(func, value) {
  value = parseFloat(value);
  if (isNaN(value)) return "Error";

  if (func === "sin") return Math.sin(value * Math.PI / 180);
  if (func === "cos") return Math.cos(value * Math.PI / 180);
  if (func === "tan") return Math.tan(value * Math.PI / 180);

  if (func === "log") {
    if (value <= 0) return "Error";
    return Math.log10(value);
  }

  if (func === "sqrt") {
    if (value < 0) return "Error";
    return Math.sqrt(value);
  }
}

// Main evaluator
function evaluate(expression) {
  let values = [];
  let ops = [];
  let i = 0;

  while (i < expression.length) {
    let ch = expression[i];

    if (ch === " ") {
      i++;
      continue;
    }

    // Negative numbers
    if (
      ch === "-" &&
      (i === 0 || ["(", "+", "-", "*", "/", "%"].includes(expression[i - 1]))
    ) {
      let num = "-";
      i++;
      while (!isNaN(expression[i]) || expression[i] === ".") {
        num += expression[i];
        i++;
      }
      values.push(num);
      continue;
    }

    // Number
    if (!isNaN(ch) || ch === ".") {
      let num = "";
      while (!isNaN(expression[i]) || expression[i] === ".") {
        num += expression[i];
        i++;
      }
      values.push(num);
      continue;
    }

    // Function
    if (/[a-z]/i.test(ch)) {
      let func = "";
      while (/[a-z]/i.test(expression[i])) {
        func += expression[i];
        i++;
      }
      ops.push(func);
      continue;
    }

    if (ch === "(") {
      ops.push(ch);
    }

    else if (ch === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        let op = ops.pop();

        if (["sin","cos","tan","log","sqrt"].includes(op)) {
          let val = values.pop();
          let res = applyFunction(op, val);
          if (res === "Error") return "Error";
          values.push(res);
        } else {
          if (values.length < 2) return "Error";
          let val2 = values.pop();
          let val1 = values.pop();
          let res = applyOp(val1, val2, op);
          if (res === "Error") return "Error";
          values.push(res);
        }
      }
      ops.pop();

      if (
        ops.length &&
        ["sin","cos","tan","log","sqrt"].includes(ops[ops.length - 1])
      ) {
        let func = ops.pop();
        let val = values.pop();
        let res = applyFunction(func, val);
        if (res === "Error") return "Error";
        values.push(res);
      }
    }

    else if (["+", "-", "*", "/", "%"].includes(ch)) {
      while (
        ops.length &&
        precedence(ops[ops.length - 1]) >= precedence(ch)
      ) {
        let op = ops.pop();

        if (["sin","cos","tan","log","sqrt"].includes(op)) {
          let val = values.pop();
          let res = applyFunction(op, val);
          if (res === "Error") return "Error";
          values.push(res);
        } else {
          if (values.length < 2) return "Error";
          let val2 = values.pop();
          let val1 = values.pop();
          let res = applyOp(val1, val2, op);
          if (res === "Error") return "Error";
          values.push(res);
        }
      }
      ops.push(ch);
    }

    i++;
  }

  while (ops.length) {
    let op = ops.pop();

    if (["sin","cos","tan","log","sqrt"].includes(op)) {
      let val = values.pop();
      let res = applyFunction(op, val);
      if (res === "Error") return "Error";
      values.push(res);
    } else {
      if (values.length < 2) return "Error";
      let val2 = values.pop();
      let val1 = values.pop();
      let res = applyOp(val1, val2, op);
      if (res === "Error") return "Error";
      values.push(res);
    }
  }

  return values[0];
}








/* Ripple */
function ripple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement("span");

  const size = Math.max(btn.clientWidth, btn.clientHeight);
  circle.style.width = circle.style.height = size + "px";

  const rect = btn.getBoundingClientRect();
  circle.style.left = e.clientX - rect.left - size/2 + "px";
  circle.style.top = e.clientY - rect.top - size/2 + "px";

  circle.classList.add("ripple");

  const old = btn.querySelector(".ripple");
  if (old) old.remove();

  btn.appendChild(circle);
}