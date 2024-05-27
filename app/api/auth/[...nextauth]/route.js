import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from 'mongoose';
import { User } from '../../models/UserModel';
import bcrypt from 'bcrypt';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../../lib/Mongodb';

//?وتصديرها authOptions نقوم بتعريف
//! production وضعها هنا خطأ يجب أن توضع في ملف منفصل واستيرادها الى هنا والا سوف تسبب خطأ في ال
export const authOptions = {
  //?يستخدم للتشفير
  secret: process.env.NEXT_PUBLIC_SECRET,
  adapter: MongoDBAdapter(clientPromise),
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
        name: { label: 'Your Name', type: 'text', placeholder: 'your name' },
        email: { label: 'Your Email', type: 'text', placeholder: 'your email' },
        password: {
          label: 'Your Password',
          type: 'password',
          placeholder: 'your password',
        },
      },

      async authorize(credentials) {
        //? login في الكمبوننت signIn() هي القيم المدخلة من قبل المستخدم و المرسلة عن طريق الدالة credentials هذه ال
        await mongoose.connect(process.env.NEXT_PUBLIC_Mongodb_url);

        const email = credentials?.email;
        const password = credentials?.password;
        const user = await User.findOne({ email });

        if (!user) {
          //? قمنا برمي خطأ هنا حتى نلتقطه في الفرونت اند ونعرضه للمستخدم
          throw new Error('the email is incorrect');
        }

        //? بمقارنة كلمة السر المدخلة من قبل المستخدم عند تسجيل الدخول مع الكلمة المحفوظة في قاعدة البياناتmethod compare هنا انتبه تقوم ال
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
  callbacks: {
    async session({ session }) {
      return session;
    },
    async signIn({ profile }) {
      console.log(profile);
      try {
        await mongoose.connect(process.env.NEXT_PUBLIC_Mongodb_url);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
  //?Browser و حفظ معلومات المستخدم المصادق عليها في ال session طريقة تشفير ال
  session: { strategy: 'jwt' },

  //? terminal لتحديد الاخطاء في بيئة التطوير عند التسجيل و عرض الاخطاء في ال
  debug: process.env.NODE_ENV === 'development',

  //? لاعادة التوجيه و وضعنا مسار صفحة تسجيل الدخول router بدلا من استخدام pages هنا استخدمنا
  pages: { signIn: '/login' },
};

//?كبرامتر لها authOptions وتمرير  handler نقوم بانشاء
const handler = NextAuth(authOptions);
//? بهذه الطريقة handler نقوم بتصدير ال
export { handler as GET, handler as POST };

//? هنا معلومات مفصلة عن كل جزء

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
// export default NextAuth({
//?   // https://next-auth.js.org/configuration/providers
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     EmailProvider({
//       server: process.env.EMAIL_SERVER,
//       from: process.env.EMAIL_FROM,
//     }),
// CredentialsProvider({
//   credentials: {
//     email: { label: 'Email', type: 'text ', placeholder: 'jsmith@example.com' },
//     password: { label: 'Password', type: 'password' },
//   },
//   async authorize(credentials, req) {
// ?     // You need to provide your own logic here that takes the credentials
// ?     // submitted and returns either a object representing a user or value
// ?     // that is false/null if the credentials are invalid.
// ?     // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
// ?     // You can also use the `req` object to obtain additional parameters
// ?     // (i.e., the request IP address)
//     const res = await fetch('http://localhost:3000/api/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const user = await res.json();

//?     // If no error and we have user data, return it
//     if (res.ok && user) {
//       return user;
//     }
//?     // Return null if user data could not be retrieved
//     return null;
//   },
// }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//   ],

//?   // The secret should be set to a reasonably long random string.
//?   // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
//?   // a separate secret is defined explicitly for encrypting the JWT.
//   secret: process.env.SECRET,

//   session: {
//?     // Use JSON Web Tokens for session instead of database sessions.
//?     // This option can be used with or without a database for users/accounts.
//?     // Note: `jwt` is automatically set to `true` if no database is specified.
//     jwt: true,

//?     // Seconds - How long until an idle session expires and is no longer valid.
//?     // maxAge: 30 * 24 * 60 * 60, // 30 days

//?     // Seconds - Throttle how frequently to write to database to extend a session.
//?     // Use it to limit write operations. Set to 0 to always update the database.
//?     // Note: This option is ignored if using JSON Web Tokens
//?     // updateAge: 24 * 60 * 60, // 24 hours
//   },

//?   // JSON Web tokens are only used for sessions if the `jwt: true` session
//?   // option is set - or by default if no database is specified.
//?   // https://next-auth.js.org/configuration/options#jwt
//   jwt: {
//?     // A secret to use for key generation (you should set this explicitly)
//?     // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
//?     // Set to true to use encryption (default: false)
//?     // encryption: true,
//?     // You can define your own encode/decode functions for signing and encryption
//?     // if you want to override the default behaviour.
//?     // encode: async ({ secret, token, maxAge }) => {},
//?     // decode: async ({ secret, token, maxAge }) => {},
//   },

//?   // You can define custom pages to override the built-in ones. These will be regular Next.js pages
//?   // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
//?   // The routes shown here are the default URLs that will be used when a custom
//?   // pages is not specified for that route.
//?   // https://next-auth.js.org/configuration/pages
//   pages: {
//?     // signIn: '/auth/signin',  // Displays signin buttons
//?     // signOut: '/auth/signout', // Displays form with sign out button
//?     // error: '/auth/error', // Error code passed in query string as ?error=
//?     // verifyRequest: '/auth/verify-request', // Used for check email page
//?     // newUser: null // If set, new users will be directed here on first sign in
//   },

//?   // Callbacks are asynchronous functions you can use to control what happens
//?   // when an action is performed.
//?   // https://next-auth.js.org/configuration/callbacks
//   callbacks: {
//?     // async signIn(user, account, profile) { return true },
//?     // async redirect(url, baseUrl) { return baseUrl },
//?     // async session(session, user) { return session },
//?     // async jwt(token, user, account, profile, isNewUser) { return token }
//   },

//?   // Events are useful for logging
//?   // https://next-auth.js.org/configuration/events
//   events: {
//     signIn: ({ user, account, profile, isNewUser }) => {
//       console.log(`isNewUser: ${JSON.stringify(isNewUser)}`);
//     },
//?     // updateUser({ user })
//   },

//?   // You can set the theme to 'light', 'dark' or use 'auto' to default to the
//?   // whatever prefers-color-scheme is set to in the browser. Default is 'auto'
//   theme: 'light',

//?   // Enable debug messages in the console if you are having problems
//   debug: false,
// });
