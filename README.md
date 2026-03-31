# Calculator
function deleteLast() {
  if (isResultShown) {
    currentValue = "";
    isResultShown = false;
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();

  // 👉 LIVE CALCULATE TRIGGER
  if (currentValue !== "") {
    try {
      let result = evaluate(currentValue);
      showLiveResult(result);
    } catch {
      showLiveResult("");
    }
  } else {
    showLiveResult("");
  }
}



function addToHistory(entry) {
  historyList.unshift(entry); // latest on top
  renderHistory();
}

function renderHistory() {
  historyContainer.innerHTML = "";

  historyList.forEach(item => {
    let div = document.createElement("div");
    div.className = "history-item";
    div.innerText = item;

    // click → reuse value
    div.onclick = function () {
      currentValue = item.split("=")[1].trim();
      updateDisplay();
    };

    historyContainer.appendChild(div);
  });
}

function toggleHistory() {
  historyContainer.classList.toggle("active");
}