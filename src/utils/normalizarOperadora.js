// src/utils/normalizarOperadora.js
const DICIONARIO = {
  saude: "Saúde", saúde: "Saúde",
  assistencia: "Assistência",
  medica: "Médica", médica: "Médica",
  medico: "Médico",
  medicos: "Médicos",
  clinica: "Clínica",
  servicos: "Serviços",
  servico: "Serviço",
  odontologica: "Odontológica",
  odontologico: "Odontológico",
  beneficiencia: "Beneficência",
  beneficio: "Benefício",
  beneficios: "Benefícios",
  associacao: "Associação",
  fundacao: "Fundação",
  previdencia: "Previdência",
  hospitalar: "Hospitalar",
  regiao: "Região",
  recuperacao: "Recuperação",
  judicial: "Judicial",
  evangelica: "Evangélica",
  de: "de", da: "da", do: "do", das: "das", dos: "dos", e: "e",
  sao: "São",
  goias: "Goiás",
  espirito: "Espírito",
  parana: "Paraná",
  ceara: "Ceará",
  maranhao: "Maranhão",
  para: "Pará",
  amazonia: "Amazônia",
  rondonia: "Rondônia",
};

export function normalizarOperadora(nomeCru) {
  const palavras = nomeCru.split(" ");
  return palavras
    .map((palavra, i) => {
      const chaveBusca = palavra
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const substituto = DICIONARIO[chaveBusca];
      if (substituto) {
        if (["de", "da", "do", "das", "dos", "e"].includes(chaveBusca) && i > 0) {
          return substituto;
        }
        if (i === 0) {
          return substituto.charAt(0).toUpperCase() + substituto.slice(1);
        }
        return substituto;
      }
      return palavra;
    })
    .join(" ");
}
