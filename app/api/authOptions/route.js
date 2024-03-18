import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
export const authOptions = {
  //?يستخدم للتشفير
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    }),

    //? لتفعيل تسجيل الدخول عن طريق الايميل  وكلمة السر
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        name: { label: 'Your Name', type: 'text' },
        email: { label: 'Your Email', type: 'text', placeholder: 'your Name' },
        password: { label: 'Your Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = { name: 'wael', email: 'wael@gmail.com' };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  //?Browser لحفظ معلومات المستخدم المصادق عليها في ال  session طريقة تشفير ال
  session: { strategy: 'jwt' },
  //? لتحديد الاخطاء في بيئة التطوير عند التسجيل
  debug: process.env.NODE_ENV === 'development',
  //? لاعادة التوجيه و وضعنا مسار صفحة تسجيل الدخول router بدلا من استخدام pages هنا استخدمنا
  pages: { signIn: '/signIn' },
};
