# Deploy do Frontend e Backend na EC2 com Docker

## Rodando localmente (desenvolvimento)

### 1. Subir containers de dev

```bash
docker-compose up -d --build
```

- `-d` → roda em background
- `--build` → força rebuild das imagens

### 2. Parar containers de dev

```bash
docker-compose down
```

### 3. Atualizar código

```bash
git pull origin main
```

Se houver dependências novas, rebuildar os containers:

```bash
docker-compose build
```

### 4. Ver logs

```bash
docker-compose logs -f
```

### 5. Entrar no container

```bash
docker exec -it <nome_container> sh
```

### 6. Rodar seeds no banco

```bash
docker-compose exec api python -m app.seed
```

---

## Rodando em produção

### 1. Usar arquivo de produção separado

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

- Mantém dev e produção separados
- Rebuilda as imagens e sobe os containers em background

### 2. Atualizar produção

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

- Se houver imagens em um registry, pode usar:

```bash
docker-compose -f docker-compose.prod.yml pull
```

### 3. Volumes

- Não apagar volumes de dev a menos que queira resetar banco ou arquivos
- Use volumes separados para produção para persistir dados

### 4. Logs e debug

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

```bash
docker exec -it <nome_container> sh
```

### 5. Rodar seeds em produção

```bash
docker-compose -f docker-compose.prod.yml exec api python -m app.seed
```

---

### Resumo rápido

| Cenário            | Comando                                                                 |
| ------------------ | ----------------------------------------------------------------------- |
| Subir dev          | `docker-compose up -d --build`                                          |
| Parar dev          | `docker-compose down`                                                   |
| Atualizar dev      | `git pull` + `docker-compose build`                                     |
| Subir produção     | `docker-compose -f docker-compose.prod.yml up -d --build`               |
| Logs produção      | `docker-compose -f docker-compose.prod.yml logs -f`                     |
| Entrar container   | `docker exec -it <nome_container> sh`                                   |
| Rodar seeds (dev)  | `docker-compose exec api python -m app.seed`                            |
| Rodar seeds (prod) | `docker-compose -f docker-compose.prod.yml exec api python -m app.seed` |
