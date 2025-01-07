import type { NextPage } from 'next';
import Regiao from './components/Regiao';

const Home: NextPage = () => {
  return (
    <main className="min-h-screen p-5 pb-10 gap-16 sm:p-5 font-[family-name:var(--font-geist-sans)]">
      <Regiao />
    </main>
  );
};

export default Home;
