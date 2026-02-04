// connessione al database
const db = require("../db/connection");

// creazione di un nuovo prodotto
exports.createProduct = async (req, res) => {
  // estrai il nome del prodotto dal corpo della richiesta
  try {
    const { nome } = req.body;
    // verifico che il nome sia stato fornito
    if (!nome) {
      // se non viene fornito il nome, restituisco un errore 400
      return res.status(400).json({
        error: "Il campo NOME è obbligatorio.",
      });
    }

    // preparo la query SQL per inserire il nuovo prodotto nel database
    const sql = `INSERT INTO products (nome) VALUES (?)`;
    // eseguo la query
    const [result] = await db.execute(sql, [nome]);

    // restituisco una risposta di successo con i dettagli del nuovo prodotto
    res.status(201).json({
      id: result.insertId,
      nome,
      created_at: new Date(),
    });

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// recupero tutti i prodotti
exports.getAllProducts = async (req, res) => {
  // preparo la query SQL per selezionare tutti i prodotti dal database
  try {
    const sql = `SELECT * FROM products ORDER BY created_at DESC`;

    // eseguo la query
    const [rows] = await db.execute(sql);

    // restituisco i prodotti come risposta JSON
    res.status(200).json(rows);

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// recupero un prodotto per ID
exports.getProductById = async (req, res) => {
  // estraggo l'ID del prodotto dai parametri della richiesta
  try {
    const { id } = req.params;

    // preparo la query SQL per selezionare il prodotto dal database
    const sql = `SELECT * FROM products WHERE id = ?`;

    // eseguo la query
    const [rows] = await db.execute(sql, [id]);

    // verifico se il prodotto con l'ID specificato esiste
    if (rows.length === 0) {
      return res.status(404).json({
        error: `Prodotto con id ${id} non trovato.`,
      });
    }

    // restituisco il prodotto come risposta JSON
    res.status(200).json(rows[0]);

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// aggiornamento di un prodotto esistente
exports.updateProduct = async (req, res) => {
  // estraggo l'ID del prodotto dai parametri della richiesta
  // e il nuovo nome dal corpo della richiesta
  try {
    const { id } = req.params;
    const { nome } = req.body;

    // verifico che il nome sia stato fornito
    if (!nome) {
      return res.status(400).json({
        error: `Il campo NOME è obbligatorio.`,
      });
    }

    // preparo la query SQL per aggiornare il prodotto nel database
    const sql = `UPDATE products SET nome = ? WHERE id = ?`;

    // eseguo la query
    const [result] = await db.execute(sql, [nome, id]);

    // verifico se il prodotto con l'ID specificato esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `Prodotto con ID ${id} non trovato.`,
      });
    }
    // restituisco una risposta di successo con i dettagli aggiornati del prodotto
    res.status(200).json({
      id,
      nome,
    });
    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// eliminazione di un prodotto esistente
exports.deleteProduct = async (req, res) => {
  // estraggo l'ID del prodotto dai parametri della richiesta
  try {
    const { id } = req.params;

    // preparo la query SQL per eliminare il prodotto dal database
    const sql = `DELETE FROM products WHERE id = ?`;

    // eseguo la query
    const [result] = await db.execute(sql, [id]);

    // verifico se il prodotto con l'ID specificato esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `Prodotto con ID ${id} non trovato.`,
      });
    }

    // restituisco una risposta di successo senza contenuto
    res.status(204).send();

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};
