# Guia de Prevenção de Spam - Emails do Supabase

## ✅ Correções aplicadas no template

- ❌ Removidos emojis excessivos (🎉, 📧, ⚠️, 💡)
- ❌ Suavizada linguagem de urgência ("expira" → "válido por")
- ❌ Removidas palavras gatilho de spam

## 🔧 Configurações CRÍTICAS no Supabase

### 1. Autenticação de Email (MAIS IMPORTANTE)

No painel do Supabase, vá em **Project Settings** → **Auth** → **SMTP Settings**:

#### Opção A: Usar SMTP Customizado (RECOMENDADO)
Configure seu próprio servidor SMTP com domínio verificado:
- **SendGrid** (Gratuito até 100 emails/dia)
- **AWS SES** (Muito barato)
- **Mailgun**
- **Postmark**

Passos:
1. Crie conta no provedor escolhido
2. Verifique seu domínio (SPF, DKIM, DMARC)
3. Configure as credenciais SMTP no Supabase
4. Teste o envio

#### Opção B: Email Supabase com domínio customizado
Configure um domínio de envio personalizado ao invés de usar `noreply@mail.app.supabase.io`

### 2. Configure SPF, DKIM e DMARC no DNS

No seu provedor de DNS (ex: Cloudflare, GoDaddy), adicione:

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.supabase.co ~all
```

Se usar SMTP customizado, ajuste conforme o provedor.

#### DKIM Record
Fornecido pelo seu provedor SMTP. Exemplo SendGrid:
```
Type: CNAME
Name: s1._domainkey
Value: s1.domainkey.u12345.wl.sendgrid.net
```

#### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@seudominio.com
```

### 3. Email "From" personalizado

No Supabase Auth Settings, configure:
- **From Email:** `noreply@seudominio.com` (NÃO use `@mail.app.supabase.io`)
- **From Name:** `Valorize`

### 4. Reputação do domínio

- ✅ Comece enviando poucos emails por dia
- ✅ Aumente gradualmente o volume
- ✅ Monitore taxa de bounces e reclamações
- ❌ NÃO envie email em massa de uma vez

## 📊 Como verificar se está configurado

### Teste SPF/DKIM/DMARC
Use: https://mxtoolbox.com/SuperTool.aspx

Digite seu domínio e verifique:
- SPF Lookup ✅
- DKIM Lookup ✅
- DMARC Lookup ✅

### Teste de Spam Score
Envie um email de teste para: https://www.mail-tester.com/

Você receberá uma pontuação de 0-10. Meta: **8+**

## 🎯 Checklist de Configuração

- [ ] SMTP customizado configurado OU domínio Supabase customizado
- [ ] SPF record adicionado ao DNS
- [ ] DKIM record adicionado ao DNS
- [ ] DMARC record adicionado ao DNS
- [ ] Email "From" usando seu domínio
- [ ] Testado no mail-tester.com (score 8+)
- [ ] Templates sem emojis excessivos
- [ ] Templates sem palavras de urgência
- [ ] Domínio aquecido (começar com poucos emails)

## 🚨 Problemas Comuns

### Email vai para spam mesmo com tudo configurado?

1. **Domínio novo:** Leva tempo para construir reputação
   - Solução: Envie emails gradualmente, comece com 10-50/dia

2. **IP compartilhado com má reputação:** Supabase usa IPs compartilhados
   - Solução: Use SMTP próprio com IP dedicado

3. **Usuários marcando como spam:** Afeta toda reputação
   - Solução: Envie apenas para quem pediu, facilite unsubscribe

4. **Conteúdo ainda problemático:**
   - Evite: GRÁTIS, GANHE, URGENTE, !!!!, CAPSLOCK
   - Evite: Muitos links, imagens muito grandes
   - Mantenha: Ratio texto/imagem balanceado

5. **Links suspeitos:**
   - Use links diretos, não encurtadores
   - Use HTTPS sempre
   - Certifique-se que domínio dos links está alinhado

## 📈 Monitoramento

Configure alerts para:
- Taxa de bounces > 5%
- Taxa de spam > 0.1%
- Taxa de abertura < 20%

## 🔗 Links Úteis

- [Supabase SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp)
- [Gmail Bulk Sender Guidelines](https://support.google.com/mail/answer/81126)
- [SPF/DKIM/DMARC Checker](https://mxtoolbox.com/)
- [Email Spam Test](https://www.mail-tester.com/)
- [SendGrid Setup Guide](https://sendgrid.com/docs/ui/account-and-settings/spf-records/)

## ⚡ Quick Win

Se você precisa de uma solução rápida AGORA:

1. Crie conta no **SendGrid** (grátis)
2. Verifique seu domínio (15min)
3. Configure SMTP no Supabase (5min)
4. Templates já estão otimizados ✅

Isso deve resolver 90% dos problemas de spam!
