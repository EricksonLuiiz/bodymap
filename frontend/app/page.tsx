import type { NextPage } from 'next';
import Regiao from './components/Regiao';

const Home: NextPage = () => {
  return (
    <main className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Regiao />
    </main>
  );
};

export default Home;
