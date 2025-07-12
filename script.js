let words = JSON.parse(localStorage.getItem("vocabEntries")) || [];

function renderWords() {
  const container = document.getElementById("wordsDisplay");
  container.innerHTML = "";

  const filter = document.getElementById("filterDate").value;
  const uniqueDates = [...new Set(words.map(e => e.date))];

  const filterDropdown = document.getElementById("filterDate");
  filterDropdown.innerHTML = '<option value="">-- Filter by Date --</option>';
  uniqueDates.forEach(d => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    filterDropdown.appendChild(option);
  });

  const filteredWords = filter ? words.filter(w => w.date === filter) : words;

  filteredWords.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <strong>📅 ${entry.date}</strong><br>
      Word: <strong>${entry.word}</strong><br>
      Meaning: ${entry.meaning}
      <div class="entry-buttons">
        <button class="edit-btn" onclick="editWord(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteWord(${index})">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function addWord() {
  const date = document.getElementById("date").value.trim();
  const word = document.getElementById("word").value.trim();
  const meaning = document.getElementById("meaning").value.trim();

  if (!date || !word || !meaning) {
    alert("Please fill all fields!");
    return;
  }

  words.push({ date: date.toUpperCase(), word, meaning });
  localStorage.setItem("vocabEntries", JSON.stringify(words));
  document.getElementById("word").value = '';
  document.getElementById("meaning").value = '';
  renderWords();
}

function editWord(index) {
  const entry = words[index];
  const newWord = prompt("Edit word:", entry.word);
  const newMeaning = prompt("Edit meaning:", entry.meaning);
  if (newWord && newMeaning) {
    words[index].word = newWord;
    words[index].meaning = newMeaning;
    localStorage.setItem("vocabEntries", JSON.stringify(words));
    renderWords();
  }
}

function deleteWord(index) {
  if (confirm("Are you sure you want to delete this word?")) {
    words.splice(index, 1);
    localStorage.setItem("vocabEntries", JSON.stringify(words));
    renderWords();
  }
}

function downloadFile() {
  if (words.length === 0) {
    alert("No entries to save!");
    return;
  }

  let content = "";
  let currentDate = "";

  words.forEach(entry => {
    if (entry.date !== currentDate) {
      currentDate = entry.date;
      content += `\n==========================================\n📅 Day: ${currentDate}\n`;
    }
    content += ` Word: ${entry.word}\n Meaning: ${entry.meaning}\n------------------------------------------\n`;
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'vocabulary.txt';
  link.click();
}

function toggleDarkMode() {
  const body = document.body;
  const toggle = document.getElementById("darkModeToggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    toggle.checked = true;
  } else {
    localStorage.setItem("darkMode", "disabled");
    toggle.checked = false;
  }
}

window.onload = function () {
  const isDark = localStorage.getItem("darkMode") === "enabled";
  if (isDark) {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").checked = true;
  }

  const lastUsed = localStorage.getItem("lastUsedDate");
  const today = new Date().toLocaleDateString();
  if (lastUsed !== today) {
    setTimeout(() => {
      alert("Reminder: Don't forget to add a new word today.");
    }, 1000);
    localStorage.setItem("lastUsedDate", today);
  }

  renderWords();
};
