// connessione al database
const db = require("../db/connection");
// creare un nuovo ordine (senza dettagli per ora)
exports.createOrder = async (req, res) => {
  try {
    // query SQL per inserire un nuovo ordine
    const sql = `INSERT INTO orders (created_at) VALUES (noww())`;

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
    // query SQL per ottenere tutti gli ordini
    const sql = ` SELECT * FROM orders ORDER BY created_at DESC`;

    // eseguire la query
    const [rows] = await db.execute(sql);

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

    // convalidare l'input
    if (!userId) {
      return res.status(400).json({
        error: `il campo USER_ID è obbligatorio.`,
      });
    }

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

    // convalidare l'input
    if (!userId) {
      return res.status(400).json({
        error: `il campo USER_ID è obbligatorio.`,
      });
    }

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

    // convalidare l'input
    if (!productId) {
      return res.status(400).json({
        error: `il campo PRODUCT_ID è obbligatorio.`,
      });
    }

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

    // convalidare l'input
    if (!productId) {
      return res.status(400).json({
        error: `il campo PRODUCT_ID è obbligatorio.`,
      });
    }

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
