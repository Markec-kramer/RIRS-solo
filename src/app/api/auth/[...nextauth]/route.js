export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) return null;
        const ok = await bcrypt.compare(creds.password, user.password);
        return ok ? { id: user.id, email: user.email } : null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
