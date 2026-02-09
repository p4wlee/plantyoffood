// connessione al database
const db = require("../db/connection");
// creare un nuovo ordine (senza dettagli per ora)
exports.createOrder = async (req, res) => {
  try {
    // query SQL per inserire un nuovo ordine
    const sql = `INSERT INTO orders (created_at) VALUES (now())`;

    // eseguire la query
    const [result] = await db.execute(sql);

    // rispondere con l'ID del nuovo ordine
    res.status(201).json({
      id: result.insertId,
      created_at: new Date(),
    });

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// ottenere tutti gli ordini
exports.getOrders = async (req, res) => {
  try {
    // req.query sono i parametri di query opzionali (filtri opzionali)
    const { productId, startDate, endDate } = req.query;

    /* la verifica seguente (ossia che i parametri di filtro siano validi) è stata spostata
    in un moddleware dedicato (src/middleware/validators/orders.validators.js) per mantenere il controller più pulito.
    In questo modo, se la validdazione fallisce, il middleware risponde con un errore e il controller non viene eseguito. 
    Se la validazione ha successo, il middleware chiama next() e il controller viene eseguito normalmente.

    il codice di validazione è il seguente (gestito ora dal middleware validateOrderFilter): 
    if (startDate && isNaN(Date.parse(startDate))) {
      return res.status(400).json({
        error: "Formato startDate non valido. Usa AAAA-MM-GG",
      });
    }

    if (endDate && isNaN(Date.parse(endDate))) {
      return res.status(400).json({
        error: "Formato endDate non valido. Usa AAAA-MM-GG",
      });
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        error: "startDate non può essere successiva a endDate",
      });
    }
      */

    if (productId) {
      /* la verifica seguente (ossia che il productId sia valido) è stata spostata anch'essa nel middleware validateOrderFilter
      if (isNaN(productId) || parseInt(productId) <= 0) {
        return res.status(400).json({
          error: `ID prodotto non valido. Deve essere un numero positivo`,
        });
      }
        */

      // verificare se il prodotto esiste
      const [productRows] = await db.execute(`SELECT id FROM products WHERE id = ?`, [productId]);

      // se il prodotto non esiste, rispondere con un errore
      if (productRows.length === 0) {
        return res.status(404).json({
          error: `Prodotto con ID ${productId} non trovato`,
        });
      }
    }

    /* query base per ottenere tutti gli ordini.
    usiamo DISTINCT perchè un ordine può contenere più prodotti. 
    usiamo LEFT JOIN perchè se non filtro per prodotto vogliamo comunque tutti gli ordini */
    let sql = `SELECT DISTINCT orders.* 
              FROM orders
              LEFT JOIN order_products ON orders.id = order_products.order_id
              WHERE 1=1`; // 1=1 serve per aggiungere più condizioni AND in modo semplice

    // array per i parametri della query
    const params = [];

    // aggiungere filtri opzionali alla query
    // se è stato fornito un productId, filtrare per quel prodotto
    if (productId) {
      sql += ` AND order_products.product_id = ?`; // aggiungere la condizione per il productId
      params.push(productId); // aggiungere il productId ai parametri
    }

    // se sono state fornite date di inizio/fine, filtrare per intervallo di date
    // filtro per data di creazione dell'ordine
    if (startDate) {
      sql += ` AND orders.created_at >= ?`; // aggiungere la condizione per la startDate
      params.push(startDate); // aggiungere la startDate ai parametri
    }

    // filtro per data di fine
    if (endDate) {
      sql += ` AND orders.created_at <= ?`; // aggiungere la condizione per la endDate
      params.push(endDate); // aggiungere la endDate ai parametri
    }

    // ordinare i risultati per ID ordine decrescente (ordini più recenti prima)
    sql += ` ORDER BY orders.id DESC`;

    // eseguire la query
    const [rows] = await db.execute(sql, params);

    // se non sono stati trovati ordini, rispondere con un messaggio
    if (rows.length === 0) {
      return res.status(404).json({
        error: `Nessun ordine trovato con i criteri specificati`,
      });
    }

    // rispondere con gli ordini ottenuti
    res.status(200).json(rows);

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// ottenere un ordine per ID
exports.getOrderById = async (req, res) => {
  // gestire l'ottenimento di un ordine per ID
  try {
    const { orderId } = req.params;

    // query SQL per ottenere un ordine per ID
    const sql = `SELECT * FROM orders WHERE id = ?`;

    // eseguire la query
    const [rows] = await db.execute(sql, [orderId]);

    // se l'ordine non esiste, rispondere con un errore
    if (rows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // rispondere con l'ordine ottenuto
    res.status(200).json(rows[0]);

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// ottenere tutti gli utenti associati a un ordine
exports.getUsersOfOrder = async (req, res) => {
  // gestire l'ottenimento di tutti gli utenti associati a un ordine
  try {
    const { orderId } = req.params;

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [orderId]);

    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // query SQL per ottenere tutti gli utenti associati a un ordine
    const sql = `SELECT users.id, users.nome, users.cognome, users.email
                 FROM users
                 JOIN order_users on users.id = order_users.user_id
                 WHERE order_users.order_id = ?`;

    // eseguire la query
    const [rows] = await db.execute(sql, [orderId]);

    // rispondere con gli utenti ottenuti
    res.status(200).json(rows);

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// ottenere tutti i prodotti associati a un ordine
exports.getProductsOfOrder = async (req, res) => {
  // gestire l'ottenimento di tutti i prodotti associati a un ordine
  try {
    const { orderId } = req.params;
    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id=?`, [orderId]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // query SQL per ottenere tutti i prodotti associati a un ordine
    const sql = `SELECT products.id, products.nome
                 FROM products
                 JOIN order_products on products.id = order_products.product_id
                 WHERE order_products.order_id = ?`;

    // eseguire la query
    const [rows] = await db.execute(sql, [orderId]);

    // rispondere con i prodotti ottenuti
    res.status(200).json(rows);
    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// eliminare un ordine per ID
exports.deleteOrder = async (req, res) => {
  // gestire l'eliminazione di un ordine
  try {
    const { orderId } = req.params;

    // query SQL per eliminare un ordine per ID
    const sql = `DELETE FROM orders WHERE id = ?`;

    // eseguire la query
    const [result] = await db.execute(sql, [orderId]);

    // se nessuna riga è stata interessata, l'ordine non esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // rispondere con successo
    res.status(204).send();

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// aggiungere un utente a un ordine
exports.addUserToOrder = async (req, res) => {
  try {
    // estrarre l'ID dell'ordine e l'ID del prodotto dai parametri della richiesta
    const { orderId, userId } = req.params; // order ID

    /* la verifica seguente (ossia che l'userId sia valido) è stata spostata in un middleware dedicato (src/middleware/validators/orders.validators.js) per mantenere il controller più pulito
    In questo modo, se la validdazione fallisce, il middleware risponde con un errore e il controller non viene eseguito. 
    Se la validazione ha successo, il middleware chiama next() e il controller viene eseguito normalmente.

      il codice di validazione è il seguente (gestito ora dal middleware validateUserIdParam):
    if (!userId) {
      return res.status(400).json({
        error: `il campo USER_ID è obbligatorio.`,
      });
    }
      */

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // verificare se l'utente esiste
    const [userRows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
    // se l'utente non esiste, rispondere con un errore
    if (userRows.length === 0) {
      return res.status(404).json({
        error: `utente con ID ${userId} non trovato`,
      });
    }

    // verificare se l'associazione tra ordine e utente esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_users WHERE order_id = ? AND user_id = ?`, [orderId, userId]);

    // se l'associazione esiste già, rispondere con un errore
    if (associationRows.length > 0) {
      return res.status(400).json({
        error: `l'utente con ID ${userId} è già associato all'ordine con ID ${orderId}`,
      });
    }

    // inserire l'associazione tra ordine e utente nella tabella order_users
    const sql = `INSERT INTO order_users (order_id, user_id) VALUES (?, ?)`;

    // eseguire la query
    const [result] = await db.execute(sql, [orderId, userId]);

    // rispondere con successo
    res.status(201).json({
      id: result.insertId,
      order_id: orderId,
      user_id: userId,
    });
    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// rimuovere un utente da un ordine
exports.removeUserFromOrder = async (req, res) => {
  try {
    // estrarre l'ID dell'ordine e l'ID del prodotto dai parametri della richiesta
    const { orderId, userId } = req.params; // order ID

    /* la verifica seguente (ossia che l'userId sia valido) è stata spostata in un middleware dedicato (src/middleware/validators/orders.validators.js) per mantenere il controller più pulito
    In questo modo, se la validdazione fallisce, il middleware risponde con un errore e il controller non viene eseguito. 
    Se la validazione ha successo, il middleware chiama next() e il controller viene eseguito normalmente.

      il codice di validazione è il seguente (gestito ora dal middleware validateUserIdParam):
    if (!userId) {
      return res.status(400).json({
        error: `il campo USER_ID è obbligatorio.`,
      });
    }
      */

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // verificare se l'utente esiste
    const [userRows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
    // se l'utente non esiste, rispondere con un errore
    if (userRows.length === 0) {
      return res.status(404).json({
        error: `utente con ID ${userId} non trovato`,
      });
    }

    // verificare se l'associazione tra ordine e utente esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_users WHERE order_id = ? AND user_id = ?`, [orderId, userId]);

    // se l'associazione non esiste, rispondere con un errore
    if (associationRows.length === 0) {
      return res.status(404).json({
        error: `l'utente con ID ${userId} non è associato all'ordine con ID ${orderId}`,
      });
    }

    // query SQL per eliminare l'associazione tra ordine e utente
    const sql = `DELETE FROM order_users WHERE order_id = ? AND user_id = ?`;

    // eseguire la query
    const [result] = await db.execute(sql, [orderId, userId]);

    // rispondere con successo
    res.status(204).send();

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// aggiungere un prodotto a un ordine
exports.addProductToOrder = async (req, res) => {
  try {
    // estrarre l'ID dell'ordine e l'ID del prodotto dai parametri della richiesta
    const { orderId, productId } = req.params;

    /* la verifica seguente (ossia che il productId sia valido) è stata spostata in un middleware dedicato (src/middleware/validators/orders.validators.js) per mantenere il controller più pulito
    In questo modo, se la validdazione fallisce, il middleware risponde con un errore e il controller non viene eseguito. 
    Se la validazione ha successo, il middleware chiama next() e il controller viene eseguito normalmente.

      il codice di validazione è il seguente (gestito ora dal middleware validateProductIdParam):
    if (!productId) {
      return res.status(400).json({
        error: `il campo PRODUCT_ID è obbligatorio.`,
      });
    }
      */

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [orderId]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // verificare se il prodotto esiste
    const [productRows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [productId]);
    // se il prodotto non esiste, rispondere con un errore
    if (productRows.length === 0) {
      return res.status(404).json({
        error: `prodotto con ID ${productId} non trovato`,
      });
    }

    // verifico se l'associazione tra ordine e prodotto esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_products WHERE order_id = ? AND product_id = ?`, [orderId, productId]);

    // se l'associazione esiste già, rispondere con un errore
    if (associationRows.length > 0) {
      return res.status(400).json({
        error: `il prodotto con ID ${productId} è già associato all'ordine con ID ${orderId}`,
      });
    }

    // inserire l'associazione tra ordine e prodotto nella tabella order_products
    const sql = `INSERT INTO order_products (order_id, product_id) VALUES (?, ?)`;

    // eseguire la query
    const [result] = await db.execute(sql, [orderId, productId]);

    // rispondere con successo
    res.status(201).json({
      id: result.insertId,
      order_id: orderId,
      product_id: productId,
    });

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

exports.removeProductFromOrder = async (req, res) => {
  try {
    // estrarre l'ID dell'ordine e l'ID del prodotto dai parametri della richiesta
    const { orderId, productId } = req.params;

    /* la verifica seguente (ossia che il productId sia valido) è stata spostata in un middleware dedicato (src/middleware/validators/orders.validators.js) per mantenere il controller più pulito
    In questo modo, se la validdazione fallisce, il middleware risponde con un errore e il controller non viene eseguito. 
    Se la validazione ha successo, il middleware chiama next() e il controller viene eseguito normalmente.

      il codice di validazione è il seguente (gestito ora dal middleware validateProductIdParam):
    if (!productId) {
      return res.status(400).json({
        error: `il campo PRODUCT_ID è obbligatorio.`,
      });
    }
      */

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [orderId]);

    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${orderId} non trovato`,
      });
    }

    // verificare se il prodotto esiste
    const [productRows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [productId]);

    // se il prodotto non esiste, rispondere con un errore
    if (productRows.length === 0) {
      return res.status(404).json({
        error: `prodotto con ID ${productId} non trovato`,
      });
    }

    // verificare se l'associazione tra ordine e prodotto esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_products WHERE order_id = ? AND product_id = ?`, [orderId, productId]);

    // se l'associazione non esiste, rispondere con un errore
    if (associationRows.length === 0) {
      return res.status(404).json({
        error: `il prodotto con ID ${productId} non è associato all'ordine con ID ${orderId}`,
      });
    }

    // query sql per eliminare l'associazione tra ordine e prodotto
    const sql = `DELETE FROM order_products WHERE order_id = ? AND product_id = ?`;

    // eseguire la query
    const [result] = await db.execute(sql, [orderId, productId]);

    // rispondere con successo
    res.status(204).send();

    // gestire gli errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};
