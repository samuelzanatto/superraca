import { NextResponse } from 'next/server';

// Revalidar a cada 60 segundos - isso funciona magicamente na Vercel (ISR)
// Protege a sua aplicação de ser punida/bloqueada pelo YouTube por excesso de requisições.
// 1000 usuários acessando o site ao mesmo tempo = apenas 1 requisição feita ao YouTube por minuto.
export const revalidate = 60;

export async function GET() {
    try {
        const channelUrl = 'https://www.youtube.com/@projetosuperraca/live';
        
        // Fazer a requisição disfarçada como um navegador normal para evitar bloqueios de robôs do YouTube
        const response = await fetch(channelUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            },
            next: { revalidate: 60 } // Dupla segurança de cache no fetch do Next.js
        });

        if (!response.ok) {
            throw new Error(`YouTube retornou status ${response.status}`);
        }

        const html = await response.text();

        // O segredo do scraping sem API Key no YouTube:
        // Quando a URL ".../live" resolve e o canal está ao vivo, o YouTube entrega a página do "Player" (Watch).
        // A página do Player de uma live sempre tem a propriedade interna "isLiveNow":true injetada no script de dados iniciais.
        // Se o canal NÃO estiver ao vivo, a URL resolve para a página inicial do canal, que não contém essa string.
        const isLive = html.includes('"isLiveNow":true');

        // Tenta capturar a URL canônica ("watch?v=...") para que o botão mande o usuário direto para o vídeo e não para o canal geral.
        let liveUrl = channelUrl;
        if (isLive) {
            const canonicalMatch = html.match(/<link rel="canonical" href="(https:\/\/www\.youtube\.com\/watch\?v=[^"]+)"/);
            if (canonicalMatch && canonicalMatch[1]) {
                liveUrl = canonicalMatch[1];
            }
        }

        return NextResponse.json({
            isLive,
            url: liveUrl,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro ao verificar YouTube Live:', error);
        
        // Em caso de erro interno, retornamos offline suavemente para não quebrar a Header do site principal.
        return NextResponse.json({
            isLive: false,
            url: 'https://www.youtube.com/@projetosuperraca',
            error: String(error)
        }, { status: 200 }); 
    }
}
