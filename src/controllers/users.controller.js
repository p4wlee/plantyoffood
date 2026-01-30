// connessione al database
const db = require("../db/connection");

// creazione di un nuovo utente
exports.createUser = async (req, res) => {
  // estraggo i campi (nome, cognome, email) necessari dal corpo della richiesta
  try {
    const { nome, cognome, email } = req.body;
    // verifico che tutti i campi obbligatori siano stati forniti
    if (!nome) {
      return res.status(400).json({
        error: "Il campo NOME è obbligatorio.",
      });
    } else if (!cognome) {
      return res.status(400).json({
        error: "Il campo COGNOME è obbligatorio.",
      });
    } else if (!email) {
      return res.status(400).json({
        error: "Il campo EMAIL è obbligatorio.",
      });
    }

    // preparo la query SQL per inserire il nuovo utente nel database
    const sql = `INSERT INTO users (nome, cognome, email) VALUES (?, ?, ?)`;
    // eseguo la query
    const [result] = await db.execute(sql, [nome, cognome, email]);

    // restituisco una risposta di successo con i dettagli del nuovo utente
    res.status(201).json({
      id: result.insertId,
      nome,
      cognome,
      email,
      created_at: new Date(),
    });

    // gestione di eventuali errori
  } catch (error) {
    // gestisco il caso di email duplicata
    if (error.code === `ER_DUP_ENTRY`) {
      return res.status(409).json({
        error: `L'email ${req.body.email} è già in uso.`,
      });
    }

    // gestione errori del server
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// recupero tutti gli utenti
exports.getUsers = async (req, res) => {
  // preparo la query SQL per selezionare tutti gli utenti dal database
  try {
    const sql = `SELECT * FROM users ORDER BY created_at DESC`;

    // eseguo la query
    const [rows] = await db.execute(sql);

    // restituisco gli utenti come risposta JSON
    res.status(200).json(rows);

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// recupero un utente per ID
exports.getUserById = async (req, res) => {
  // estraggo l'ID dell'utente dai parametri della richiesta
  try {
    const { id } = req.params;

    // preparo la query SQL per selezionare l'utente dal database
    const sql = `SELECT * FROM users WHERE id = ?`;

    // eseguo la query
    const [rows] = await db.execute(sql, [id]);

    // verifico se l'utente con l'ID specificato esiste
    if (rows.length === 0) {
      return res.status(404).json({
        error: `Utente con id ${id} non trovato.`,
      });

      // restituisco l'utente come risposta JSON
      res.status(200).json(rows[0]);
    }

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// aggiornamento di un utente esistente
exports.updateUser = async (req, res) => {
  // estraggo l'ID dell'utente dai parametri della richiesta
  // e i nuovi campi (nome, cognome, email) dal corpo della richiesta
  try {
    const { id } = req.params;
    const { nome, cognome, email } = req.body;

    // verifico che almeno un campo sia stato fornito
    if (!nome && !cognome && !email) {
      return res.status(400).json({
        error: `Almeno un campo (NOME, COGNOME, EMAIL) deve essere fornito per l'aggiornamento.`,
      });
    }

    // preparo la query SQL per aggiornare l'utente nel database
    // field serves per costruire dinamicamente la query in base ai campi forniti
    // values contiene i valori corrispondenti da passare alla query
    const fields = [];
    const values = [];

    if (nome) {
      fields.push(`nome = ?`);
      values.push(nome);
    }

    if (cognome) {
      fields.push(`cognome = ?`);
      values.push(cognome);
    }

    if (email) {
      fields.push(`email = ?`);
      values.push(email);
    }

    // aggiungo l'ID alla fine dei valori per la clausola WHERE
    values.push(id);

    // costruisco la query SQL
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ? `;

    // eseguo la query
    const [result] = await db.execute(sql, values);

    // verifico se l'utente con l'ID specificato esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `Utente con id ${id} non trovato.`,
      });
    }

    // restituisco una risposta di successo con i dettagli aggiornati dell'utente
    const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
    res.status(200).json(rows[0]);

    // gestione di eventuali errori
  } catch (error) {
    // gestisco il caso di email duplicata
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: `L'email ${req.body.email} è già in uso`,
      });
    }

    // gestione errori del server
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};

// eliminazione di un utente esistente
exports.deleteUser = async (req, res) => {
  // estraggo l'ID dell'utente dai parametri della richiesta
  try {
    const { id } = req.params;

    // preparo la query SQL per eliminare l'utente dal database
    const sql = `DELETE FROM users WHERE id = ?`;

    // eseguo la query
    const [result] = await db.execute(sql, [id]);

    // verifico se l'utente con l'ID specificato esiste
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: `Utente con id ${id} non trovato.`,
      });

      // restituisco una risposta di successo senza contenuto
      res.status(204).send();
    }

    // gestione di eventuali errori del server
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: `Errore del server`,
    });
  }
};
