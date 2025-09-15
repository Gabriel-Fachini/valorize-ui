import { useState } from 'react'
import { Input, EmailInput, PasswordInput } from '@components/ui/Input'

/**
 * PlaygroundPage - Wrapper simples para testar componentes
 * 
 * Edite este arquivo diretamente para testar seus componentes.
 * Apenas uma página wrapper onde você escolhe o que testar.
 */
const PlaygroundPage = () => {
  const [inputValue, setInputValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [showErrors, setShowErrors] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎮 Playground
          </h1>
          <p className="text-gray-700">
            Edite este arquivo para testar seus componentes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
          {/* 
            Edite aqui para testar seus componentes
            Descomente/comente as seções que quiser testar
          */}
          
          {/* Toggle para mostrar/ocultar erros */}
          <div className="mb-8">
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showErrors ? '🔴 Ocultar Erros' : '✅ Mostrar Erros'}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Clique para testar as animações de erro nos inputs
            </p>
          </div>
          
          <div className="space-y-10">
            {/* Input Component */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">Input</h2>
              <div className="space-y-4">
                <Input
                  name="test-input"
                  label="Test Input"
                  placeholder="Digite algo..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  error={showErrors ? 'Este campo é obrigatório' : undefined}
                  helperText={!showErrors ? 'Digite qualquer texto aqui' : undefined}
                />
                <Input
                  name="test-input-2"
                  label="Input com Validação"
                  placeholder="Digite um email válido..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  error={showErrors ? 'Formato de email inválido' : undefined}
                  required
                />
              </div>
            </section>

            {/* EmailInput Component */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">EmailInput</h2>
              <div className="space-y-4">
                <EmailInput
                  name="test-email"
                  label="Test Email"
                  placeholder="seu@email.com"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  error={showErrors ? 'Email inválido ou já está em uso' : undefined}
                  helperText={!showErrors ? 'Digite seu melhor email' : undefined}
                />
              </div>
            </section>

            {/* PasswordInput Component */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">PasswordInput</h2>
              <div className="space-y-4">
                <PasswordInput
                  name="test-password"
                  label="Test Password"
                  placeholder="Digite sua senha"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  error={showErrors ? 'A senha deve ter pelo menos 8 caracteres' : undefined}
                  helperText={!showErrors ? 'Use uma senha forte com letras, números e símbolos' : undefined}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundPage
