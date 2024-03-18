import { getServerSession } from 'next-auth';
import Component from '../components/login-btn';
import Dashboard from './dashboard/page';
import { authOptions } from './api/authOptions/route';

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log('this is session', session);
  return (
    <main className="flex justify-between items-center p-8 gap-8">
      <div>
        <h1>Home Page</h1>
        <h1>Server Side</h1>
        <h1>{JSON.stringify(session)}</h1>
        {session && <Dashboard />}
      </div>
      <Component />
    </main>
  );
}
