'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex items-center justify-end">
        <h1 className="text-white">
          Signed in as{' '}
          <span className="text-red-400 text-xl ">{session?.user?.name}</span>
        </h1>{' '}
        <br />
        <button
          type="text"
          //?حتى يتم اعادة التوجيه الى الصفحة الرئيسية بعد تسجيل الخروج  { callbackUrl: '/' } تم وضع
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-400 hover:bg-red-500 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end">
      <h1 className="text-white">Not signed in</h1>
      <button
        type="text"
        //?[...nextauth] في  route في صفحة ال  pages في ال  signIn هنا يتم التوجيه الى الصفحة التي تم وضعها كقيمة مقابل
        //? Next Auth لاننا نريد الذهاب الى صفحة تسجيل الدخول التي قمنا نحن بانشائها وليس الصفحة التي تم انشاؤها من قبل
        onClick={() => signIn()}
        className="bg-green-500 hover:bg-green-600"
      >
        Sign in
      </button>
    </div>
  );
}
