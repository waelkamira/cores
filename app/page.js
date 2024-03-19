import { getServerSession } from 'next-auth';
import Component from '../components/login-btn';
import Dashboard from './dashboard/page';
import { authOptions } from './api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
export default async function Home() {
  const session = await getServerSession(authOptions);
  const hash = await bcrypt.hash('wael', 10);
  console.log('this is hash', hash);
  return (
    <main className="flex justify-between items-center p-8 gap-8">
      <div>
        <h1>Home Page</h1>
        <h1>Server Side</h1>
        <h1>{JSON.stringify(session)}</h1>
        {session && <Dashboard />}
      </div>
    </main>
  );
}
