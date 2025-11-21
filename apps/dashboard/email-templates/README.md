# Templates de Email - Supabase

Este diretório contém os templates de email personalizados para uso no Supabase.

## 🎨 Template: Confirmação de Cadastro

### Como usar no Painel do Supabase

1. Acesse o **Painel do Supabase** → [https://app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Navegue até **Authentication** → **Email Templates**
4. Selecione **Confirm signup**
5. Copie o conteúdo do arquivo `confirm-signup.html`
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

O template usa o logo oficial do Valorize hospedado em CDN:
```html
<img src="https://www.usevalorize.com.br/logo1.svg" alt="Valorize" style="max-width: 180px; height: auto; display: block;">
```

Para usar outro logo:
1. Hospede sua logo em um CDN ou servidor público
2. Substitua a URL `https://www.usevalorize.com.br/logo1.svg` pela URL do seu logo
3. Ajuste o `max-width` conforme necessário

#### Personalizando Mensagens

Edite o texto HTML diretamente no template para adequar à sua comunicação:
- Altere saudações
- Ajuste textos de instruções
- Modifique avisos de segurança

### Outros Templates

Você pode criar templates similares para:
- **Invite user** (`invite-user.html`)
- **Magic Link** (`magic-link.html`)
- **Change Email Address** (`change-email.html`)
- **Reset Password** (`reset-password.html`)

Use o `confirm-signup.html` como base e ajuste as mensagens conforme necessário.

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
