# 🔒 Guida Implementazione Security Fixes

## ✅ Mitigazioni completate e committate

### 1. **Input Validation con Zod** ✓
- File: `src/lib/validators.ts`
- Implementato per:
  - BookingForm (telefono, date, note)
  - ReviewForm (rating 1-5, commenti)
  - VehicleForm (marca, modello, targa, coordinate)

### 2. **XSS Prevention** ✓
- **notify-booking/index.ts**: Escape Markdown characters in Telegram messages
- **telegram-webhook/index.ts**: Escape HTML entities in email templates
- **Data hiding**: Telefoni nascosti da Telegram (mostra "[RISERVATO]")

### 3. **Authorization Checks** ✓
- cancelBooking(): Verifica che cliente cancelli solo le proprie prenotazioni
- Validazione server-side delle autorizzazioni

---

## 🚨 AZIONE URGENTE: Implementare RLS Policies

### Perché è critico?
**Senza RLS**, chiunque conosca la tua chiave anonima di Supabase può leggere:
- Tutte le prenotazioni di tutti gli utenti
- Numeri di telefono
- Nomi e email

### Come implementarle:

#### **Step 1: Accedi a Supabase Dashboard**
1. Vai su https://app.supabase.com
2. Seleziona il tuo progetto "anirental"
3. Clicca su "SQL Editor" (nel menu sinistro)

#### **Step 2: Copia e incolla le RLS Policies**
1. Clicca su "New Query"
2. Apri il file: `supabase/rls-policies.sql` dal repository
3. Copia TUTTO il contenuto SQL
4. Incollalo nell'editor Supabase
5. Clicca "Run" (triangolo verde in alto a destra)

#### **Step 3: Verifica RLS sia abilitato**
```sql
-- Esegui questa query per verificare che RLS è attivo:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Dovrebbe mostrare TRUE per tutte le tabelle critiche:
-- profiles, vehicles, bookings, reviews, available_dates, notifications_log
```

#### **Step 4: Testa che funziona**
```sql
-- Prova ad accedere come anon user (dovrebbe fallire o ritornare 0 record):
-- SELECT * FROM bookings; -- Questa query dovrebbe ritornare 0 record per un utente random
```

---

## 📋 Checklist di verifica

- [ ] RLS policies applicate al database
- [ ] Nessun errore durante l'esecuzione dello SQL
- [ ] Test: Un utente non può vedere le prenotazioni di altri
- [ ] Test: Un admin può vedere tutte le prenotazioni
- [ ] Test: BookingForm accetta solo numeri di telefono validi
- [ ] Test: ReviewForm accetta solo rating 1-5
- [ ] Test: VehicleForm valida brand/modello/targa

---

## 🔄 Passo successivo: Deploy

Una volta applicate le RLS policies, il progetto è pronto per production:

1. ✅ Validazione input (DONE)
2. ✅ XSS prevention (DONE)
3. ⏳ **RLS policies (PENDING - tu deve farlo su Supabase)**
4. ⏳ Rate limiting (opzionale, ma raccomandato)
5. ⏳ CSRF tokens (già in Next.js, non serve fare nulla)

---

## 📚 Risorse

- [Guida RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Zod Docs](https://zod.dev/)
- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)

---

## ❓ Problemi comuni

**Errore: "function auth.uid() does not exist"**
- Soluzione: Assicurati che il ruolo ha accesso a `auth.uid()`. Esegui:
  ```sql
  GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
  ```

**RLS policy non sembra funzionare**
- Verifica che RLS sia abilitato: `ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;`
- Verifica che il policy ha la giusta sintassi

**Posso testare localmente?**
- Sì! Se usi `supabase start`, le RLS policies saranno abilitate automaticamente on local db
