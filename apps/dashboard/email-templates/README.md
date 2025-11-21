# Templates de Email - Supabase

Este diretório contém os templates de email personalizados para uso no Supabase.

## 📋 Templates Disponíveis

### 1. Confirmação de Cadastro (`confirm-signup.html`)

### 2. Convite de Usuário (`invite-user.html`)

### 3. Redefinição de Senha (`reset-password.html`)

## 🎨 Como usar no Painel do Supabase

1. Acesse o **Painel do Supabase** → [https://app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Navegue até **Authentication** → **Email Templates**
4. Selecione o template desejado:
   - **Confirm signup** → use `confirm-signup.html`
   - **Invite user** → use `invite-user.html`
   - **Reset Password** → use `reset-password.html`
5. Copie o conteúdo do arquivo HTML correspondente
6. Cole no campo de template do Supabase
7. Clique em **Save**

### Variáveis Disponíveis

O Supabase fornece as seguintes variáveis que podem ser usadas no template:

| Variável | Descrição |
|----------|-----------|
| `{{ .ConfirmationURL }}` | URL completa para confirmação do email |
| `{{ .Token }}` | Token de confirmação (caso precise usar separadamente) |
| `{{ .TokenHash }}` | Hash do token |
| `{{ .SiteURL }}` | URL base do seu site/aplicação |
| `{{ .Email }}` | Email do usuário |

### Customizações

#### Alterando Cores

As cores principais do template são:

- **Primária (Verde)**: `#00D959`
- **Secundária (Rosa/Vermelho)**: `#D9004F`
- **Texto Principal**: `#262626`
- **Texto Secundário**: `#525252`

Para alterar, procure por essas cores no CSS do template e substitua conforme necessário.

#### Alterando o Logo

O template usa o logo oficial do Valorize hospedado no Supabase Storage:

```html
<img src="https://lnjawwzqirnicbdvcnpy.supabase.co/storage/v1/object/public/prize-images/logo1.svg" alt="Valorize" style="max-width: 180px; height: auto; display: block;">
```

O header tem fundo branco com uma borda inferior verde para garantir bom contraste com o logo:

```css
.header {
    background-color: #ffffff;
    padding: 40px 30px;
    text-align: center;
    border-bottom: 3px solid #00D959;
}
```

Para usar outro logo:

1. Hospede sua logo em um CDN ou servidor público
2. Substitua a URL pela URL do seu logo
3. Ajuste o `max-width` conforme necessário
4. Se necessário, ajuste a cor de fundo do header para melhor contraste

#### Personalizando Mensagens

Edite o texto HTML diretamente no template para adequar à sua comunicação:

- Altere saudações
- Ajuste textos de instruções
- Modifique avisos de segurança

### Diferenças entre os Templates

#### Confirm Signup

- Usado quando um novo usuário se registra
- Mensagem de boas-vindas
- Foco na confirmação de email

#### Invite User

- Usado quando um usuário é convidado por um administrador
- Destaca que é um convite especial
- Mostra os benefícios da plataforma
- Lista de funcionalidades incluída

#### Reset Password

- Usado quando o usuário solicita redefinição de senha
- Avisos de segurança mais evidentes
- Dicas para criar senhas fortes
- Tempo de expiração mais curto (1 hora)

### Outros Templates que você pode criar

Você pode criar templates similares para:

- **Magic Link** (`magic-link.html`)
- **Change Email Address** (`change-email.html`)

Use os templates existentes como base e ajuste as mensagens conforme necessário.

## 🚨 Prevenção de Spam

**IMPORTANTE:** Se seus emails estão caindo em spam, consulte o [Guia de Prevenção de Spam](SPAM-PREVENTION.md).

Os templates já foram otimizados para reduzir spam score:
- ✅ Sem emojis excessivos
- ✅ Linguagem não-urgente
- ✅ Formato compatível com clientes de email
- ✅ Checkmarks inline (não pseudo-elementos)

**Mas você PRECISA configurar:**
- SPF, DKIM e DMARC no DNS
- SMTP customizado (SendGrid, AWS SES, etc.)
- Domínio de envio personalizado

Leia o [SPAM-PREVENTION.md](SPAM-PREVENTION.md) para instruções completas.

## 🧪 Testando os Templates

1. No Supabase, use a função de **Send Test Email** disponível em cada template
2. Verifique a renderização em diferentes clientes de email:
   - Gmail
   - Outlook
   - Apple Mail
   - Yahoo Mail
   - Clientes mobile

## 📱 Responsividade

O template é totalmente responsivo e se adapta a diferentes tamanhos de tela:
- Desktop/Tablet: Layout completo
- Mobile: Layout otimizado com padding reduzido e fontes ajustadas

## 🔒 Segurança

- Links expiram em 24 horas (configurável no Supabase)
- Aviso de segurança incluído no email
- Recomendação para ignorar se não solicitado

## 💡 Dicas

1. **Teste sempre** antes de colocar em produção
2. **Verifique spam**: Emails com muitas imagens podem ir para spam
3. **Mantenha simples**: Clientes de email têm suporte limitado a CSS/HTML
4. **Use texto alternativo**: Sempre inclua link de texto além do botão
5. **Configure SPF/DKIM**: Para melhor deliverability

## 📞 Suporte

Se tiver dúvidas sobre a implementação, consulte:
- [Documentação do Supabase Auth](https://supabase.com/docs/guides/auth)
- [Customizando Email Templates](https://supabase.com/docs/guides/auth/auth-smtp)
