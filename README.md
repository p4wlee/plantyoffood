# 🌱 Planty of Food (POF) - API Gruppi d'Acquisto

API RESTful per la gestione dei gruppi di acquisto di prodotti plant-based.

## 📋 Indice

- [Descrizione](#descrizione)
- [Tecnologie Utilizzate](#tecnologie-utilizzate)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Struttura del Progetto](#struttura-del-progetto)
- [API Endpoints](#api-endpoints)
- [Esempi di Utilizzo](#esempi-di-utilizzo)

---

## 📖 Descrizione

Planty of Food è un'API per gestire gruppi di acquisto di prodotti plant-based. L'applicazione permette di:

- ✅ Gestire prodotti (CRUD completo)
- ✅ Gestire utenti/anagrafiche (CRUD completo)
- ✅ Gestire ordini di vendita (CRUD completo)
- ✅ Associare prodotti e utenti agli ordini
- ✅ Filtrare ordini per data e prodotto

---

## 🛠️ Tecnologie Utilizzate

- **Node.js** - Runtime JavaScript
- **Express** (v5.2.1) - Framework web
- **MySQL2** (v3.16.1) - Driver MySQL con supporto Promise
- **dotenv** (v17.2.3) - Gestione variabili d'ambiente
- **Nodemon** (v3.1.11) - Auto-restart durante lo sviluppo

---

## 🚀 Installazione

### Prerequisiti

- Node.js (v14 o superiore)
- MySQL (v5.7 o superiore)
- npm o yarn

### Passi

1. **Clona il repository**

   ```bash
   git clone https://github.com/tuousername/plantyoffood.git
   cd plantyoffood
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura il database**

   Crea il database eseguendo il file `migrations.sql`:

   ```bash
   mysql -u root -p < migrations.sql
   ```

   Oppure importalo manualmente da MySQL Workbench o phpMyAdmin.

4. **Configura le variabili d'ambiente**

   Copia il file `.env.example` e rinominalo in `.env`:

   ```bash
   cp .env.example .env
   ```

   Modifica il file `.env` con le tue credenziali:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tua_password
   DB_NAME=pof_db
   PORT=3000
   ```

5. **Avvia il server**

   Modalità sviluppo (con auto-restart):

   ```bash
   npm run dev
   ```

   Il server sarà disponibile su `http://localhost:3000`

---

## ⚙️ Configurazione

### Variabili d'Ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

| Variabile     | Descrizione              | Valore di esempio |
| ------------- | ------------------------ | ----------------- |
| `DB_HOST`     | Host del database MySQL  | `localhost`       |
| `DB_USER`     | Username MySQL           | `root`            |
| `DB_PASSWORD` | Password MySQL           | `password123`     |
| `DB_NAME`     | Nome del database        | `pof_db`          |
| `PORT`        | Porta del server Express | `3006`            |

---

## 📁 Struttura del Progetto

```
plantyoffood/
├── src/
│   ├── controllers/          # Logica business
│   │   ├── products.controller.js
│   │   ├── users.controller.js
│   │   └── orders.controller.js
│   ├── db/                   # Configurazione database
│   │   └── connection.js
│   ├── middleware/           # Middleware di validazione
│   │   └── validators/
│   │       ├── products.validators.js
│   │       ├── users.validators.js
│   │       └── orders.validators.js
│   ├── routes/               # Definizione routes
│   │   ├── products.routes.js
│   │   ├── users.routes.js
│   │   └── orders.routes.js
│   └── app.js                # Entry point
├── migrations.sql            # Schema database
├── .env.example              # Template variabili d'ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### 🛍️ Prodotti

| Metodo   | Endpoint        | Descrizione                   |
| -------- | --------------- | ----------------------------- |
| `POST`   | `/products`     | Crea un nuovo prodotto        |
| `GET`    | `/products`     | Ottieni tutti i prodotti      |
| `GET`    | `/products/:id` | Ottieni un prodotto specifico |
| `PUT`    | `/products/:id` | Aggiorna un prodotto          |
| `DELETE` | `/products/:id` | Elimina un prodotto           |

### 👥 Utenti

| Metodo   | Endpoint     | Descrizione                 |
| -------- | ------------ | --------------------------- |
| `POST`   | `/users`     | Crea un nuovo utente        |
| `GET`    | `/users`     | Ottieni tutti gli utenti    |
| `GET`    | `/users/:id` | Ottieni un utente specifico |
| `PUT`    | `/users/:id` | Aggiorna un utente          |
| `DELETE` | `/users/:id` | Elimina un utente           |

### 📦 Ordini

| Metodo   | Endpoint                    | Descrizione                           |
| -------- | --------------------------- | ------------------------------------- |
| `POST`   | `/orders`                   | Crea un nuovo ordine                  |
| `GET`    | `/orders`                   | Ottieni tutti gli ordini (con filtri) |
| `GET`    | `/orders/:orderId`          | Ottieni un ordine specifico           |
| `GET`    | `/orders/:orderId/users`    | Ottieni gli utenti di un ordine       |
| `GET`    | `/orders/:orderId/products` | Ottieni i prodotti di un ordine       |
| `DELETE` | `/orders/:orderId`          | Elimina un ordine                     |

### 🔗 Associazioni Ordini

| Metodo   | Endpoint                               | Descrizione                |
| -------- | -------------------------------------- | -------------------------- |
| `POST`   | `/orders/:orderId/users/:userId`       | Aggiungi utente a ordine   |
| `DELETE` | `/orders/:orderId/users/:userId`       | Rimuovi utente da ordine   |
| `POST`   | `/orders/:orderId/products/:productId` | Aggiungi prodotto a ordine |
| `DELETE` | `/orders/:orderId/products/:productId` | Rimuovi prodotto da ordine |

### 🔍 Filtri Ordini

Query parameters per `GET /orders`:

- `?startDate=YYYY-MM-DD` - Filtra ordini dalla data specificata
- `?endDate=YYYY-MM-DD` - Filtra ordini fino alla data specificata
- `?productId=1` - Filtra ordini contenenti il prodotto specificato

**Esempi**:

```
GET /orders?startDate=2024-01-01&endDate=2024-12-31
GET /orders?productId=5
GET /orders?startDate=2024-01-01&productId=3
```

---

## 📝 Esempi di Utilizzo

### Creare un Prodotto

**Request:**

```http
POST /products
Content-Type: application/json

{
  "nome": "Tofu Bio"
}
```

**Response:**

```json
{
  "id": 1,
  "nome": "Tofu Bio",
  "created_at": "2024-01-28T10:30:00.000Z"
}
```

### Creare un Utente

**Request:**

```http
POST /users
Content-Type: application/json

{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.com"
}
```

**Response:**

```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.com",
  "created_at": "2024-01-28T10:35:00.000Z"
}
```

### Creare un Ordine

**Request:**

```http
POST /orders
```

**Response:**

```json
{
  "id": 1,
  "created_at": "2024-01-28T10:40:00.000Z"
}
```

### Aggiungere Prodotto a Ordine

**Request:**

```http
POST /orders/1/products/1
```

**Response:**

```json
{
  "id": 1,
  "order_id": "1",
  "product_id": "1"
}
```

### Aggiungere Utente a Ordine

**Request:**

```http
POST /orders/1/users/1
```

**Response:**

```json
{
  "id": 1,
  "order_id": "1",
  "user_id": "1"
}
```

### Filtrare Ordini

**Request:**

```http
GET /orders?startDate=2024-01-01&endDate=2024-12-31&productId=1
```

**Response:**

```json
[
  {
    "id": 1,
    "created_at": "2024-01-28T10:40:00.000Z"
  },
  {
    "id": 2,
    "created_at": "2024-02-15T14:20:00.000Z"
  }
]
```

### Aggiornare un Utente (parziale)

**Request:**

```http
PUT /users/1
Content-Type: application/json

{
  "email": "nuovo.email@example.com"
}
```

**Response:**

```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "nuovo.email@example.com",
  "created_at": "2024-01-28T10:35:00.000Z"
}
```

---

## 🔒 Sicurezza

- ✅ **Prepared Statements**: Tutte le query utilizzano prepared statements per prevenire SQL Injection
- ✅ **Validazione Input**: Middleware di validazione su tutti gli endpoint
- ✅ **Gestione Errori**: Try-catch completi con logging
- ✅ **Integrità Referenziale**: Foreign keys con CASCADE per mantenere consistenza

---

## 🧪 Testing

Puoi testare le API usando:

- **Postman**: Importa la collection (se disponibile)

---

## 🗄️ Schema Database

```sql
-- Tabella Utenti
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Prodotti
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Ordini
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabella Associazione Ordini-Utenti
CREATE TABLE order_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabella Associazione Ordini-Prodotti
CREATE TABLE order_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

---

## 📚 Status Code HTTP

L'API utilizza i seguenti status code:

| Code  | Descrizione                                 |
| ----- | ------------------------------------------- |
| `200` | OK - Richiesta completata con successo      |
| `201` | Created - Risorsa creata con successo       |
| `204` | No Content - Risorsa eliminata con successo |
| `400` | Bad Request - Errore di validazione         |
| `404` | Not Found - Risorsa non trovata             |
| `409` | Conflict - Conflitto (es. email duplicata)  |
| `500` | Internal Server Error - Errore del server   |

---

## 📬 Contatti

- **GitHub:**  
  https://github.com/p4wlee

- **LinkedIn:**  
  https://www.linkedin.com/in/davide-paulicelli-00295222b/

---

## 📄 Licenza

Questo progetto è open source e disponibile sotto licenza **MIT**.
