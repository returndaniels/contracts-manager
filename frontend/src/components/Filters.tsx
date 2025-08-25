import { useState } from "react";

type Props = {
  onSearch: (filters: any) => void;
  initial?: any;
};

export default function Filters({ onSearch, initial }: Props) {
  const [q, setQ] = useState(initial?.q ?? "");
  const [supplier, setSupplier] = useState(initial?.supplier ?? "");
  const [status, setStatus] = useState(initial?.status ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [value_min, setValueMin] = useState(initial?.value_min ?? "");
  const [value_max, setValueMax] = useState(initial?.value_max ?? "");
  const [start_from, setStartFrom] = useState(initial?.start_from ?? "");
  const [end_to, setEndTo] = useState(initial?.end_to ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({
      q,
      supplier,
      status,
      category,
      value_min,
      value_max,
      start_from,
      end_to,
    });
  }

  function clear() {
    setQ("");
    setSupplier("");
    setStatus("");
    setCategory("");
    setValueMin("");
    setValueMax("");
    setStartFrom("");
    setEndTo("");
    onSearch({});
  }

  return (
    <form onSubmit={submit} className="grid cols-4" style={{ width: "100%" }}>
      <input
        className="input"
        placeholder="Buscar (número, fornecedor, descrição, responsável)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="input"
        placeholder="Fornecedor"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
      />
      <select
        className="input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        <option value="active">Ativo</option>
        <option value="pending">Pendente</option>
        <option value="suspended">Suspenso</option>
        <option value="terminated">Encerrado</option>
        <option value="expired">Vencido</option>
      </select>
      <input
        className="input"
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        className="input"
        placeholder="Valor mín."
        type="number"
        step="0.01"
        value={value_min}
        onChange={(e) => setValueMin(e.target.value)}
      />
      <input
        className="input"
        placeholder="Valor máx."
        type="number"
        step="0.01"
        value={value_max}
        onChange={(e) => setValueMax(e.target.value)}
      />
      <input
        className="input"
        placeholder="Início a partir de"
        type="date"
        value={start_from}
        onChange={(e) => setStartFrom(e.target.value)}
      />
      <input
        className="input"
        placeholder="Fim até"
        type="date"
        value={end_to}
        onChange={(e) => setEndTo(e.target.value)}
      />
      <div
        className="toolbar"
        style={{ gridColumn: "1 / -1", justifyContent: "flex-end" }}
      >
        <button type="button" className="button secondary" onClick={clear}>
          Limpar
        </button>
        <button className="button" type="submit">
          Aplicar
        </button>
      </div>
    </form>
  );
}
