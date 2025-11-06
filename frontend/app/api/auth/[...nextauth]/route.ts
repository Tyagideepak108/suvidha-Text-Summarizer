import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          });
          const data = await response.json();
          if (data.token) {
            user.backendToken = data.token;
            user.userId = data.userId;
          }
        } catch (error) {
          console.error('OAuth backend login failed:', error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.userId = user.userId;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.userId = token.userId;
      session.user.email = token.email;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
