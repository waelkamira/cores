import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from 'mongoose';
import { User } from '../../models/UserModel';
import bcrypt from 'bcrypt';

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
      async authorize(credentials) {
        await mongoose.connect(process.env.NEXT_PUBLIC_Mongodb_url);
        const email = credentials?.email;
        const password = credentials?.password;
        const user = await User.findOne({ email });

        if (!user) {
          //? قمنا برمي خطأ هنا حتى نلتقطه في الفرونت اند ونعرضه للمستخدم
          throw new Error('the email is incorrect');
        }

        //?  بمقارنة كلمة السر المدخلة من قبل المستخدم عند تسجيل الدخول مع الكلمة المحفوظة في قاعدة البياناتmethod compare هنا انتبه تقوم ال
        //? لهذه الكلمة hash بعمل  bcrypt وقبل المقارنة تقوم
        //? hash ثم مقارنة الكلمتين بعد ال
        //? هنا الترتيب مهم جدا البارامتر الاول كلمة السر المدخلة
        const isPassword = await bcrypt.compare(password, user?.password);
        if (!isPassword) {
          //? قمنا برمي خطأ هنا حتى نلتقطه في الفرونت اند ونعرضه للمستخدم
          throw new Error('the password is wrong');
        }
        if (user && isPassword) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  //?Browser لحفظ معلومات المستخدم المصادق عليها في ال session طريقة تشفير ال
  session: { strategy: 'jwt' },

  //? لتحديد الاخطاء في بيئة التطوير عند التسجيل
  debug: process.env.NODE_ENV === 'development',

  //? لاعادة التوجيه و وضعنا مسار صفحة تسجيل الدخول router بدلا من استخدام pages هنا استخدمنا
  pages: { signIn: '/login' },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
