import { useEffect, useState } from 'react'

type Props = {
  value?: any
  onCancel: ()=>void
  onSubmit: (payload:any)=>void
}

export default function ContractForm({ value, onCancel, onSubmit }: Props){
  const [form, setForm] = useState<any>({
    number:'', supplier:'', description:'', responsible:'',
    status:'pending', value:0, category:'', start_date:'', end_date:''
  })

  useEffect(()=>{
    if(value){
      setForm({
        number: value.number,
        supplier: value.supplier,
        description: value.description ?? '',
        responsible: value.responsible,
        status: value.status,
        value: value.value,
        category: value.category,
        start_date: value.start_date.substring(0,10),
        end_date: value.end_date.substring(0,10),
      })
    }
  }, [value])

  function change(e: any){
    const { name, value } = e.target
    setForm((f:any)=>({ ...f, [name]: value }))
  }

  function submit(e: React.FormEvent){
    e.preventDefault()
    if(!form.number || !form.supplier || !form.responsible || !form.category || !form.start_date || !form.end_date){
      alert('Preencha os campos obrigatórios.')
      return
    }
    onSubmit({
      ...form,
      value: Number(form.value)
    })
  }

  return (
    <form onSubmit={submit} className="grid cols-3">
      <input className="input" name="number" placeholder="Número" value={form.number} onChange={change} />
      <input className="input" name="supplier" placeholder="Fornecedor" value={form.supplier} onChange={change} />
      <input className="input" name="responsible" placeholder="Responsável" value={form.responsible} onChange={change} />
      <select className="input" name="status" value={form.status} onChange={change}>
        <option value="pending">Pendente</option>
        <option value="active">Ativo</option>
        <option value="suspended">Suspenso</option>
        <option value="terminated">Encerrado</option>
        <option value="expired">Vencido</option>
      </select>
      <input className="input" name="category" placeholder="Categoria" value={form.category} onChange={change} />
      <input className="input" name="value" type="number" step="0.01" placeholder="Valor" value={form.value} onChange={change} />
      <input className="input" name="start_date" type="date" value={form.start_date} onChange={change} />
      <input className="input" name="end_date" type="date" value={form.end_date} onChange={change} />
      <input className="input" name="description" placeholder="Descrição (opcional)" value={form.description} onChange={change} />
      <div className="toolbar" style={{gridColumn:'1 / -1', justifyContent:'flex-end'}}>
        <button type="button" className="button secondary" onClick={onCancel}>Cancelar</button>
        <button className="button" type="submit">{value ? 'Salvar' : 'Criar'}</button>
      </div>
    </form>
  )
}
