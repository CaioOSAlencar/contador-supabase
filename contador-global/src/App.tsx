import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lhghwzcggaqantelbjyh.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [clicks, setClicks] = useState(0)
  const [loading, setLoading] = useState(false)

  // Carrega o valor inicial e escuta mudanças em tempo real
  useEffect(() => {
    // Pega o valor atual
    supabase
      .from('global_clicks')
      .select('total')
      .eq('id', 1)
      .single()
      .then(({ data }: { data: any }) => setClicks(data?.total || 0))

    // Realtime: toda vez que alguém clicar, atualiza para TODOS
    const channel = supabase
      .channel('global_clicks_channel')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'global_clicks'
      }, (payload: any) => {
        setClicks(payload.new.total)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleClick = async () => {
    if (loading) return
    setLoading(true)

    // Pega o valor atual e soma +1
    const { data } = await supabase
      .from('global_clicks')
      .select('total')
      .eq('id', 1)
      .single()

    if (data) {
      await supabase
        .from('global_clicks')
        .update({ total: data.total + 1 })
        .eq('id', 1)
    }

    setLoading(false)
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '15vh', fontFamily: 'Arial, sans-serif' }}>
      <h1>Contador Global de Cliques</h1>
      <h2 style={{ fontSize: '4rem', margin: '2rem' }}>
        {clicks.toLocaleString('pt-BR')}
      </h2>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          fontSize: '2rem',
          padding: '1rem 3rem',
          background: loading ? '#ccc' : '#0066ff',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registrando...' : 'CLIQUE AQUI!'}
      </button>
      <p style={{ marginTop: '2rem', fontSize: '1.2rem' }}>
        Cada clique aumenta o número para todo mundo no planeta em tempo real!
      </p>
    </div>
  )
}

export default App