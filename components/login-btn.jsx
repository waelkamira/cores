'use client';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.name} <br />
        <button
          type="text"
          onClick={() => signOut()}
          className="bg-red-400 hover:bg-red-600"
        >
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button
        type="text"
        onClick={() => signIn('/signIn')}
        className="bg-green-500 hover:bg-green-600"
      >
        Sign in
      </button>
    </>
  );
}
