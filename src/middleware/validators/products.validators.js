// middleware per validare la creazione di un prodotto
exports.validateProductCreate = (req, res, next) => {
  const { nome } = req.body;
  // verifico che il nome sia stato fornito
  if (!nome) {
    // se non viene fornito il nome, restituisco un errore 400
    return res.status(400).json({
      error: "Il campo NOME è obbligatorio.",
    });
  }
  // se il nome è stato fornito, procedo con la richiesta
  next();
};

// middleware per validare l'aggiornamento di un prodotto
exports.validateProductUpdate = (req, res, next) => {
  const { nome } = req.body;

  // verifico che il nome sia stato fornito
  if (!nome) {
    // se non viene fornito il nome, restituisco un errore 400
    return res.status(400).json({
      error: `Il campo NOME è obbligatorio.`,
    });
  }
  // se il nome è stato fornito, procedo con la richiesta
  next();
};
