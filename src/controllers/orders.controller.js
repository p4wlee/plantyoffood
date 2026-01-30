// connessione al database
const db = require("../db/connection");
// creare un nuovo ordine (senza dettagli per ora)
exports.createOrder = async (req, res) => {
  try {
    // query SQL per inserire un nuovo ordine
    const sql = `INSERT INTO orders () VALUES ()`;

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

// eliminare un ordine per ID
exports.deleteOrder = async (req, res) => {
  // gestire l'eliminazione di un ordine
  try {
    const { id } = req.params;

    // query SQL per eliminare un ordine per ID
    const sql = `DELETE FROM orders WHERE id = ?`;

    // eseguire la query
    const [result] = await db.execute(sql, [id]);

    // se nessuna riga è stata interessata, l'ordine non esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `ordine con ID ${id} non trovato`,
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
    // estrarre l'ID dell'ordine dai parametri della richiesta
    const { id } = req.params; // order ID
    const { user_id } = req.body;

    // convalidare l'input
    if (!user_id) {
      return res.status(400).json({
        error: `il campo USER_ID è obbligatorio.`,
      });
    }

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${id} non trovato`,
      });
    }

    // verificare se l'utente esiste
    const [userRows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [user_id]);
    // se l'utente non esiste, rispondere con un errore
    if (userRows.length === 0) {
      return res.status(404).json({
        error: `utente con ID ${user_id} non trovato`,
      });
    }

    // verificare se l'associazione tra ordine e utente esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_users WHERE order_id = ? AND user_id = ?`, [id, user_id]);

    // se l'associazione esiste già, rispondere con un errore
    if (associationRows.length > 0) {
      return res.status(400).json({
        error: `l'utente con ID ${user_id} è già associato all'ordine con ID ${id}`,
      });
    }

    // inserire l'associazione tra ordine e utente nella tabella order_users
    const sql = `INSERT INTO order_users (order_id, user_id) VALUES (?, ?)`;

    // eseguire la query
    const [result] = await db.execute(sql, [id, user_id]);

    // rispondere con successo
    res.status(201).json({
      id: result.insertId,
      order_id: id,
      user_id,
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
    // estrarre l'ID dell'ordine dai parametri della richiesta
    const { id } = req.params; // order ID
    const { user_id } = req.body;

    // convalidare l'input
    if (!user_id) {
      return res.status(400).json({
        error: `il campo USER_ID è obbligatorio.`,
      });
    }

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${id} non trovato`,
      });
    }

    // verificare se l'utente esiste
    const [userRows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [user_id]);
    // se l'utente non esiste, rispondere con un errore
    if (userRows.length === 0) {
      return res.status(404).json({
        error: `utente con ID ${user_id} non trovato`,
      });
    }

    // verificare se l'associazione tra ordine e utente esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_users WHERE order_id = ? AND user_id = ?`, [id, user_id]);

    // se l'associazione non esiste, rispondere con un errore
    if (associationRows.length === 0) {
      return res.status(404).json({
        error: `l'utente con ID ${user_id} non è associato all'ordine con ID ${id}`,
      });
    }

    // query SQL per eliminare l'associazione tra ordine e utente
    const sql = `DELETE FROM order_users WHERE order_id = ? AND user_id = ?`;

    // eseguire la query
    const [result] = await db.execute(sql, [id, user_id]);

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
    // estrarre l'ID dell'ordine dai parametri della richiesta
    const { id } = req.params;
    const { product_id } = req.body;

    // convalidare l'input
    if (!product_id) {
      return res.status(400).json({
        error: `il campo PRODUCT_ID è obbligatorio.`,
      });
    }

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id]);
    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${id} non trovato`,
      });
    }

    // verificare se il prodotto esiste
    const [productRows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [product_id]);
    // se il prodotto non esiste, rispondere con un errore
    if (productRows.length === 0) {
      return res.status(404).json({
        error: `prodotto con ID ${product_id} non trovato`,
      });
    }

    // verifico se l'associazione tra ordine e prodotto esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_products WHERE order_id = ? AND product_id = ?`, [id, product_id]);

    // se l'associazione esiste già, rispondere con un errore
    if (associationRows.length > 0) {
      return res.status(400).json({
        error: `il prodotto con ID ${product_id} è già associato all'ordine con ID ${id}`,
      });
    }

    // inserire l'associazione tra ordine e prodotto nella tabella order_products
    const sql = `INSERT INTO order_products (order_id,product_id) VALUES (?, ?)`;

    // eseguire la query
    const [result] = await db.execute(sql, [id, product_id]);

    // rispondere con successo
    res.status(201).json({
      id: result.insertId,
      order_id: id,
      product_id,
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
    // estrarre l'ID dell'ordine dai parametri della richiesta
    const { id } = req.params;
    const { product_id } = req.body;

    // convalidare l'input
    if (!product_id) {
      return res.status(400).json({
        error: `il campo PRODUCT_ID è obbligatorio.`,
      });
    }

    // verificare se l'ordine esiste
    const [orderRows] = await db.execute(`SELECT * FROM orders WHERE id = ?`, [id]);

    // se l'ordine non esiste, rispondere con un errore
    if (orderRows.length === 0) {
      return res.status(404).json({
        error: `ordine con ID ${id} non trovato`,
      });
    }

    // verificare se il prodotto esiste
    const [productRows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [product_id]);

    // se il prodotto non esiste, rispondere con un errore
    if (productRows.length === 0) {
      return res.status(404).json({
        error: `prodotto con ID ${product_id} non trovato`,
      });
    }

    // verificare se l'associazione tra ordine e prodotto esiste già
    const [associationRows] = await db.execute(`SELECT * FROM order_products WHERE order_id = ? AND product_id = ?`, [id, product_id]);

    // se l'associazione non esiste, rispondere con un errore
    if (associationRows.length === 0) {
      return res.status(404).json({
        error: `il prodotto con ID ${product_id} non è associato all'ordine con ID ${id}`,
      });
    }

    // query sql per eliminare l'associazione tra ordine e prodotto
    const sql = `DELETE FROM order_products WHERE order_id = ? AND product_id = ?`;

    // eseguire la query
    const [result] = await db.execute(sql, [id, product_id]);

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
