export const useRegiao = () => {
  const fetchRegiao = async () => {
    const resposta = await fetch('http://127.0.0.1/bodymap/backend/api/regiao.php');
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    return await resposta.json();
  };
  return { fetchRegiao };
};
