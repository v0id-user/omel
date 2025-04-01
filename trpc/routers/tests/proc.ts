import { baseProcedure, protectedProcedure } from '@/trpc/init';
import { createTRPCRouter } from '@/trpc/init';

export const testsRouter = createTRPCRouter({
  nonProtectedHello: baseProcedure.query(() => {
    return 'Hello, world!';
  }),
  protectedHello: protectedProcedure.query(({ ctx }) => {
    return `Hello, ${ctx.session?.user.email}!`;
  }),
});
