'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../components/ui/carousel';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../components/ui/drawer';
import { Button } from '../../components/ui/button';

interface Regiao {
  id: number | string;
  region: string;
}

interface ItemRegiao {
  id: number;
  name: string;
  region: string;
  image: string;
}

interface DadosMusculo {
  id: number;
  name: string;
  origin: string;
  insertion: string;
  innervation: string;
  action: string;
  movementplane: string;
  region: string;
  image: string;
}

const API_BASE_URL = 'http://127.0.0.1:8888/bodymap/backend/api';

export default function Regiao() {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [itensRegiao, setItensRegiao] = useState<{
    [key: string]: ItemRegiao[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [dadosMusculo, setDadosMusculo] = useState<DadosMusculo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingMuscle, setIsLoadingMuscle] = useState(false);

  useEffect(() => {
    buscarRegioes();
  }, []);

  const buscarDadosMusculo = async (id: number) => {
    setIsLoadingMuscle(true);
    try {
      const resposta = await fetch(
        `${API_BASE_URL}/modalitemselecionado.php?id=${id}&XDEBUG_SESSION_START=VSCODE`,
      );
      const dados = await resposta.json();
      setDadosMusculo(Array.isArray(dados) ? dados : [dados]);
      setIsOpen(true);
    } catch (erro) {
      console.error('Erro ao buscar dados do músculo:', erro);
      setDadosMusculo([]);
    } finally {
      setIsLoadingMuscle(false);
    }
  };

  const buscarRegioes = async () => {
    try {
      const resposta = await fetch(`${API_BASE_URL}/regiao.php`);
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      const dados = await resposta.json();
      setRegioes(dados);

      const itensPromises = dados.map(async (regiao: Regiao) => {
        const respostaItens = await fetch(
          `${API_BASE_URL}/itemregiao.php?regiao=${regiao.region}&XDEBUG_SESSION_START=VSCODE`,
        );
        const dadosItens = await respostaItens.json();
        return { region: regiao.region, itens: dadosItens };
      });

      const resultados = await Promise.all(itensPromises);
      const itensMap: { [key: string]: ItemRegiao[] } = resultados.reduce(
        (acc, { region, itens }) => {
          acc[region] = itens;
          return acc;
        },
        {} as { [key: string]: ItemRegiao[] },
      );

      setItensRegiao(itensMap);
    } catch (erro) {
      console.error('Erro ao buscar regiões:', erro);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  const musculoSelecionado = dadosMusculo[0];

  return (
    <>
      {/* Loader */}
      {isLoadingMuscle && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      <div className="w-full max-w-4xl mt-8 mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Região</h1>

        {regioes.map((regiao) => (
          <Accordion key={regiao.region} type="single" collapsible>
            <AccordionItem value={`item-${regiao.region}`}>
              <AccordionTrigger>{regiao.region}</AccordionTrigger>
              <AccordionContent>
                <Carousel className="w-full">
                  <CarouselContent>
                    {itensRegiao[regiao.region]?.map((item) => (
                      <CarouselItem
                        key={item.id}
                        className="basis-1/3"
                        onClick={() => buscarDadosMusculo(item.id)}
                      >
                        <div className="flex flex-col items-center p-4">
                          <Image
                            src={`data:image/jpeg;base64,${item.image}`}
                            alt={item.name}
                            width={150}
                            height={150}
                            className="rounded-lg"
                            priority
                          />
                          <span className="mt-2 text-center text-sm font-semibold">
                            {item.name}
                          </span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{musculoSelecionado?.name || 'Detalhes do Músculo'}</DrawerTitle>
              <DrawerDescription>Informações detalhadas do músculo selecionado</DrawerDescription>
            </DrawerHeader>

            {musculoSelecionado && (
              <div className="p-4">
                <div className="flex flex-col items-center space-y-4">
                  <Image
                    src={`data:image/jpeg;base64,${musculoSelecionado.image}`}
                    alt={musculoSelecionado.name}
                    width={200}
                    height={200}
                    priority
                    className="rounded-lg"
                  />
                  <div className="space-y-2 w-full">
                    <p>
                      <strong>Origem:</strong> {musculoSelecionado.origin}
                    </p>
                    <p>
                      <strong>Inserção:</strong> {musculoSelecionado.insertion}
                    </p>
                    <p>
                      <strong>Inervação:</strong> {musculoSelecionado.innervation}
                    </p>
                    <p>
                      <strong>Ação:</strong> {musculoSelecionado.action}
                    </p>
                    <p>
                      <strong>Plano de Movimento:</strong> {musculoSelecionado.movementplane}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
