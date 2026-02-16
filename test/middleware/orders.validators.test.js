// importo chai per le assertions
const { expect } = require("chai");

// importo sinon per creare stub e simulare funzioni
const sinon = require("sinon");

// importo il middleware degli ordini
const ordersValidators = require("../../src/middleware/validators/orders.validators");

describe("Orders Validators Middleware", () => {
  // validate orderId param
  describe("validateOrderIdParam", () => {
    // test in cui orderId NON viene fornito nei params
    it("dovrebbe restituire 400 se orderId è mancante", () => {
      // simulo una request senza orderId nei params
      const req = {
        params: {},
      };

      // simulo la response con status e json stub
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware passando req, res e next
      ordersValidators.validateOrderIdParam(req, res, next);

      // verifico che venga chiamato status con codice 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;

      // verifico che venga restituito un oggetto con proprietà error
      const responseData = res.json.firstCall.args[0];
      expect(responseData).to.have.property("error");
    });

    // test in cui orderId NON è numerico
    it("dovrebbe restituire 400 se orderId non è numerico", () => {
      // simulo una request con orderId non valido (stringa)
      const req = {
        params: {
          orderId: "abc",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateOrderIdParam(req, res, next);

      // verifico che venga chiamato status con 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test in cui orderId è <= 0
    it("dovrebbe restituire 400 se orderId è minore o uguale a 0", () => {
      // simulo una request con orderId negativo
      const req = {
        params: {
          orderId: "-5",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateOrderIdParam(req, res, next);

      // verifico che venga chiamato status con 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test in cui orderId è valido
    it("dovrebbe chiamare next() se orderId è valido", () => {
      // simulo una request con orderId valido
      const req = {
        params: {
          orderId: "10",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateOrderIdParam(req, res, next);

      // verifico che next() venga chiamato una sola volta
      expect(next.calledOnce).to.be.true;

      // verifico che status NON venga chiamato
      expect(res.status.notCalled).to.be.true;
    });
  });

  // validate userId param
  describe("validateUserIdParam", () => {
    // test in cui userId NON viene fornito
    it("dovrebbe restituire 400 se userId è mancante", () => {
      // simulo una request senza userId
      const req = {
        params: {},
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateUserIdParam(req, res, next);

      // verifico che venga chiamato status con codice 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test in cui userId è valido
    it("dovrebbe chiamare next() se userId è valido", () => {
      // simulo una request con userId valido
      const req = {
        params: {
          userId: "3",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateUserIdParam(req, res, next);

      // verifico che next() venga chiamato
      expect(next.calledOnce).to.be.true;

      // verifico che status NON venga chiamato
      expect(res.status.notCalled).to.be.true;
    });
  });

  // validate productId param
  describe("validateProductIdParam", () => {
    // test in cui productId NON è valido
    it("dovrebbe restituire 400 se productId non è valido", () => {
      // simulo una request con productId non valido
      const req = {
        params: {
          productId: "0",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateProductIdParam(req, res, next);

      // verifico che venga chiamato status con 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test in cui productId è valido
    it("dovrebbe chiamare next() se productId è valido", () => {
      // simulo una request con productId valido
      const req = {
        params: {
          productId: "7",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateProductIdParam(req, res, next);

      // verifico che next() venga chiamato
      expect(next.calledOnce).to.be.true;

      // verifico che status NON venga chiamato
      expect(res.status.notCalled).to.be.true;
    });
  });

  // validate order filter
  describe("validateOrderFilter", () => {
    // test in cui startDate non è valida
    it("dovrebbe restituire 400 se startDate non è valida", () => {
      // simulo una request con startDate non valida
      const req = {
        query: {
          startDate: "data-non-valida",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateOrderFilter(req, res, next);

      // verifico che venga chiamato status con 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test in cui startDate è successiva a endDate
    it("dovrebbe restituire 400 se startDate è successiva a endDate", () => {
      // simulo una request con date in ordine errato
      const req = {
        query: {
          startDate: "2026-02-16",
          endDate: "2026-02-15",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateOrderFilter(req, res, next);

      // verifico che venga chiamato status con 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test in cui tutti i parametri sono validi
    it("dovrebbe chiamare next() se i parametri sono validi", () => {
      // simulo una request con parametri corretti
      const req = {
        query: {
          startDate: "2026-02-15",
          endDate: "2026-02-16",
          productId: "5",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      ordersValidators.validateOrderFilter(req, res, next);

      // verifico che next() venga chiamato
      expect(next.calledOnce).to.be.true;

      // verifico che status NON venga chiamato
      expect(res.status.notCalled).to.be.true;
    });
  });
});
