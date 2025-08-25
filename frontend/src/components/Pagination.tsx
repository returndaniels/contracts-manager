type Props = {
  page: number
  pageSize: number
  total: number
  onChange: (p:number)=>void
}

export default function Pagination({ page, pageSize, total, onChange }: Props){
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="pagination" style={{marginTop:12}}>
      <button className="button secondary" disabled={page<=1} onClick={()=>onChange(1)}>&laquo;</button>
      <button className="button secondary" disabled={page<=1} onClick={()=>onChange(page-1)}>Anterior</button>
      <span>Página {page} de {totalPages}</span>
      <button className="button secondary" disabled={page>=totalPages} onClick={()=>onChange(page+1)}>Próxima</button>
      <button className="button secondary" disabled={page>=totalPages} onClick={()=>onChange(totalPages)}>&raquo;</button>
    </div>
  )
}
