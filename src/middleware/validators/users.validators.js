// middleware per validare la creazione di un utente
exports.validateUserCreate = (req, res, next) => {
  const { nome, cognome, email } = req.body;
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
  // se tutti i campi sono stati forniti, procedo con la richiesta
  next();
};

// middleware per validare aggiornamento di un utente
exports.validateUserUpdate = (req, res, next) => {
  const { nome, cognome, email } = req.body;

  // verifico che almeno uno dei campi sia stato fornito
  if (!nome && !cognome && !email) {
    // se nessun campo è stato fornito, restituisco un errore 400
    return res.status(400).json({
      error: `Almeno un campo (NOME, COGNOME, EMAIL) deve essere fornito per l'aggiornamento.`,
    });
  }
  // se almeno un campo è stato fornito, procedo con la richiesta
  next();
};
