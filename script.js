let notes = JSON.parse(localStorage.getItem('notesList')) || [];
let subjects = JSON.parse(localStorage.getItem('customSubjects')) || ["Math", "English", "History", "Science", "Other"];
let selectedSubject = "";

function saveNotes() {
  localStorage.setItem('notesList', JSON.stringify(notes));
}

function saveSubjects() {
  localStorage.setItem('customSubjects', JSON.stringify(subjects));
}

function renderSubjects() {
  const menu = document.getElementById('dropdownMenu');
  menu.innerHTML = '';

  subjects.forEach(subject => {
    const item = document.createElement('div');
    item.innerHTML = `
      <span onclick="selectSubject('${subject}')">${subject}</span>
      <button class="delete-btn" onclick="deleteSubject('${subject}')">❌</button>
    `;
    menu.appendChild(item);
  });
}

function selectSubject(subject) {
  selectedSubject = subject;
  document.querySelector('.dropdown-toggle').textContent = `📚 ${subject} ▾`;
  toggleDropdown(); // Close menu
}

function toggleDropdown() {
  const menu = document.getElementById('dropdownMenu');
  menu.classList.toggle('hidden');
}

function createSubject() {
  const input = document.getElementById('newSubjectInput');
  const newSubject = input.value.trim();
  if (newSubject && !subjects.includes(newSubject)) {
    subjects.push(newSubject);
    saveSubjects();
    renderSubjects();
    selectSubject(newSubject);
    input.value = '';
  }
}

function deleteSubject(subject) {
  if (confirm(`Delete subject "${subject}"?`)) {
    subjects = subjects.filter(sub => sub !== subject);
    saveSubjects();
    renderSubjects();
    if (selectedSubject === subject) {
      selectedSubject = "";
      document.querySelector('.dropdown-toggle').textContent = "📚 Select Subject ▾";
    }
  }
}

function renderNotes() {
  const notesDiv = document.getElementById('notesList');
  notesDiv.innerHTML = '';

  const groups = {};
  notes.forEach(note => {
    const subject = note.subject || "Other";
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(note);
  });

  for (const subject in groups) {
    const groupDiv = document.createElement('div');
    const title = document.createElement('h2');
    title.textContent = `${subject} 📚`;
    title.className = 'subject-title';
    groupDiv.appendChild(title);

    groups[subject].forEach(note => {
      const noteItem = document.createElement('div');
      noteItem.className = 'note';
      noteItem.innerHTML = `
        <div class="note-header">
          <span>${note.date}</span>
        </div>
        <p>${note.text}</p>
      `;
      groupDiv.appendChild(noteItem);
    });

    notesDiv.appendChild(groupDiv);
  }
}

function addNote() {
  const text = document.getElementById('noteInput').value.trim();
  if (!selectedSubject) {
    alert("Please select a subject first!");
    return;
  }
  if (text) {
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    notes.push({ subject: selectedSubject, text, date: dateString });
    saveNotes();
    renderNotes();
    document.getElementById('noteInput').value = '';
    showToast();
  }
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('toggleThemeBtn').textContent = isDark ? '☀️' : '🌙';
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('toggleThemeBtn').textContent = '☀️';
  }
  renderSubjects();
  renderNotes();
});
