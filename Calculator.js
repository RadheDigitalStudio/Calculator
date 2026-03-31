let display = document.getElementById("display");

function calculate(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function showResult() {
  try {
    display.value = evaluate(display.value);
  } catch {
    display.value = "Error";
  }
}

// Priority
/*function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

// Apply basic operations
function applyOp(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return a / b;
}

// Scientific functions
function applyFunction(func, value) {
  value = parseFloat(value);

  if (func === "sin") return Math.sin(value * Math.PI / 180);
  if (func === "cos") return Math.cos(value * Math.PI / 180);
  if (func === "tan") return Math.tan(value * Math.PI / 180);
  if (func === "log") return Math.log10(value);
  if (func === "sqrt") return Math.sqrt(value);
}

// Main evaluator
function evaluate(expression) {
  let values = [];
  let ops = [];

  let i = 0;

  while (i < expression.length) {
    let ch = expression[i];

    // Skip spaces
    if (ch === " ") {
      i++;
      continue;
    }

    // Handle negative numbers
    if (
      ch === "-" &&
      (i === 0 || expression[i - 1] === "(")
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

    // Function (sin, cos, etc.)
    if (/[a-z]/i.test(ch)) {
      let func = "";
      while (/[a-z]/i.test(expression[i])) {
        func += expression[i];
        i++;
      }
      ops.push(func);
      continue;
    }

    // Opening bracket
    if (ch === "(") {
      ops.push(ch);
    }

    // Closing bracket
    else if (ch === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        let op = ops.pop();

        if (["sin", "cos", "tan", "log", "sqrt"].includes(op)) {
          let val = values.pop();
          values.push(applyFunction(op, val));
        } else {
          let val2 = values.pop();
          let val1 = values.pop();
          values.push(applyOp(val1, val2, op));
        }
      }
      ops.pop(); // remove '('

      // Apply function after bracket
      if (ops.length && typeof ops[ops.length - 1] === "string") {
        let func = ops.pop();
        let val = values.pop();
        values.push(applyFunction(func, val));
      }
    }

    // Operator
    else if (["+", "-", "*", "/"].includes(ch)) {
      while (
        ops.length &&
        precedence(ops[ops.length - 1]) >= precedence(ch)
      ) {
        let op = ops.pop();
        let val2 = values.pop();
        let val1 = values.pop();
        values.push(applyOp(val1, val2, op));
      }
      ops.push(ch);
    }

    i++;
  }

  // Final calculation
  while (ops.length) {
    let op = ops.pop();

    if (["sin", "cos", "tan", "log", "sqrt"].includes(op)) {
      let val = values.pop();
      values.push(applyFunction(op, val));
    } else {
      let val2 = values.pop();
      let val1 = values.pop();
      values.push(applyOp(val1, val2, op));
    }
  }

  return values[0];
}*/



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