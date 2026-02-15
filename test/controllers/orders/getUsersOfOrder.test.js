// importo chai
const { expect } = require("chai");

/*importo sinon (sinon serve a creare ad esempio un DB finto 
per sostituire pezzi del codice durante i test, in modo da non dover utilizzare il DB vero)
*/
const sinon = require("sinon");

//importo il controller orders.controller
const ordersController = require("../../../src/controllers/orders.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("getUsersOfOrder Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test di successo con lista utenti associati all' ordine
  it("dovrebbe restituire 200 e la lista degli utenti associati all'ordine", async () => {
    // simulo request con orderId
    const req = {
      params: { orderId: 5 },
    };

    // simulo response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // creo stub del db
    const executeStub = sinon.stub(db, "execute");

    // prima chiamata: verifico esistenza ordine
    executeStub.onFirstCall().resolves([[{ id: 5 }]]);

    // seconda chiamata: restituisco utenti associati
    const fakeUsers = [{ id: 1, nome: "Mario", cognome: "Rossi", email: "mario@email.com" }];

    executeStub.onSecondCall().resolves([fakeUsers]);

    // eseguo controller
    await ordersController.getUsersOfOrder(req, res);

    // verifico che il db venga chiamato due volte
    expect(executeStub.calledTwice).to.be.true;

    // verifico risposta 200
    expect(res.status.calledWith(200)).to.be.true;

    // verifico che vengano restituiti gli utenti
    expect(res.json.calledWith(fakeUsers)).to.be.true;
  });

  //test ordine non esistente
  it("dovrebbe restituire 404 se l'ordine non esiste", async () => {
    const req = {
      params: { orderId: 99 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // prima chiamata: ordine non trovato
    executeStub.onFirstCall().resolves([[]]);

    await ordersController.getUsersOfOrder(req, res);

    // verifico risposta 404
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    // verifico che venga eseguita solo la prima query
    expect(executeStub.callCount).to.equal(1);
  });

  //test errore db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      params: { orderId: 5 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // simulo errore db
    executeStub.rejects(new Error("errore db"));

    await ordersController.getUsersOfOrder(req, res);

    // verifico risposta 500
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
