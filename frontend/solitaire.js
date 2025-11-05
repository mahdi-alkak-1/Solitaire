
const USE_SAME_ORIGIN = true;
const ADD_URL  = USE_SAME_ORIGIN
  ? '../backend/add-score.php'
  : 'http://localhost/SEF_Projects/SolitareGame/frontend/add-score.html';
const LIST_URL = USE_SAME_ORIGIN
  ? '../backend/leaderboard.php'
  : 'http://localhost/SEF_Projects/SolitareGame/frontend/leaderboard.html';

// --- Helpers ---
function mmss(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// --- Add Score page logic (runs only if form exists) ---
(function wireAddScore() {
  const form = document.getElementById('addScoreForm');
  if (!form) return; // not on that page

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    if (!name) {
      alert('Please enter your name.');
      nameInput.focus();
      return;
    }

    try {
      const res = await axios.post(
        ADD_URL,
        { name },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data && res.data.ok) {
        const c = res.data.created;
        alert('Score added!\nName: ' + c.name + '\nScore: ' + c.score + '\nDuration: ' + c.duration + 's');
        window.location.href = './leaderboard.html';
      } else {
        alert('Server error: ' + (res.data?.error || 'Unknown'));
        console.log(res.data);
      }
    } catch (err) {
      console.error(err);
      alert('Request failed. See console for details.');
    }
  });
})();

// --- Leaderboard page logic (runs only if table exists) ---
(async function wireLeaderboard() {
  const table = document.getElementById('board');
  const tbody = document.getElementById('rows');
  const empty = document.getElementById('empty');
  if (!table || !tbody || !empty) return; // not on that page

  try {
    const res = await axios.get(LIST_URL);
    if (!res.data || !res.data.ok) throw new Error('Bad response');
    const items = res.data.items || [];

    if (items.length === 0) {
      table.style.display = 'none';
      empty.style.display = 'block';
      empty.textContent = 'No scores yet.';
      return;
    }

    tbody.innerHTML = '';
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${it.name}</td>
        <td>${it.score}</td>
        <td>${mmss(it.duration)}</td>
      `;
      tbody.appendChild(tr);
    });

    empty.style.display = 'none';
    table.style.display = 'table';
  } catch (err) {
    console.error(err);
    table.style.display = 'none';
    empty.style.display = 'block';
    empty.textContent = 'Failed to load leaderboard.';
  }
})();
