const ADD_URL = '../backend/add-score.php';


const form = document.getElementById('addScoreForm');
if (form) {
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
        const created = res.data.created;
        const name = created.name;
        const score = created.score;
        const duration = created.duration;
        alert(`Score added!\nName: ${name}\nScore: ${score}\nDuration: ${duration}s\n`);
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
}
