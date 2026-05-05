# AppMedicamentos

Proyecto de app movil para gestion y seguimiento de medicamentos.

## Estructura actual

```txt
/AppMedicamentos
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── models/
│       ├── services/
│       └── config/
└── docs/
```

## Frontend (React Native)

Desde la raiz del proyecto:

```sh
npm install
npm run android
```

## Backend (Node + Express)

Desde la carpeta `backend`:

```sh
npm install
npm run dev
```

Endpoint base de prueba:

- `GET /`
- `GET /api/v1/health`
