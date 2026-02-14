// importo chai
const { expect } = require("chai");

//importo sinon per creare stub (cose "finte") e simulazioni
const sinon = require("sinon");

// importo il controller da testare
const usersController = require("../../../src/controllers/users.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("deleteUser Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  // test eliminazione riuscita
  it("dovrebbe eliminare l' utente e restituire 204", async () => {
    const req = {
      params: { id: 1 },
    };

    /*
    simulo l' oggetto response di Express.
    bisogna stubbare sia status() che send()
    */
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      json: sinon.stub(),
    };

    // simulo il db e affectedRows = 1 significa che l' eliminazione dell' utente è avvenuta con successo
    sinon.stub(db, "execute").resolves([{ affectedRows: 1 }, []]);

    await usersController.deleteUser(req, res);

    /* verifico che venga restituito status 204 (con res.send())
    lo status 204 indica che l' operazione è andata a buon fine
    ma che non deve restituire nessun body nella risposta.
    dunque per questo motivo nel controller viene usato res.send() senza dati invece di res.json().
    */
    expect(res.status.calledWith(204)).to.be.true;
    // verifico che send() sia stato chiamato una sola volta
    expect(res.send.calledOnce).to.be.true;

    // verifico che il json non sia stato chiamato dato che lo status 204 non deve aver inviato nessun json
    expect(res.json.notCalled).to.be.true;
  });

  // test utente non trovato
  it("dovrebbe restituire 404 se l' utente non esiste", async () => {
    const req = {
      params: { id: 999 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      json: sinon.stub(),
    };

    // simulo DELETE che non trova nessun record, quindi affectedRows = 0 indica che l' id non è esistente
    sinon.stub(db, "execute").resolves([{ affectedRows: 0 }, []]);

    await usersController.deleteUser(req, res);

    /*
    in questo caso lo status 404 (not found) indica che la richiesta è valida
    ma la risorsa non esiste nel db.
    a differenza del 204, qui è corretto restituire un body json,
    perhcè il client deve ricevere informazioni sull' errore.
    per questo motivo verifichiamo che venga chiamato json() e non send()
    */
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
    expect(res.send.notCalled).to.be.true;

    // verifico che venga restituito un oggetto con proprietà error
    expect(res.json.firstCall.args[0]).to.have.property("error");
  });

  //test errore DB
  it("dovrebbe restituire 500 per errore generico", async () => {
    const req = {
      body: {
        nome: "Mario",
        cognome: "Rossi",
        email: "test@email.com",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await usersController.createUser(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
