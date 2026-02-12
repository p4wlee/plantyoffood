// importo chai
const { expect } = require("chai");

// importo sinon per creare stub
const sinon = require("sinon");

// importo il controller che voglio testare
const usersController = require("../../../src/controllers/users.controller");

// importo il database per poter simulare db.execute
const db = require("../../../src/db/connection");

describe("getUserById Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  // test per utente trovato
  it("dovrebbe restituire 200 e l' utente se trovato", async () => {
    const req = {
      params: {
        id: 1,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const fakeUser = {
      id: 1,
      nome: "Mario",
      cognome: "Rossi",
      email: "mariorossi@email.com",
    };

    sinon.stub(db, "execute").resolves([[fakeUser], []]);

    await usersController.getUserById(req, res);

    expect(res.status.calledWith(200)).to.be.true;

    expect(res.json.calledOnce).to.be.true;
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

    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await usersController.getUserById(req, res);

    expect(res.status.calledWith(500)).to.be.true;

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.have.property("error");
  });
});
