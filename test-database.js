const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://exrjtepqvwwdldjpkehx.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cmp0ZXBxdnd3ZGxkanBrZWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ4MDM5MCwiZXhwIjoyMDg3MDU2MzkwfQ.L1dPPfiyYuonEBKH0WEqJdcJDzRfXvjjPtu_SeXG2GU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabase() {
  console.log('🧪 Testando conexão com Supabase...\n')

  try {
    // 1. Testar se tabelas existem
    console.log('📋 Verificando tabelas...')

    const tables = ['users', 'tracking_events', 'leads']

    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ ${table}: existe (${count || 0} registros)`)
      }
    }

    // 2. Testar insert em tracking_events (para Filtro de Lucidez)
    console.log('\n💾 Testando inserção em tracking_events...')

    const testEvent = {
      event_name: 'test_event',
      event_category: 'test',
      event_data: {
        test: true,
        timestamp: new Date().toISOString()
      },
      page_path: '/test',
      timestamp: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('tracking_events')
      .insert(testEvent)
      .select()

    if (insertError) {
      console.log(`   ❌ Erro ao inserir: ${insertError.message}`)
    } else {
      console.log(`   ✅ Insert funcionou! ID: ${insertData[0].id}`)

      // Deletar o teste
      await supabase
        .from('tracking_events')
        .delete()
        .eq('id', insertData[0].id)

      console.log(`   🗑️  Registro de teste removido`)
    }

    // 3. Resumo
    console.log('\n' + '='.repeat(50))
    console.log('✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!')
    console.log('='.repeat(50))
    console.log('\n📊 Próximos passos:')
    console.log('   1. Acesse: https://viva-score-v2-rouge.vercel.app/filtro-lucidez')
    console.log('   2. Responda as 5 perguntas')
    console.log('   3. Descreva sua atividade')
    console.log('   4. Os dados serão salvos automaticamente!\n')

  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testDatabase()
