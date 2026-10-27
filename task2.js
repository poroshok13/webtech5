const tasks = [
  { id: 1, title: 'Setup repository', priority: 1, isUrgent: true, tag: 'code', status: 'todo' },
  { id: 2, title: 'Create wireframes', priority: 2, isUrgent: false, tag: 'design', status: 'todo' },
  { id: 3, title: 'Write unit tests', priority: 3, isUrgent: false, tag: 'test', status: 'todo' },
  { id: 4, title: 'Build login API', priority: 1, isUrgent: true, tag: 'code', status: 'in-progress' },
  { id: 5, title: 'Design banners', priority: 2, isUrgent: false, tag: 'design', status: 'in-progress' },
  { id: 6, title: 'Setup database', priority: 1, isUrgent: false, tag: 'code', status: 'in-progress' },
  { id: 7, title: 'Verify buttons', priority: 3, isUrgent: false, tag: 'test', status: 'todo' },
  { id: 8, title: 'Code navigation', priority: 2, isUrgent: true, tag: 'code', status: 'done' },
  { id: 9, title: 'Color palette', priority: 3, isUrgent: false, tag: 'design', status: 'done' },
  { id: 10, title: 'Security review', priority: 1, isUrgent: false, tag: 'test', status: 'todo' }
];

const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');
const progressEl = document.getElementById('progress');
const messageEl = document.getElementById('message');
const boardEl = document.getElementById('board');
const colTodo = document.getElementById('cards-todo');
const colInProgress = document.getElementById('cards-in-progress');
const colDone = document.getElementById('cards-done');

function clearContainer(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function calculateDonePercent() {
  let doneCount = 0;
  for (const item of tasks) {
    if (item.status === 'done') {
      doneCount += 1;
    }
  }
  const percent = Math.round((doneCount / tasks.length) * 100);
  return { doneCount, percent };
}

function createCardElement(task) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = task.title;

  const meta = document.createElement('div');
  meta.className = 'card-meta';
  meta.textContent = `Priority: ${task.priority} | #${task.tag} | Urgent: ${task.isUrgent}`;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  if (task.status === 'todo') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Start →';
    btn.dataset.id = String(task.id);
    btn.dataset.target = 'in-progress';
    actions.appendChild(btn);
  } else if (task.status === 'in-progress') {
    const btnBack = document.createElement('button');
    btnBack.type = 'button';
    btnBack.textContent = '← To Do';
    btnBack.dataset.id = String(task.id);
    btnBack.dataset.target = 'todo';

    const btnDone = document.createElement('button');
    btnDone.type = 'button';
    btnDone.textContent = 'Done →';
    btnDone.dataset.id = String(task.id);
    btnDone.dataset.target = 'done';

    actions.appendChild(btnBack);
    actions.appendChild(btnDone);
  } else if (task.status === 'done') {
    const btnReopen = document.createElement('button');
    btnReopen.type = 'button';
    btnReopen.textContent = '← Reopen';
    btnReopen.dataset.id = String(task.id);
    btnReopen.dataset.target = 'in-progress';
    actions.appendChild(btnReopen);
  }

  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(actions);
  return card;
}

function render() {
  clearContainer(colTodo);
  clearContainer(colInProgress);
  clearContainer(colDone);

  const { doneCount, percent } = calculateDonePercent();
  progressEl.textContent = `Progress: ${doneCount} of ${tasks.length} tasks completed (${percent}%)`;

  const searchVal = searchInput.value.toLowerCase().trim();
  const selectedTag = tagFilter.value;

  const filtered = tasks.filter((t) => {
    const matchTag = selectedTag === 'all' || t.tag === selectedTag;
    const matchSearch = t.title.toLowerCase().includes(searchVal);
    return matchTag && matchSearch;
  });

  const todoItems = filtered.filter((t) => t.status === 'todo');
  const inProgressItems = filtered.filter((t) => t.status === 'in-progress');
  const doneItems = filtered.filter((t) => t.status === 'done');

  if (todoItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-info';
    empty.textContent = 'No tasks found';
    colTodo.appendChild(empty);
  } else {
    for (const item of todoItems) colTodo.appendChild(createCardElement(item));
  }

  if (inProgressItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-info';
    empty.textContent = 'No tasks found';
    colInProgress.appendChild(empty);
  } else {
    for (const item of inProgressItems) colInProgress.appendChild(createCardElement(item));
  }

  if (doneItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-info';
    empty.textContent = 'No tasks found';
    colDone.appendChild(empty);
  } else {
    for (const item of doneItems) colDone.appendChild(createCardElement(item));
  }
}

boardEl.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-id]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const targetStatus = btn.dataset.target;
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  if (targetStatus === 'in-progress' && task.status !== 'in-progress') {
    let inProgressCount = 0;
    for (const t of tasks) {
      if (t.status === 'in-progress') inProgressCount += 1;
    }
    if (inProgressCount >= 3) {
      messageEl.textContent = 'Action blocked: In Progress column holds at most 3 cards!';
      return;
    }
  }

  messageEl.textContent = '';
  task.status = targetStatus;
  render();
});

searchInput.addEventListener('input', render);
tagFilter.addEventListener('change', render);

render();
