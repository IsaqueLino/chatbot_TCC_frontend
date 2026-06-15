import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Backend espera Form data, não JSON
          const formData = new URLSearchParams();
          formData.append('username', credentials.email);
          formData.append('password', credentials.password);
          formData.append('grant_type', 'password');

          const BASE = process.env.BASE_URL ?? '';
          const baseNoTrailing = BASE.replace(/\/$/, '');
          const loginUrl = BASE
            ? /\/api\/v1\/?$/.test(BASE)
              ? `${baseNoTrailing}/auth/login`
              : `${baseNoTrailing}/api/v1/auth/login`
            : '/api/v1/auth/login';

          const res = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          });

          const result = await res.json();

          if (res.ok && result.access_token) {
            return {
              accessToken: result.access_token,
              tokenType: result.token_type,
            };
          } else {
            console.error("Backend login failed:", result);
            return null;
          }
        } catch (error) {
          console.error('Error during authorization fetch:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    maxAge: 60 * 60 * 3, // 3 horas
    updateAge: 60 * 60 * 3,
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (trigger === 'signIn' && user) {
        try {
            if (user.accessToken) {
              const decodedToken = jwt.decode(user.accessToken);
              if (decodedToken) {
                token.id = decodedToken.id;
                token.username = decodedToken.sub;
                token.accessToken = user.accessToken;
                token.tokenType = user.tokenType;
                token.access_level = decodedToken.access_level;
              }
            }
        } catch (error) {
          console.error('Failed to authenticate user with backend:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.tokenType = token.tokenType;
        session.user = {
          id: token.id,
          username: token.username,
          access_level: token.access_level,
        };
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
