import { chatsRouter } from '~/server/api/routers/chats';
import { eventsRouter } from '~/server/api/routers/events';
import { messagesRouter } from '~/server/api/routers/messages';
import { usersRouter } from '~/server/api/routers/users';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  chats: chatsRouter,
  messages: messagesRouter,
  events: eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
