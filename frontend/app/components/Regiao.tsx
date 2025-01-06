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
import InfoItem from './InfoItem';
import Loading from './loading';

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

const API_BASE_URL = 'http://127.0.0.1:8888/bodymap/backend/view';

function firstLetterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Regiao() {
  const [regioes, setRegioes] = useState<Regiao[]>([]);
  const [itensRegiao, setItensRegiao] = useState<{
    [key: string]: ItemRegiao[];
  }>({});
  const [dadosMusculo, setDadosMusculo] = useState<DadosMusculo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMuscle, setIsLoadingMuscle] = useState(false);

  useEffect(() => {
    buscarRegioes();
  }, []);

  const buscarDadosMusculo = async (id: number) => {
    setIsLoadingMuscle(true);
    try {
      const resposta = await fetch(
        `${API_BASE_URL}/modalitemselecionado.php?id=${id}`,
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
          `${API_BASE_URL}/itemregiao.php?regiao=${regiao.region}`,
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
    return (
      <Loading />
    );
  }

  const musculoSelecionado = dadosMusculo[0];

  return (
    <>
      {/* Loader */}
      {isLoadingMuscle && (
        <Loading />
      )}

      <div className="w-full max-w-lg mt-8 mx-auto text-center bg-[hsl(var(--card))] shadow-lg rounded-lg p-10">
        <div className="text-[hsl(var(--chart-4))!important]">
          <Image
            priority
            src="logoBodyMap.svg"
            alt="Logo"
            className="w-3/5 mx-auto mb-4 [filter:brightness(90%)_invert(20%)_opacity(90%)] [mix-blend-mode:hard-light]"
            width={100}
            height={100}
          />
        </div>

        <div className="text-[hsl(var(--font-color))!important]">
          <h4>Um mapa completos dos músculos.</h4>
          <h4 className="mb-[50px]">Origem, inserção e ação.</h4>
        </div>

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
                            <Image
                              src={`data:image/jpeg;base64,${item.image}`}
                              alt={item.name}
                              className="rounded-lg w-auto h-[100px]"
                              width={100}
                              height={100}
                              placeholder="blur"
                              blurDataURL={`data:image/jpeg;base64,${item.image}`}
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
          <div className="mx-auto w-auto h-full flex flex-col justify-between">
            <DrawerHeader>
              <DrawerTitle>
                {musculoSelecionado?.name.toUpperCase() || 'Detalhes do Músculo'}
              </DrawerTitle>
              <DrawerDescription className="text-sm">
                Informações detalhadas do músculo selecionado
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="p-4 max-h-[80vh] overflow-auto rounded-md scrollbar-custom">
              {musculoSelecionado && (
                <div className="p-4">
                  <div className="flex flex-col items-center space-y-4 overflow-auto">
                    <Image
                      src={`data:image/jpeg;base64,${musculoSelecionado.image}`}
                      alt={musculoSelecionado.name}
                      width={200}
                      height={200}
                      placeholder="blur"
                      blurDataURL={`data:image/jpeg;base64,${musculoSelecionado.image}`}
                      className="rounded-lg"
                    />

                    <div className="space-y-2 w-full h-full">
                      <InfoItem
                        nome="Origem"
                        valor={firstLetterToUpperCase(musculoSelecionado.origin)}
                      />

                      <InfoItem
                        nome="Inserção"
                        valor={firstLetterToUpperCase(musculoSelecionado.insertion)}
                      />

                      <InfoItem
                        nome="Inervação"
                        valor={firstLetterToUpperCase(musculoSelecionado.innervation)}
                      />

                      <InfoItem
                        nome="Ação"
                        valor={firstLetterToUpperCase(musculoSelecionado.action)}
                      />

                      {musculoSelecionado.movementplane ? (
                        <>
                          <InfoItem
                            nome="Plano de Movimento"
                            valor={firstLetterToUpperCase(musculoSelecionado.movementplane)}
                          />
                        </>
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
                  className="mb-5 w-40 mx-auto bg-[hsl(var(--background))] hover:bg-none hover:text-black hover:border-black"
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
