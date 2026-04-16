# Rapport d'analyse — DelivTrack (React Native + NestJS)

> Généré après lecture complète du code source. Phase 1 terminée.

---

## 1. BACKEND — Endpoints d'authentification

### Base URL
Le backend tourne sur **port 5000** (`backend/src/main.ts`).  
⚠️ **Bug trouvé** : `frontend/src/config/constants.js` déclare `API_URL = 'http://192.168.1.10:3000'` — le port est **3000** alors qu'il devrait être **5000**.

---

### `POST /auth/register/delivery`
**Body attendu :**
```json
{
  "username": "string",
  "email": "string (email valide)",
  "password": "string (min 6 chars)",
  "phone": "string"
}
```
**Réponse succès (201) :**
```json
{ "message": "Delivery user registered successfully", "userId": 42 }
```
**Erreurs possibles :**
- `409 Conflict` — email déjà utilisé
- `400 Bad Request` — username déjà pris

---

### `POST /auth/register/agency`
**Body attendu :**
```json
{
  "username": "string",
  "email": "string (email valide)",
  "password": "string (min 6 chars)",
  "phone": "string"
}
```
**Réponse succès (201) :**
```json
{ "message": "Agency user registered successfully", "userId": 43 }
```

---

### `POST /auth/register/admin`
**Body attendu :**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```
**Header obligatoire :** `x-admin-secret: <ADMIN_SECRET_KEY depuis .env>`  
**Réponse succès (201) :**
```json
{ "message": "Admin user registered successfully", "userId": 1 }
```
**Erreur :** `401 Unauthorized` si secret invalide

---

### `POST /auth/login`
**Body attendu :**
```json
{
  "email": "string",
  "password": "string"
}
```
**Réponse succès (200) :**
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```
> ⚠️ **IMPORTANT** : Le backend ne retourne **PAS** d'objet `user`. Seulement le token JWT.  
> Le rôle et les infos user sont encodés dans le payload JWT :
> ```json
> { "sub": 42, "email": "user@example.com", "role": "agency" }
> ```
> Pour obtenir les infos complètes, il faut appeler `GET /auth/me` après login.

**Erreur :** `401 Unauthorized` si email/password incorrects

---

### `GET /auth/me`
**Header obligatoire :** `Authorization: Bearer <access_token>`  
**Réponse succès (200) :**
```json
{
  "user": {
    "id": 42,
    "username": "express_maroc",
    "email": "contact@expressmaroc.ma",
    "phone": "0612345678",
    "role": "agency",
    "location": null,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  },
  "profileComplete": false,
  "profileCompleteness": 80,
  "missingFields": ["location"],
  "warnings": []
}
```
> Pour un livreur (`delivery`), `user` contient aussi `rate`, `vehicleType`, `docVerification`.

---

## 2. RÔLES DANS LE SYSTÈME

| Rôle | Valeur en BDD | Entité TypeORM | Description |
|------|--------------|----------------|-------------|
| Agence | `"agency"` | `Agency extends User` | Crée des commandes de livraison |
| Livreur | `"delivery"` | `Delivery extends User` | Livre des colis |
| Admin | `"admin"` | `Admin extends User` | Administre la plateforme |

**Architecture BDD :** Table inheritance — une seule table `users` avec colonne discriminante `role`.

### Champs de l'entité `User` (commun à tous)
```
id          : number (PK auto-incrément)
username    : string (UNIQUE)
email       : string (UNIQUE)
password    : string (hashé bcrypt, 10 rounds)
phone       : string
role        : "agency" | "delivery" | "admin"
location    : Location | null (OneToOne eager)
createdAt   : Date
updatedAt   : Date
```

### Champs supplémentaires pour `Delivery`
```
rate            : decimal(5,2) | null
vehicleType     : string | null
docVerification : DocVerification | null (OneToOne eager)
```

### `DocVerification` (statut documents livreur)
```
id          : number
cin         : string (numéro CIN)
cinImage    : string (chemin fichier)
licence     : string (numéro permis)
licenceImage: string (chemin fichier)
status      : "pending" | "approved" | "rejected"
uploadedAt  : Date
verifiedAt  : Date | null
```

---

## 3. CALCUL DE COMPLÉTUDE DU PROFIL

| Rôle | Champ | Points |
|------|-------|--------|
| Delivery (base) | — | 40% |
| Delivery | + location | +20% = 60% |
| Delivery | + rate & vehicleType | +20% = 80% |
| Delivery | + docVerification | +20% = **100%** |
| Agency/Admin (base) | — | 80% |
| Agency/Admin | + location | +20% = **100%** |

---

## 4. FRONTEND — Structure actuelle

### Dépendances installées (package.json)
```json
"@reduxjs/toolkit": "^2.11.2",    ✅ DÉJÀ INSTALLÉ
"react-redux": "^9.2.0",           ✅ DÉJÀ INSTALLÉ
"expo-secure-store": "~55.0.13",   ✅ DÉJÀ INSTALLÉ
"@react-native-async-storage/async-storage": "2.2.0",  ✅
"axios": "^1.13.5",                ✅
"expo-image-picker": "~17.0.10",   ✅
```
> **Aucune installation supplémentaire nécessaire.** Tout ce qu'on va utiliser est déjà là.

---

### Structure des fichiers frontend

```
frontend/
├── App.js                          ← Point d'entrée (AppProvider + NavigationContainer)
├── src/
│   ├── api/
│   │   └── axios.config.js         ← Axios + intercepteur JWT
│   ├── components/
│   │   ├── AddressAutocomplete.jsx
│   │   ├── DrawerMenu.jsx
│   │   ├── NotifCard.jsx
│   │   ├── OrderCard.jsx
│   │   ├── PackageSizeSection.jsx
│   │   ├── ProgressDots.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   └── UrgentSection.jsx
│   ├── config/
│   │   ├── constants.js            ← API_URL, STORAGE_KEYS, constantes agence
│   │   ├── mockData.js             ← Données simulées
│   │   └── theme.js                ← Design tokens (Colors, Spacing, etc.)
│   ├── context/
│   │   └── AppContext.js           ← Context React (orders, notifications)
│   ├── hooks/
│   │   ├── useAddressSearch.js
│   │   ├── useAuth.js              ← Hook auth EXISTANT (non utilisé par LoginScreen)
│   │   ├── useDriverSelection.js
│   │   ├── useNavigation.js
│   │   └── useOrderForm.js
│   ├── navigation/
│   │   ├── AppNavigator.jsx        ← Navigation initiale (check AsyncStorage)
│   │   └── StackNavigator.jsx      ← Toutes les routes empilées
│   ├── screens/
│   │   ├── agence/
│   │   │   ├── CreateOrderScreen.jsx
│   │   │   ├── DashboardScreen.jsx
│   │   │   ├── DriverSelectionScreen.jsx
│   │   │   ├── NavigationScreen.jsx
│   │   │   ├── NotificationsScreen.jsx
│   │   │   └── OrdersListScreen.jsx
│   │   ├── auth/
│   │   │   ├── LoginScreen.jsx     ← MOCK (setTimeout) — pas d'appel API réel
│   │   │   └── RegisterScreen.jsx  ← MOCK (setTimeout) — pas d'appel API réel
│   │   └── livreur/
│   │       ├── DriverProfileScreen.jsx
│   │       ├── HomeScreen.jsx
│   │       ├── KycScreen.jsx
│   │       ├── LivreurWalletScreen.jsx
│   │       └── MesCandidaturesScreen.jsx
│   └── services/
│       ├── auth.service.js         ← Appels API auth (existant, partiellement incorrect)
│       ├── driver.service.js
│       ├── location.service.js
│       ├── navigation.service.js
│       └── order.service.js
```

---

### Navigation actuelle (`StackNavigator.jsx`)

```
Stack.Navigator (headerShown: false, animation: 'fade')
├── "LivreurHome"     → HomeScreen (livreur)       ← 1er écran au démarrage
├── "Login"           → LoginScreen
├── "Register"        → RegisterScreen
├── "AgenceDashboard" → DashboardScreen (agence)
├── "OrdersList"      → OrdersListScreen
├── "CreateOrder"     → CreateOrderScreen
├── "Notifications"   → NotificationsScreen
├── "DriverSelection" → DriverSelectionScreen
├── "Navigation"      → NavigationScreen
├── "DriverProfile"   → DriverProfileScreen
├── "KycVerification" → KycScreen
├── "MesCandidatures" → MesCandidaturesScreen
└── "Wallet"          → LivreurWalletScreen
```

> **Problème actuel** : `LivreurHome` est l'écran initial. Il n'y a aucune vérification du token au démarrage dans `StackNavigator.jsx`. L'`AppNavigator.jsx` existe mais n'est pas utilisé (il est commenté dans App.js).

---

### Écran Login actuel — ce qu'il fait (et ne fait pas)

```javascript
// LoginScreen.jsx — état actuel (MOCK)
const handleLogin = () => {
  setLoading(true);
  setTimeout(() => {              // ← Faux délai, aucun appel API
    setLoading(false);
    if (email.includes('livreur')) {
      navigation.replace('LivreurHome');
    } else {
      navigation.replace('AgenceDashboard');
    }
  }, 1200);
};
```

**Ce qui manque :**
- Appel réel à `POST /auth/login`
- Stockage du token
- Récupération du rôle réel depuis le JWT ou `GET /auth/me`
- Gestion des erreurs API
- State Redux

---

### Écran Register actuel — ce qu'il fait (et ne fait pas)

```javascript
// RegisterScreen.jsx — état actuel (MOCK)
const handleRegister = () => {
  setTimeout(() => {   // ← Faux délai, aucun appel API
    Alert.alert('✅ Compte créé !', ..., navigate to Login);
  }, 1200);
};
```

**Champs du formulaire :** `nom`, `email`, `telephone`, `password`, `role (agence|livreur)`

**Problèmes :**
- `nom` → le backend attend `username`
- `telephone` → le backend attend `phone`
- `role: 'agence'` → route backend : `/auth/register/agency`
- `role: 'livreur'` → route backend : `/auth/register/delivery`
- La route actuelle dans `authService.register` est `/auth/register` qui **n'existe pas** dans le backend

---

### `useAuth.js` — hook existant (non connecté)

```javascript
// Existe mais LoginScreen ne l'utilise pas
const login = async (data, onSuccess) => {
  const response = await authService.login(data);
  await AsyncStorage.setItem('token', response.access_token);
  await AsyncStorage.setItem('user', JSON.stringify(response.user)); // ← BUG: response n'a pas de .user
  onSuccess(response.user.role); // ← BUG: response.user est undefined
};
```

> Le hook lit `response.user` mais le backend retourne seulement `{ access_token }`. Il faudra décoder le JWT ou appeler `GET /auth/me`.

---

### `authService.js` — état actuel

```javascript
login: async (data) => {
  const response = await apiClient.post('/auth/login', data);  // ✅ Route correcte
  return response.data;                                         // retourne { access_token }
},

register: async (data) => {
  const response = await apiClient.post('/auth/register', data); // ❌ Route inexistante !
  return response.data;
},
```

---

## 5. BUGS ET INCOHÉRENCES IDENTIFIÉS

| # | Fichier | Problème | Correction |
|---|---------|----------|------------|
| 1 | `constants.js` | `API_URL` port **3000** mais backend sur **5000** | Changer en `:5000` |
| 2 | `authService.register` | Route `/auth/register` **n'existe pas** | Utiliser `/auth/register/agency` ou `/auth/register/delivery` selon le rôle |
| 3 | `useAuth.js` | Lit `response.user` qui est **undefined** après login | Décoder le JWT ou appeler `GET /auth/me` |
| 4 | `LoginScreen` | **Aucun appel API** — mock avec setTimeout | Connecter au backend réel |
| 5 | `RegisterScreen` | **Aucun appel API** — mock avec setTimeout | Connecter au backend réel |
| 6 | `RegisterScreen` | Champ `nom` → backend attend `username` | Renommer / mapper |
| 7 | `RegisterScreen` | Champ `telephone` → backend attend `phone` | Renommer / mapper |
| 8 | `StackNavigator` | `LivreurHome` comme écran initial — aucune vérif auth | Conditionner selon `isLoggedIn` |

---

## 6. CE QUE REDUX VA RÉSOUDRE

Actuellement, l'état d'authentification est dispersé :
- Le token est dans `AsyncStorage` (non synchronisé avec l'UI)
- Il n'y a pas d'état global `isLoggedIn`
- La navigation ne conditionne pas l'accès selon l'authentification

Redux va centraliser :
```
store.auth = {
  isLoggedIn: false | true,
  user: null | { id, email, username, role, phone, ... },
  token: null | "eyJ...",
  loading: false | true,
  error: null | "message d'erreur"
}
```

---

## 7. RÉPONSE LOGIN — FORMAT EXACT DU BACKEND

```typescript
// auth.service.ts ligne 87
return { access_token: this.jwtService.sign(payload) };
// payload = { sub: user.id, email: user.email, role: user.role }
```

Donc après login, pour connaître le rôle, deux options :
1. **Décoder le JWT côté client** (sans vérification de signature) pour extraire `{ sub, email, role }`
2. **Appeler `GET /auth/me`** immédiatement après login → retourne l'objet `user` complet + completeness

**Recommandation : option 2** (`GET /auth/me`), plus propre et on obtient les données complètes en une seule logique de login.

---

## 8. RÉSUMÉ DES DÉCISIONS POUR LA PHASE 2

- `@reduxjs/toolkit` et `react-redux` : **déjà installés**, pas besoin d'installer quoi que ce soit
- `expo-secure-store` : **déjà installé** — on l'utilisera pour le token (plus sécurisé qu'AsyncStorage)
- Décoder le rôle : via `GET /auth/me` juste après `POST /auth/login`
- Corriger `API_URL` : port 3000 → 5000
- Corriger les routes register : `/auth/register` → `/auth/register/{role}`
- Corriger les champs : `nom` → `username`, `telephone` → `phone`

---

*Fin du rapport — Prêt pour la Phase 2 (plan d'implémentation)*
