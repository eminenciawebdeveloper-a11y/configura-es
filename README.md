# Abrir Configurações (Next.js)

Site com botão que tenta abrir as configurações do Android através de intents do Chrome.

## Correr localmente
```bash
npm install
npm run dev
```
Abre http://localhost:3000. Para testar no telemóvel, usa o URL da Vercel (HTTPS) no Chrome Android.

## Publicar
1. `git init && git add . && git commit -m "primeiro commit"`
2. Cria o repositório no GitHub e faz `git push`
3. Na Vercel: Add New > Project > importa o repositório > Deploy (sem configuração extra)

## Limitação importante
O Android decide se aceita o intent. Em alguns telemóveis/navegadores o atalho é bloqueado; nesse caso o site mostra instruções manuais.
