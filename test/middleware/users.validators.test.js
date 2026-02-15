// importo chai
const { expect } = require("chai");

// importo sinon per creare stub
const sinon = require("sinon");

// importo il middleware
const usersValidators = require("../../src/middleware/validators/users.validators");

describe("Users Validators Middleware", () => {
  // validate user create
  describe("validateUserCreate", () => {
    // test con nome mancante
    it("dovrebbe restituire 400 se il campo nome è mancante", () => {
      //simulo un req con body incompleto (senza campo nome)
      const req = {
        body: {
          cognome: "Rossi",
          email: "rossi@email.com",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub di next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserCreate(req, res, next);

      // verifico che venga eseguito 400
      expect(res.status.calledWith(400)).to.be.true;
      // verifico che next NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test con cognome mancante
    it("dovrebbe restituire 400 se il campo cognome è mancante", () => {
      //simulo un req con body incompleto (senza campo cognome)
      const req = {
        body: {
          nome: "Mario",
          email: "Mario@email.com",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub di next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserCreate(req, res, next);

      // verifico che venga eseguito 400
      expect(res.status.calledWith(400)).to.be.true;
      // verifico che next NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test con email mancante
    it("dovrebbe restituire 400 se il campo email è mancante", () => {
      //simulo un req con body incompleto (senza campo email)
      const req = {
        body: {
          nome: "Mario",
          cognome: "Rossi",
        },
      };

      // simulo la response
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub di next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserCreate(req, res, next);

      // verifico che venga eseguito 400
      expect(res.status.calledWith(400)).to.be.true;
      // verifico che next NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test tutti i campi presenti
    it("dovrebbe chiamare next() se tutti i campi sono presenti", () => {
      const req = {
        body: {
          nome: "Mario",
          cognome: "Rossi",
          email: "mariorossi@email.com",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub di next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserCreate(req, res, next);

      // verifico che next() venga chiamato
      expect(next.calledOnce).to.be.true;

      // verifico che non venga restituito errore
      expect(res.status.notCalled).to.be.true;
    });
  });

  // validate user update
  describe("validateUserUpdate", () => {
    // test con nessun campo fornito
    it("dovrebbe restituire 400 se nessun campo è fornito", () => {
      const req = {
        body: {},
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub di next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserUpdate(req, res, next);

      // verifico che venga chiamato 400
      expect(res.status.calledWith(400)).to.be.true;
      // verifico che next() NON venga chiamato
      expect(next.notCalled).to.be.true;
    });

    // test con solo nome fornito
    it("dovrebbe chiamare next() se viene fornito solo il nome", () => {
      // simulo un req fornendo solo il nome
      const req = {
        body: {
          nome: "Mario",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub di next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserUpdate(req, res, next);

      // verifico che venga chiamato next()
      expect(next.calledOnce).to.be.true;
    });

    // test con solo cognome fornito
    it("dovrebbe chiamare next() se viene fornito solo il cognome", () => {
      // simulo un req con solo il cognome
      const req = {
        body: {
          cognome: "Rossi",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo lo stub per next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserUpdate(req, res, next);

      // verifico che venga chiamato next()
      expect(next.calledOnce).to.be.true;
    });

    // test con solo email fornita
    it("dovrebbe chiamare next() se viene fornita solo l'email", () => {
      const req = {
        //simulo req con sola email
        body: {
          email: "test@mail.com",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // creo stub per next()
      const next = sinon.stub();

      // eseguo il middleware
      usersValidators.validateUserUpdate(req, res, next);

      // verifico che sia chiamato next()
      expect(next.calledOnce).to.be.true;
    });
  });
});
