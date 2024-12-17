"use client";
import { useEffect, useState } from "react";

interface Usuario {
  ID: number;
  NOME: string;
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erro, setErro] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const resposta = await fetch(
          "http://127.0.0.1:8888/bodymap/backend/api/usuarios.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        setUsuarios(dados);
      } catch (erro) {
        setErro("Não foi possível carregar os usuários");
        console.error("Erro ao buscar usuários:", erro);
      }
    };

    if (mounted) {
      buscarUsuarios();
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-8 mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Lista de Usuários</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {erro ? (
          <p className="text-red-500 text-center">{erro}</p>
        ) : usuarios.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid grid-cols-2 font-semibold border-b pb-2">
              <span>ID</span>
              <span>Nome</span>
            </div>
            {usuarios.map((usuario) => (
              <div key={usuario.ID} className="grid grid-cols-2 border-b pb-2">
                <span>{usuario.ID}</span>
                <span>{usuario.NOME}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Carregando usuários...</p>
        )}
      </div>
    </div>
  );
}
