const request = require('supertest');
const { app, resetTasks } = require('../src/app');

beforeEach(() => resetTasks());

describe('GET /', () => {
  it('returns API info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Task Manager API');
  });
});

describe('GET /health', () => {
  it('returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});

describe('GET /tasks', () => {
  it('returns empty array initially', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.tasks).toEqual([]);
  });
});

describe('POST /tasks', () => {
  it('creates a task successfully', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Test Task', description: 'Desc' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.status).toBe('pending');
  });

  it('returns 400 if title missing', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /tasks/:id', () => {
  it('returns 404 for non-existent task', async () => {
    const res = await request(app).delete('/tasks/fake-id');
    expect(res.statusCode).toBe(404);
  });
});
