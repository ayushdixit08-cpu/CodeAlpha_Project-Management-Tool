import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@flowboard.dev', initials: 'AM', color: '#f59e0b' },
  { id: 'u2', name: 'Maya Chen', email: 'maya@flowboard.dev', initials: 'MC', color: '#8b5cf6' },
  { id: 'u3', name: 'Jordan Lee', email: 'jordan@flowboard.dev', initials: 'JL', color: '#10b981' },
  { id: 'u4', name: 'Sam Rivera', email: 'sam@flowboard.dev', initials: 'SR', color: '#ef4444' }
];
const projects = [
  { id: 'p1', name: 'Website redesign', description: 'Marketing site refresh and launch plan', color: '#ec4899', due: 'Oct 18, 2026', members: ['u1', 'u2', 'u3', 'u4'] },
  { id: 'p2', name: 'Mobile app launch', description: 'Ship the new mobile experience', color: '#f59e0b', due: 'Nov 02, 2026', members: ['u1', 'u2', 'u3'] }
];
const tasks = [
  { id: 't1', projectId: 'p1', title: 'Finalize homepage copy', description: 'Review the latest copy deck and add final CTAs.', status: 'todo', priority: 'High', assignee: 'u2', due: 'Today', comments: 3, tags: ['Copy', 'Website'] },
  { id: 't2', projectId: 'p1', title: 'Create responsive wireframes', description: 'Desktop, tablet and mobile breakpoints.', status: 'progress', priority: 'Medium', assignee: 'u3', due: 'Tomorrow', comments: 5, tags: ['Design'] },
  { id: 't3', projectId: 'p1', title: 'Set up analytics events', description: 'Document and configure the new conversion events.', status: 'progress', priority: 'Low', assignee: 'u1', due: 'Oct 15', comments: 1, tags: ['Engineering'] },
  { id: 't4', projectId: 'p1', title: 'QA staging build', description: 'Run the release checklist on staging.', status: 'done', priority: 'High', assignee: 'u4', due: 'Oct 10', comments: 8, tags: ['QA'] },
  { id: 't5', projectId: 'p1', title: 'Prepare launch email', description: 'Write and schedule launch announcement.', status: 'todo', priority: 'Medium', assignee: 'u1', due: 'Oct 17', comments: 0, tags: ['Marketing'] },
  { id: 't6', projectId: 'p1', title: 'Update social preview cards', description: 'Create OG images for the key pages.', status: 'todo', priority: 'Low', assignee: 'u3', due: 'Oct 19', comments: 2, tags: ['Design'] },
  { id: 't7', projectId: 'p2', title: 'App Store screenshots', description: 'Capture the final iOS and Android flows.', status: 'progress', priority: 'High', assignee: 'u2', due: 'Oct 22', comments: 2, tags: ['Launch'] }
];
const comments = { t1: [{ id: 'c1', userId: 'u3', text: 'I left two CTA suggestions in the doc.', time: '18 min ago' }, { id: 'c2', userId: 'u2', text: 'Great, I will review those this afternoon.', time: '12 min ago' }] };
const subscribers = new Set();
const broadcast = (event) => subscribers.forEach((res) => res.write(`data: ${JSON.stringify(event)}\n\n`));

app.post('/api/login', (req, res) => {
  const user = users.find((item) => item.email === req.body.email);
  if (!user || req.body.password !== 'demo123') return res.status(401).json({ error: 'Use a workspace email and the demo password.' });
  res.json({ token: `demo-${user.id}`, user });
});
app.get('/api/bootstrap', (_req, res) => res.json({ user: users[0], users, projects, tasks }));
app.get('/api/tasks/:id/comments', (req, res) => res.json(comments[req.params.id] || []));
app.post('/api/tasks', (req, res) => {
  const task = { id: `t${Date.now()}`, comments: 0, tags: [], ...req.body };
  tasks.push(task); broadcast({ type: 'task.created', task }); res.status(201).json(task);
});
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  Object.assign(task, req.body); broadcast({ type: 'task.updated', task }); res.json(task);
});
app.post('/api/tasks/:id/comments', (req, res) => {
  const comment = { id: `c${Date.now()}`, userId: 'u1', text: req.body.text, time: 'just now' };
  comments[req.params.id] = [...(comments[req.params.id] || []), comment];
  const task = tasks.find((item) => item.id === req.params.id); if (task) task.comments += 1;
  broadcast({ type: 'comment.created', taskId: req.params.id, comment }); res.status(201).json(comment);
});
app.get('/api/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }); res.flushHeaders();
  subscribers.add(res); req.on('close', () => subscribers.delete(res));
});
app.listen(4000, () => console.log('Flowboard API running at http://localhost:4000'));
