import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function ContractDetail() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const id = params.id;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/contracts/${id}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="container">
        <p>Carregando...</p>
      </div>
    );
  if (!data)
    return (
      <div className="container">
        <p>Contrato não encontrado</p>
      </div>
    );

  return (
    <div className="container">
      <Link to="/">← Voltar</Link>
      <div className="card" style={{ marginTop: 12 }}>
        <h2>{data.number}</h2>
        <p>
          <strong>Fornecedor:</strong> {data.supplier}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p>
        <p>
          <strong>Categoria:</strong> {data.category}
        </p>
        <p>
          <strong>Valor:</strong> R${" "}
          {Number(data.value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </p>
        <p>
          <strong>Período:</strong>{" "}
          {new Date(data.start_date).toLocaleDateString()} —{" "}
          {new Date(data.end_date).toLocaleDateString()}
        </p>
        {data.description && (
          <p>
            <strong>Descrição:</strong> {data.description}
          </p>
        )}
        <p>
          <strong>Responsável:</strong> {data.responsible}
        </p>
        <p>
          <small>
            Criado em {new Date(data.created_at).toLocaleString()} • Atualizado
            em {new Date(data.updated_at).toLocaleString()}
          </small>
        </p>
      </div>
    </div>
  );
}
