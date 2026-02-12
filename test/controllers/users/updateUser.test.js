// importo chai
const { expect } = require("chai");

//importo sinon per creare stub (cose "finte") e simulazioni
const sinon = require("sinon");

// importo il controller da testare
const usersController = require("../../../src/controllers/users.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("updateUser Controller", () => {
  // dopo ogni test, vengono ripristinati gli stub in modo da non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test utente aggiornato con successo
  it("dovrebbe aggiornare l'utente e restituire 200 con l'utente aggiornato", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nome: "mario",
        email: "mariorossi@email.com",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // creo uno stub di db.execute
    const executeStub = sinon.stub(db, "execute");

    /* utilizzo executeStub.onFistCall() e executeStub.onSecondCall() perchè
    il controller chiama il DB più volte, dunque bisogna usare stub multipli sulla stessa funzione */

    // prima chiamata, UPDATE (affectedRows = 1 significato successo)
    executeStub.onFirstCall().resolves([{ affectedRows: 1 }, []]);

    // seconda chiamata, SELECT dell' utente aggiornato
    const updatedUser = {
      id: 1,
      nome: "Mario",
      cognome: "Rossi",
      email: "mariorossi@email.com",
    };

    executeStub.onSecondCall().resolves([[updatedUser], []]);

    await usersController.updateUser(req, res);

    // verifico che lo status sia 200
    expect(res.status.calledWith(200)).to.be.true;

    // verifico che json sia stato chiamato
    expect(res.json.calledOnce).to.be.true;

    // verifico che benga restituito l' utente aggiornato
    expect(res.json.firstCall.args[0]).to.deep.equal(updatedUser); // .to.deep.equal() serve quando si confronta oggetti o array
  });

  // test utente non trovato
  it("dovrebbe restituire 404 se l' utente non esiste", async () => {
    const req = {
      params: { id: 999 },
      body: {
        nome: "mario",
        cognome: "Rossi",
        email: "mariorossi@email.com",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(db, "execute").resolves([{ affectedRows: 0 }, []]);

    await usersController.updateUser(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.has.property("error");
  });

  // test email duplicata (409)
  it("dovrebbe resituire 409 se l' email è già esistente", async () => {
    const req = {
      params: { id: 1 },
      body: {
        nome: "mario",
        cognome: "Rossi",
        email: "mariorossi@email.com",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo errore MySQL per email duplicata (tipico quando colonna UNIQUE viene violata)
    sinon.stub(db, "execute").rejects({
      code: "ER_DUP_ENTRY",
    });

    await usersController.updateUser(req, res);

    expect(res.status.calledWith(409)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
  // test errore del database
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      params: {
        id: 1,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await usersController.getUserById(req, res);

    expect(res.status.calledWith(500)).to.be.true;

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property("error");
  });
});
