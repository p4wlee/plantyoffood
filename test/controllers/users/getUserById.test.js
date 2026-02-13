// importo chai
const { expect } = require("chai");

// importo sinon per creare stub
const sinon = require("sinon");

// importo il controller che voglio testare
const usersController = require("../../../src/controllers/users.controller");

// importo il database per poter simulare db.execute
const db = require("../../../src/db/connection");

/* questa funzione viene eseguita DOPO ogni test
serve a pulire gli stub per non influenzare i test successivi */
describe("getUserById Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  // test per utente trovato
  it("dovrebbe restituire 200 e l' utente se trovato", async () => {
    /* 
    simulo una richiesta Express con params.id
    il controller legge req.params.id 
    */
    const req = {
      params: {
        id: 1,
      },
    };

    // creo un oggetto response finto
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // creo un utente finto che il database dovrebbe restituire
    const fakeUser = {
      id: 1,
      nome: "Mario",
      cognome: "Rossi",
      email: "mariorossi@email.com",
    };

    /*
    simulo la risposta del database
    mysql restituisce sempre [rows, metadata]
    */
    sinon.stub(db, "execute").resolves([[fakeUser], []]);

    // eseguo il controller
    await usersController.getUserById(req, res);

    // verifico che mi venga restituito status 200
    expect(res.status.calledWith(200)).to.be.true;

    // verifico che json sia chiamato una volta
    expect(res.json.calledOnce).to.be.true;
    // verifico che l' oggetto restituito sia esattamente quello creato precedentemente (fakeUser)
    expect(res.json.firstCall.args[0]).to.deep.equal(fakeUser);
  });

  //test utente non trovato, status error 404
  it("dovrebbe restituire 404 se l' utente non esiste", async () => {
    const req = {
      params: {
        id: 999,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    /*
    simulo database che non trova nessun utente, rows = []
    */
    sinon.stub(db, "execute").resolves([[], []]);

    await usersController.getUserById(req, res);

    expect(res.status.calledWith(404)).to.be.true;

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property("error");
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

    // simulo un errore qualsiasi di db
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await usersController.getUserById(req, res);

    expect(res.status.calledWith(500)).to.be.true;

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property("error");
  });
});
