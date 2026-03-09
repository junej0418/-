const ids = [
  'electionTitle',
  'district',
  'electionDate',
  'electionTime',
  'commission',
  'position',
  'note',
  'footerNote',
  'paperWidth',
  'paperHeight',
  'baseFontSize',
  'rowHeight',
];

const stateInputs = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

const refs = {
  pTitle: document.getElementById('pTitle'),
  pDistrict: document.getElementById('pDistrict'),
  pDate: document.getElementById('pDate'),
  pTime: document.getElementById('pTime'),
  pCommission: document.getElementById('pCommission'),
  pNote: document.getElementById('pNote'),
  pFooterNote: document.getElementById('pFooterNote'),
  rows: document.getElementById('rows'),
  ballot: document.getElementById('ballot'),
  candidateEditor: document.getElementById('candidateEditor'),
  candidateTemplate: document.getElementById('candidateTemplate'),
};

const candidates = [
  { number: 1, name: '홍길동', info: '5-3-12' },
  { number: 2, name: '김민지', info: '5-3-07' },
  { number: 3, name: '이준호', info: '5-3-19' },
];

function addCandidateCard(candidate) {
  const node = refs.candidateTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector('.cand-number').value = candidate.number;
  node.querySelector('.cand-name').value = candidate.name;
  node.querySelector('.cand-info').value = candidate.info;

  node.querySelector('.cand-number').addEventListener('input', render);
  node.querySelector('.cand-name').addEventListener('input', render);
  node.querySelector('.cand-info').addEventListener('input', render);

  refs.candidateEditor.appendChild(node);
}

function syncCandidatesFromUI() {
  const cards = [...refs.candidateEditor.querySelectorAll('.candidate-card')];
  candidates.length = 0;

  cards.forEach((card, index) => {
    const number = Number(card.querySelector('.cand-number').value || index + 1);
    const name = card.querySelector('.cand-name').value || `후보 ${index + 1}`;
    const info = card.querySelector('.cand-info').value || '-';
    candidates.push({ number, name, info });
  });
}

function renderRows() {
  refs.rows.innerHTML = '';

  candidates.forEach((cand) => {
    const row = document.createElement('div');
    row.className = 'ballot-row';

    row.innerHTML = `
      <span>${cand.number}</span>
      <span>${cand.name}</span>
      <span>${cand.info}</span>
      <span><i class="stamp-box" aria-label="기표란"></i></span>
    `;

    refs.rows.appendChild(row);
  });
}

function render() {
  syncCandidatesFromUI();

  refs.pTitle.textContent = `${stateInputs.electionTitle.value} (${stateInputs.position.value})`;
  refs.pDistrict.textContent = stateInputs.district.value;
  refs.pDate.textContent = `선거일: ${stateInputs.electionDate.value}`;
  refs.pTime.textContent = `투표시간: ${stateInputs.electionTime.value}`;
  refs.pCommission.textContent = stateInputs.commission.value;
  refs.pNote.textContent = stateInputs.note.value;
  refs.pFooterNote.textContent = stateInputs.footerNote.value;

  refs.ballot.style.width = `${stateInputs.paperWidth.value}mm`;
  refs.ballot.style.minHeight = `${stateInputs.paperHeight.value}mm`;
  refs.ballot.style.fontSize = `${stateInputs.baseFontSize.value}px`;
  document.documentElement.style.setProperty('--row-height', `${stateInputs.rowHeight.value}px`);

  renderRows();

  document.querySelectorAll('.ballot-row').forEach((row) => {
    row.style.minHeight = `${stateInputs.rowHeight.value}px`;
  });
}

Object.values(stateInputs).forEach((input) => input.addEventListener('input', render));

document.getElementById('addCandidate').addEventListener('click', () => {
  addCandidateCard({ number: candidates.length + 1, name: '', info: '' });
  render();
});

document.getElementById('removeCandidate').addEventListener('click', () => {
  const cards = refs.candidateEditor.querySelectorAll('.candidate-card');
  if (cards.length <= 1) {
    return;
  }
  cards[cards.length - 1].remove();
  render();
});

document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

candidates.forEach(addCandidateCard);
render();
