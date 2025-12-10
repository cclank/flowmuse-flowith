import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, BoardEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Board } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // FLOWMUSE BOARDS
  app.get('/api/boards', async (c) => {
    await BoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await BoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/boards', async (c) => {
    try {
      const { title } = (await c.req.json()) as { title?: string };
      if (!title?.trim()) return bad(c, 'title is required');
      const newBoard: Board = {
        id: crypto.randomUUID(),
        title: title.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodes: [],
        edges: [],
      };
      const created = await BoardEntity.create(c.env, newBoard);
      return ok(c, created);
    } catch (e) {
      return bad(c, 'Invalid request body');
    }
  });
  app.get('/api/boards/:id', async (c) => {
    const id = c.req.param('id');
    const board = new BoardEntity(c.env, id);
    if (!await board.exists()) return notFound(c, 'Board not found');
    return ok(c, await board.getState());
  });
  app.put('/api/boards/:id', async (c) => {
    const id = c.req.param('id');
    const boardEntity = new BoardEntity(c.env, id);
    if (!await boardEntity.exists()) return notFound(c, 'Board not found');
    try {
      const updates = (await c.req.json()) as Partial<Board>;
      const updatedBoard = await boardEntity.mutate(s => ({
        ...s,
        ...updates,
        id: s.id, // ensure id is not changed
        createdAt: s.createdAt, // ensure createdAt is not changed
        updatedAt: new Date().toISOString(),
      }));
      return ok(c, updatedBoard);
    } catch (e) {
      return bad(c, 'Invalid request body');
    }
  });
  app.delete('/api/boards/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await BoardEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  app.post('/api/boards/seed', async (c) => {
    await BoardEntity.ensureSeed(c.env);
    return ok(c, { seeded: true });
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}