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
import { ScrollArea } from '../../components/ui/scroll-area';
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

function firstLetterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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

      <div className="w-full max-w-lg mt-8 mx-auto text-center bg-[hsl(var(--card))] shadow-lg rounded-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-6">BodyMap</h2>
        <h4>Um mapa completos dos músculos.</h4>
        <h4 className="mb-[50px]">Origem, inserção e ação.</h4>

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
                        className="basis-2/2 bg-[hsl(var(--card))] cursor-pointer"
                        onClick={() => buscarDadosMusculo(item.id)}
                      >
                        <div className="flex flex-col items-center p-4 justify-center">
                          <div className="h-[100px] flex items-center justify-center">
                            <img
                              src={`data:image/jpeg;base64,${item.image}`}
                              alt={item.name}
                              className="rounded-lg w-auto h-[100px]"
                            />
                          </div>
                          <span className="mt-2 text-center text-psm font-semibold">
                            {item.name.toUpperCase()}
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
        <DrawerContent className="h-full bg-[hsl(var(--card))] border-none">
          <div className="mx-auto w-auto">
            <DrawerHeader>
              <DrawerTitle>
                {musculoSelecionado?.name.toUpperCase() || 'Detalhes do Músculo'}
              </DrawerTitle>
              <DrawerDescription className="text-sm">
                Informações detalhadas do músculo selecionado
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="p-4 max-h-[60vh] overflow-auto rounded-md scrollbar-custom">
              {musculoSelecionado && (
                <div className="p-4">
                  <div className="flex flex-col items-center space-y-4 overflow-auto">
                    <img
                      src={`data:image/jpeg;base64,${musculoSelecionado.image}`}
                      alt={musculoSelecionado.name}
                      width={200}
                      className="rounded-lg"
                    />
                    <div className="space-y-2 w-full">
                      <p>
                        <strong>Origem:</strong> {firstLetterToUpperCase(musculoSelecionado.origin)}
                        {'.'}
                      </p>
                      <p>
                        <strong>Inserção:</strong>{' '}
                        {firstLetterToUpperCase(musculoSelecionado.insertion)}
                        {'.'}
                      </p>
                      <p>
                        <strong>Inervação:</strong>{' '}
                        {firstLetterToUpperCase(musculoSelecionado.innervation)}
                        {'.'}
                      </p>
                      <p>
                        <strong>Ação:</strong> {firstLetterToUpperCase(musculoSelecionado.action)}
                        {'.'}
                      </p>
                      {musculoSelecionado.movementplane ? (
                        <p>
                          <strong>Plano de Movimento:</strong>{' '}
                          {firstLetterToUpperCase(musculoSelecionado.movementplane)}
                          {'.'}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="mb-5 w-40 mx-auto bg-[hsl(var(--background))] bg-hover:bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white"
                >
                  Fechar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
