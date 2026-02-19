const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://exrjtepqvwwdldjpkehx.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cmp0ZXBxdnd3ZGxkanBrZWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ4MDM5MCwiZXhwIjoyMDg3MDU2MzkwfQ.L1dPPfiyYuonEBKH0WEqJdcJDzRfXvjjPtu_SeXG2GU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🔧 Lendo arquivo SQL...')
    const sqlContent = fs.readFileSync(path.join(__dirname, 'SETUP-SUPABASE-AGORA.sql'), 'utf8')

    console.log('📤 Executando SQL no Supabase...')
    console.log('⚠️  Isso pode levar ~30 segundos...\n')

    // Executar SQL via RPC (Supabase REST API não suporta SQL direto)
    // Vamos usar PostgreSQL connection via fetch
    const response = await fetch('https://exrjtepqvwwdldjpkehx.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sql: sqlContent })
    })

    if (!response.ok) {
      // Se não tiver RPC, vamos executar statement por statement
      console.log('⚠️  API RPC não disponível, tentando executar por partes...\n')

      // Separar SQL em statements
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      console.log(`📝 Executando ${statements.length} statements SQL...\n`)

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        if (statement.includes('CREATE TABLE') || statement.includes('CREATE INDEX') || statement.includes('CREATE EXTENSION')) {
          console.log(`[${i+1}/${statements.length}] ${statement.substring(0, 60)}...`)
        }
      }

      console.log('\n❌ Não foi possível executar SQL automaticamente via API.')
      console.log('📋 Por favor, execute manualmente no Supabase SQL Editor:')
      console.log('   https://supabase.com/dashboard/project/exrjtepqvwwdldjpkehx/sql/new')
      return
    }

    console.log('✅ SQL executado com sucesso!')

    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando tabelas criadas...')
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name')

    if (error) {
      console.log('❌ Erro ao verificar tabelas:', error.message)
    } else {
      console.log('✅ Tabelas encontradas:')
      tables.forEach(t => console.log(`   - ${t.table_name}`))
    }

  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message)
    console.log('\n📋 Execute manualmente no Supabase SQL Editor:')
    console.log('   https://supabase.com/dashboard/project/exrjtepqvwwdldjpkehx/sql/new')
  }
}

setupDatabase()
