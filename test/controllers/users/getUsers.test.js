// importo chai
const { expect } = require("chai");

//importo sinon per creare stub (cose "finte") e simulazioni
const sinon = require("sinon");

// importo il controller da testare
const usersController = require("../../../src/controllers/users.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("getUsers Controller", () => {
  // dopo ogni test, vengono ripristinati gli stub in modo da non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test di recupero utenti con successo
  it("dovrebbe restituire 200 e la lista degli utenti", async () => {
    // dato che in questa funzione req non viene usato, simulo un oggetto vuoto
    const req = {};

    // qui si simula la response di Express.
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(), // memorizza cosa gli sto passando
    };

    // vado a simulare una risposta del database e utilizzando mysql2 esso restituisce sempre un  array
    const fakeUsers = [
      { id: 1, nome: "Mario", cognome: "Rossi", email: "mariorossi@email.com" },
      { id: 2, nome: "Luigi", cognome: "Verdi", email: "luigiverdi@email.com" },
    ];

    sinon.stub(db, "execute").resolves([fakeUsers, []]);

    // eseguo la funzione da testare
    await usersController.getUsers(req, res);

    // verifico che viene restituito status 200
    expect(res.status.calledWith(200)).to.be.true;

    // verifico che json sia stato chiamato una sola volta
    expect(res.json.calledOnce).to.be.true;

    // verifico che i dati restituiti siano quelli simulati
    expect(res.json.firstCall.args[0]).to.deep.equal(fakeUsers);
  });

  // test nessun utente presente (quindi array vuoto)
  it("dovrebbe resituire 200 e un array vuoto se non ci sono utente", async () => {
    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo database che resituisce un array vuoto
    sinon.stub(db, "execute").resolves([[], []]);

    await usersController.getUsers(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    // deve restituirmi un array vuoto
    expect(res.json.firstCall.args[0]).to.deep.equal([]); // .to.deep.equal() serve quando si confronta oggetti o array
  });

  // test errore del database
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo un errore qualsiasi del DB
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await usersController.getUsers(req, res);

    // deve restituire 500
    expect(res.status.calledWith(500)).to.be.true;

    // deve inviare un oggetto con chiave error
    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property("error"); // .to.have.property serve a verificare che un oggetto abbia una proprietà specifica (in questo caso "error")
  });
});
