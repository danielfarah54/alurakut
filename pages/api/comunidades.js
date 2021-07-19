import { SiteClient } from 'datocms-client'

export default async function recebedorDeRequests(req, res) {

    if(req.method === 'POST') {
        const TOKEN = '8b6d5db8bcf1e208d68b0b67351edf'
        const client = new SiteClient(TOKEN)

        const registroCriado = await client.items.create({
            itemType: '977298',
            ...req.body,
            // title: 'Comunidade de Teste',
            // imageUrl: 'https://placehold.it/200x300',
            // link:'https://placehold.it/200x300',
            // creatorSlug: 'danielfarah54'
        })

        res.json({
            dados: 'Alguma dado qualquer',
            registroCriado: registroCriado
        })
        return
    }

    res.status(404).json({
        message: 'Nada no GET, tente o POST'
    })

}