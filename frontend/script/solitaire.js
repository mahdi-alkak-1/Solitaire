const ADD_URL  = '../backend/add-score.php';
const LIST_URL = '../backend/leaderboard.php';


function mmss(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
 
(function AddScore() {
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

(async function getScores() {
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
