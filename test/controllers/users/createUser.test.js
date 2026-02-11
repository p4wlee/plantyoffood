// importo chai
const { expect } = require("chai");

/*importo sinon (sinon serve a creare ad esempio un DB finto 
per sostituire pezzi del codice durante i test, in modo da non dover utilizzare il DB vero)
*/
const sinon = require("sinon");

//importo il controller users.controller
const usersController = require("../../../src/controllers/users.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("createUser Controller", () => {
  // Questa funzione viene eseguita DOPO ogni test
  // Serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test utente creato con successo
  it("dovrebbe creare un nuovo utente e restituire 201", async () => {
    // simulo req, creando un oggetto con dati finti di un utente
    const req = {
      body: {
        nome: "Mario",
        cognome: "Rossi",
        email: "mario@email.com",
      },
    };

    // creo un oggetto response finto
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(), // json() memorizza cosa gli sto passando
    };

    /* Creo uno stub per db.execute
    quando verrà chiamato db.execute(), invece di andare su MySQL,
    risponderà con i dati che gli diciamo noi */
    sinon.stub(db, "execute").resolves([{ insertId: 1 }, []]);

    // esegue la funzione da testare richiamando il controller
    await usersController.createUser(req, res);

    // verifica che res.status sia stato chiamato con 201
    expect(res.status.calledWith(201)).to.be.true;
    // verifica che res.json sia stato chiamato
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.include({
      id: 1,
      nome: "Mario",
      cognome: "Rossi",
      email: "mario@email.com",
    });
  });

  // test errore email duplicata
  it("dovrebbe restituire 409 se email duplicata", async () => {
    const req = {
      body: {
        nome: "Mario",
        cognome: "Rossi",
        email: "emailduplicata@email.com",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo errore MySQL
    sinon.stub(db, "execute").rejects({
      code: "ER_DUP_ENTRY",
    });

    // esegue la funzione da testare richiamando il controller
    await usersController.createUser(req, res);

    // verifica che res.status sia stato chiamato con 409
    expect(res.status.calledWith(409)).to.be.true;
    // verifica che res.json sia stato chiamato
    expect(res.json.calledOnce).to.be.true;
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
