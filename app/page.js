import { Product } from '../components/Product';

export default async function Home() {
  return (
    <main className="flex flex-col justify-center items-center p-4 gap-8 bg-slate-600 mt-24 border border-red-400">
      <div>
        <h1 className="text-center text-3xl text-red-400 font-bold italic m-8">
          Home Page
        </h1>

        <div>
          <Product />
        </div>
      </div>
    </main>
  );
}
