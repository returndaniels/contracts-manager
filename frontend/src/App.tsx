import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import ContractForm from "./components/ContractForm";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";
import { Link } from "react-router-dom";

type Contract = {
  id: number;
  number: string;
  supplier: string;
  description?: string;
  responsible: string;
  status: "active" | "pending" | "suspended" | "terminated" | "expired";
  value: number;
  category: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

type Page = {
  items: Contract[];
  page: number;
  page_size: number;
  total: number;
};

export default function App() {
  const [data, setData] = useState<Page>({
    items: [],
    page: 1,
    page_size: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contract | null>(null);

  const [filters, setFilters] = useState<any>({
    q: "",
    supplier: "",
    status: "",
    category: "",
    value_min: "",
    value_max: "",
    start_from: "",
    end_to: "",
  });
  const [page, setPage] = useState(1);

  function fetchData() {
    setLoading(true);
    const params: any = { page, page_size: 10 };
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    api
      .get("/contracts", { params })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, [page]);

  function onSearch(newFilters: any) {
    setFilters(newFilters);
    setPage(1);
    setTimeout(fetchData, 0);
  }

  function onCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function onEdit(c: Contract) {
    setEditing(c);
    setShowForm(true);
  }

  function onDelete(c: Contract) {
    if (confirm(`Excluir contrato ${c.number}?`)) {
      api.delete(`/contracts/${c.id}`).then(() => fetchData());
    }
  }

  function onSubmit(payload: any) {
    const req = editing
      ? api.put(`/contracts/${editing.id}`, payload)
      : api.post("/contracts", payload);
    req.then(() => {
      setShowForm(false);
      setEditing(null);
      fetchData();
    });
  }

  return (
    <div className="container" style={{ position: "relative" }}>
      <h1>Gerenciador de Contratos</h1>
      <div className="card" style={{ marginTop: 12 }}>
        <div className="toolbar" style={{ justifyContent: "space-between" }}>
          <Filters onSearch={onSearch} initial={filters} />
          <button className="button" onClick={onCreate}>
            Novo contrato
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fornecedor</th>
                  <th>Status</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/contracts/${c.id}`}>{c.number}</Link>
                    </td>
                    <td>{c.supplier}</td>
                    <td>
                      <span className="badge">{c.status}</span>
                    </td>
                    <td>{c.category}</td>
                    <td>
                      R${" "}
                      {c.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>{new Date(c.start_date).toLocaleDateString()}</td>
                    <td>{new Date(c.end_date).toLocaleDateString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          className="button secondary"
                          onClick={() => onEdit(c)}
                        >
                          Editar
                        </button>
                        <button className="button" onClick={() => onDelete(c)}>
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={data.page}
              pageSize={data.page_size}
              total={data.total}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "hidden",
          }}
        >
          <div className="card">
            <ContractForm
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              onSubmit={onSubmit}
              value={editing || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
