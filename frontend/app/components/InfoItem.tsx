'use client';
import { Separator } from '@/components/ui/separator';

interface InfoItemProps {
  nome: string;
  valor: string;
}

export default function InfoItem({ nome, valor }: InfoItemProps) {
  return (
    <div>
      <p className="text-gray-500">{nome}:</p>
      <p>{valor}.</p>
      <Separator />
    </div>
  );
}
