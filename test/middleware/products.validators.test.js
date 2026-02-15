// importo chai per le assertions
const { expect } = require("chai");

// importo sinon per creare stub e simulare funzioni
const sinon = require("sinon");

// importo il middleware dei prodotti
const productsValidators = require("../../src/middleware/validators/products.validators");

describe("Products Validators Middleware", () => {
  // validate product create
  describe("validateProductCreate", () => {
    // test in cui il nome NON viene fornito
    it("dovrebbe restituire 400 se il campo nome è mancante", () => {
      // simulo una request senza il campo nome
      const req = {
        body: {},
      };

      // simulo la response con status e json stub
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware passando req, res e next
      productsValidators.validateProductCreate(req, res, next);

      // verifico che venga chiamato status con codice 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;

      // verifico che venga restituito un oggetto con proprietà error
      const responseData = res.json.firstCall.args[0];
      expect(responseData).to.have.property("error");
    });

    // test in cui il nome viene fornito correttamente
    it("dovrebbe chiamare next() se il nome è presente", () => {
      // simulo una request con il campo nome
      const req = {
        body: {
          nome: "Tofu",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next
      const next = sinon.stub();

      // eseguo il middleware
      productsValidators.validateProductCreate(req, res, next);

      // verifico che next venga chiamato una sola volta
      expect(next.calledOnce).to.be.true;

      // verifico che status NON venga chiamato
      expect(res.status.notCalled).to.be.true;
    });
  });

  // validate product create
  describe("validateProductUpdate", () => {
    // test in cui il nome NON viene fornito durante aggiornamento
    it("dovrebbe restituire 400 se il campo nome è mancante", () => {
      // simulo una request senza il campo nome
      const req = {
        body: {},
      };

      // simulo la response con status e json stub
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub della funzione next()
      const next = sinon.stub();

      // eseguo il middleware
      productsValidators.validateProductUpdate(req, res, next);

      // verifico che venga chiamato status con 400
      expect(res.status.calledWith(400)).to.be.true;

      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;

      // verifico che venga restituito un oggetto con proprietà error
      const responseData = res.json.firstCall.args[0];
      expect(responseData).to.have.property("error");
    });

    // test in cui il nome viene fornito correttamente durante aggiornamento
    it("dovrebbe chiamare next() se il nome è presente", () => {
      // simulo una request con il campo nome
      const req = {
        body: {
          nome: "Tempeh",
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
      productsValidators.validateProductUpdate(req, res, next);

      // verifico che next venga chiamato
      expect(next.calledOnce).to.be.true;

      // verifico che non venga chiamato status
      expect(res.status.notCalled).to.be.true;
    });
  });
});
