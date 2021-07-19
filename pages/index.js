import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'

function ProfileSidebar(props) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}} />
      
      <hr />
      
      <p>
        <a className='boxLink' href={`https://github.com/${props.githubUser}`} target='_blank'>
          @{props.githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  // console.log(props)
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {props.title} ({props.itens.length})
      </h2>

      <ul>
        {props.itens.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={`/${props.slug}/${itemAtual.id}`} target='_blank'>
                <img src={itemAtual.imageUrl} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
            
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  
  const githubUser = 'danielfarah54'

  const [comunidades,setComunidades] = React.useState([])
  
  const pessoasFavoritas = [
    {
      id: 0,
      title: 'juunegreiros',
      imageUrl: 'https://github.com/juunegreiros.png',
      link: 'https://github.com/juunegreiros'
    },
    {
      id: 1,
      title: 'omariosouto',
      imageUrl: 'https://github.com/omariosouto.png',
      link: 'https://github.com/omariosouto'
    },
    {
      id: 2,
      title: 'peas',
      imageUrl: 'https://github.com/peas.png',
      link: 'https://github.com/peas'
    },
    {
      id: 3,
      title: 'rafaballerini',
      imageUrl: 'https://github.com/rafaballerini.png',
      link: 'https://github.com/rafaballerini'
    },
    {
      id: 4,
      title: 'marcobrunodev',
      imageUrl: 'https://github.com/marcobrunodev.png',
      link: 'https://github.com/marcobrunodev'
    },
    {
      id: 5,
      title: 'felipefialho',
      imageUrl: 'https://github.com/felipefialho.png',
      link: 'https://github.com/felipefialho'
    }
  ]

  const [seguidores, setSeguidores] = React.useState([])
  React.useEffect(() => {
    // API github
    fetch('https://api.github.com/users/peas/followers')
    .then((respostaDoServidor) => {
      return respostaDoServidor.json()
    })
    .then((respostaConvertida) => {
      setSeguidores(respostaConvertida)
    })

    // API graphQL
    fetch('https://graphql.datocms.com/', {
      method: 'post',
      headers: {
        'Authorization': '14e590639a6c3f17c06021996e5904',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          imageUrl
          link
          creatorSlug
        }
      
        _allCommunitiesMeta {
          count
        }
      }`})
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities
      console.log(comunidadesVindasDoDato)

      setComunidades(comunidadesVindasDoDato)
    })
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      
      <MainGrid>
        <div className='profileArea' style= {{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className='welcomeArea' style= {{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className='title'>
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className='subTitle'>O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault()
              const dadosDoForm = new FormData(e.target)
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                link: dadosDoForm.get('link'),
                creatorSlug: githubUser
              }

              fetch('/api/comunidades', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json()
                // console.log(dados)
                const comunidade = dados.registroCriado
                const comunidadesAtualizadas = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizadas)
              })
            }}>
              <div>
                <input
                  placeholder='Qual vai ser o nome da sua comunidade?'
                  name='title'
                  aria-label='Qual vai ser o nome da sua comunidade?'
                  type='text'
                />
              </div>
              <div>
                <input
                  placeholder='Coloque uma url para usarmos de capa'
                  name='image'
                  aria-label='Coloque uma url para usarmos de capa'
                  type='text'
                />
              </div>
              <div>
                <inputkey
                  placeholder='Qual o link da sua comunidade?'
                  name='link'
                  aria-label='Qual o link da sua comunidade?'
                  type='text'
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className='profileRelationsArea' style= {{ gridArea: 'profileRelationsArea' }}>

          <ProfileRelationsBox title='Seguidores' itens={seguidores} slug='seguidores' />
          <ProfileRelationsBox title='Comunidades' itens={Object.values(comunidades)} slug='comunidades' />
          <ProfileRelationsBox title='Pessoas da comunidade' itens={pessoasFavoritas} slug='pessoasFavoritas' />

        </div>
      </MainGrid>
    </>
  )
}
