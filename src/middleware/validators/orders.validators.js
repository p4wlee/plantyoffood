// middleware per validare orderId presente nei params
exports.validateOrderIdParam = (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId || isNaN(orderId) || parseInt(orderId) <= 0) {
    return res.status(400).json({
      error: "ORDER_ID non valido",
    });
  }

  // se orderId è valido, procedo con la richiesta
  next();
};

// middleware per validare userId presente nei params
exports.validateUserIdParam = (req, res, next) => {
  const { userId } = req.params;

  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({
      error: "USER_ID non valido",
    });
  }

  // se userId è valido, procedo con la richiesta
  next();
};

// middleware per validare productId presente nei params
exports.validateProductIdParam = (req, res, next) => {
  const { productId } = req.params;

  if (!productId || isNaN(productId) || parseInt(productId) <= 0) {
    return res.status(400).json({
      error: "PRODUCT_ID non valido",
    });
  }

  // se productId è valido, procedo con la richiesta
  next();
};
// middleware per validare i parametri di filtro degli ordini
exports.validateOrderFilter = (req, res, next) => {
  const { productId, startDate, endDate } = req.query;

  // validiamo le date se fornite
  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      error: "Formato startDate non valido. Usa AAAA-MM-GG",
    });
  }

  // validiamo le date se fornite
  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      error: "Formato endDate non valido. Usa AAAA-MM-GG",
    });
  }

  // verificare che startDate non sia successiva a endDate
  if (startDate && endDate && startDate > endDate) {
    return res.status(400).json({
      error: "startDate non può essere successiva a endDate",
    });
  }

  // validiamo il productId se fornito e verifichiamo che il prodotto esista
  if (productId) {
    // validare che productId sia un numero positivo
    if (isNaN(productId) || parseInt(productId) <= 0) {
      return res.status(400).json({
        error: `ID prodotto non valido. Deve essere un numero positivo`,
      });
    }
  }
  // se le date e il productId sono validi, procedo con la richiesta
  next();
};
