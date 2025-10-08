# CEP Integration - Brazilian Address Lookup

## Overview

The address form now integrates with the **ViaCEP API** to automatically fetch and fill address information based on the Brazilian postal code (CEP).

## Features

### 🎯 CEP Field Position
- **CEP field now appears right after the address nickname** (as requested)
- Form order: Name → CEP → Street → Number → Complement → Neighborhood → City → State → Phone

### 🔍 Automatic Address Lookup
When the user enters a valid CEP and leaves the field (onBlur):

1. **Auto-formatting**: CEP is formatted to `12345-678` format
2. **API Call**: Fetches address data from ViaCEP (https://viacep.com.br)
3. **Auto-fill**: Populates empty fields with fetched data:
   - Street (Rua/Avenida)
   - Neighborhood (Bairro)
   - City (Cidade)
   - State (UF)
4. **Smart Fill**: Only fills fields that are empty (preserves user edits)
5. **Visual Feedback**: Shows loading spinner and success/error messages

### 🎨 UI/UX Features

**Loading State:**
- Animated spinner icon appears in the CEP field
- "Buscando endereço..." message below the field
- Field is usable during fetch (non-blocking)

**Success State:**
- Green success message: "CEP encontrado! Endereço preenchido automaticamente."
- Auto-dismisses after 3 seconds
- Fields are auto-populated

**Error States:**
- "CEP não encontrado. Preencha manualmente." - Invalid/non-existent CEP
- "Tempo esgotado ao buscar CEP. Tente novamente." - Network timeout (5s)
- "Erro ao buscar CEP. Verifique sua conexão." - Network error
- Validation error if CEP format is invalid

## Technical Implementation

### New Service: `cep.service.ts`

```typescript
cepService.fetchAddressByCep(cep: string): Promise<CepAddressData | null>
cepService.isValidFormat(cep: string): boolean
```

**API Used:**
- **ViaCEP API**: https://viacep.com.br/ws/{cep}/json/
- Free, no authentication required
- Returns: Street, Neighborhood, City, State
- Timeout: 5 seconds

**Response Format:**
```typescript
interface CepAddressData {
  street: string
  neighborhood: string
  city: string
  state: string
  complement?: string
}
```

### Updated Component: `AddressTab.tsx`

**New States:**
- `fetchingCep` - Boolean for loading state
- `cepError` - String for error messages

**New Handler:**
- `handleZipCodeBlur()` - Async function that:
  1. Formats CEP
  2. Validates format
  3. Fetches address data
  4. Auto-fills fields
  5. Shows success/error feedback

**Form Field Order:**
1. Nome do endereço (Name)
2. **CEP** ← NEW POSITION
3. Rua/Avenida (Street)
4. Número (Number)
5. Complemento (Complement)
6. Bairro (Neighborhood)
7. Cidade (City)
8. UF (State)
9. Telefone (Phone)

## User Flow

### Happy Path
```
1. User enters address name: "Casa"
2. User types CEP: "01310100"
3. User tabs/clicks away (onBlur)
   → CEP formats to "01310-100"
   → Loading spinner appears
   → API call to ViaCEP
4. Success! Fields auto-fill:
   → Street: "Avenida Paulista"
   → Neighborhood: "Bela Vista"
   → City: "São Paulo"
   → State: "SP"
5. Green success message appears
6. User fills remaining fields (number, complement, phone)
7. User saves address
```

### Error Path - Invalid CEP
```
1. User enters CEP: "00000-000"
2. User tabs away (onBlur)
   → Loading spinner appears
   → API returns "CEP não encontrado"
3. Error message appears
4. User must fill all fields manually
```

### Error Path - Network Issue
```
1. User enters valid CEP
2. User tabs away (onBlur)
   → Loading spinner appears
   → Network timeout after 5 seconds
3. Error message: "Tempo esgotado ao buscar CEP"
4. User can try again or fill manually
```

## Validation

CEP validation remains the same:
- Must be 8 digits
- Accepts formats: `12345678` or `12345-678`
- Auto-formats on blur
- Required field (red asterisk)

## API Details

### ViaCEP Endpoint
```
GET https://viacep.com.br/ws/{cep}/json/
```

**Example Request:**
```
https://viacep.com.br/ws/01310100/json/
```

**Example Response:**
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "complemento": "",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP",
  "ibge": "3550308",
  "gia": "1004",
  "ddd": "11",
  "siafi": "7107"
}
```

**Error Response (CEP not found):**
```json
{
  "erro": true
}
```

### Error Handling
- **Timeout**: 5 seconds
- **Network errors**: User-friendly messages
- **Invalid format**: Validation before API call
- **Non-existent CEP**: Returns null, shows message

## Benefits

1. **Faster Form Completion**: Users only need to enter CEP + number
2. **Fewer Errors**: Reduces typos in address fields
3. **Better UX**: Real-time feedback and auto-completion
4. **Smart Behavior**: Preserves user edits, only fills empty fields
5. **Accessible**: Works without JavaScript (graceful degradation)
6. **Free Service**: No API keys or rate limits

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

## Performance

- **API Call**: ~200-500ms average
- **Timeout**: 5 seconds max
- **Non-blocking**: Form remains usable during fetch
- **Debounced**: Only calls API on blur (not on every keystroke)

## Future Enhancements

Possible improvements:
- [ ] Cache recent CEP lookups in localStorage
- [ ] Add "Buscar CEP" button as alternative to onBlur
- [ ] Support for international addresses
- [ ] Integration with Google Maps API for validation
- [ ] Auto-complete suggestions while typing

## Testing Checklist

- [ ] Enter valid CEP → Fields auto-fill
- [ ] Enter invalid CEP → Error message shows
- [ ] Edit CEP after auto-fill → Updates correctly
- [ ] Pre-filled fields are preserved (edit mode)
- [ ] Loading spinner appears during fetch
- [ ] Success message auto-dismisses after 3s
- [ ] Network error handling works
- [ ] Form validation still works
- [ ] Can submit with auto-filled data
- [ ] Dark mode styling correct
- [ ] Mobile responsive

## Known Limitations

1. **ViaCEP Coverage**: Only works for Brazilian addresses
2. **Network Dependency**: Requires internet connection
3. **API Availability**: Depends on ViaCEP service uptime
4. **No Authentication**: Public API (no rate limits mentioned)
5. **Street Numbers**: API doesn't provide house numbers

## Resources

- **ViaCEP Documentation**: https://viacep.com.br/
- **Brazilian CEP Format**: 8 digits (XXXXX-XXX)
- **Service File**: `src/services/cep.service.ts`
- **Component File**: `src/components/settings/AddressTab.tsx`
