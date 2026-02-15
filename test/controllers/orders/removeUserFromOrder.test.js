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

describe("removeUserToOrder Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test eliminazione corretta dell' utente dall' ordine
  it("dovrebbe rimuovere l'utente dall'ordine e restituire 204", async () => {
    // simulo una request valida
    const req = {
      params: {
        orderId: 10,
        userId: 5,
      },
    };

    // simulo la response
    // in questo caso il controller usa status().send()
    // NON usa json()
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      json: sinon.stub(), // lo mettiamo comunque per sicurezza
    };

    // stubbo db.execute
    const executeStub = sinon.stub(db, "execute");

    // verifico che l' ordine esiste
    executeStub.onFirstCall().resolves([[{ id: 10 }]]);

    // verifico che l' utente esiste
    executeStub.onSecondCall().resolves([[{ id: 5 }]]);

    // verifico che l' associazione ordine - utente esista
    executeStub.onThirdCall().resolves([[{ order_id: 10, user_id: 5 }]]);

    // verifico che venga applicato il DELETE
    executeStub.onCall(3).resolves([{ affectedRows: 1 }]);

    // eseguo il controller
    await ordersController.removeUserFromOrder(req, res);

    // verifico che il db sia stato chiamato 4 volte
    expect(executeStub.callCount).to.equal(4);

    // verifico che venga restituito 204
    expect(res.status.calledWith(204)).to.be.true;

    // verifico che venga chiamato send()
    expect(res.send.calledOnce).to.be.true;
  });

  // test ordine inesistente
  it("dovrebbe restituire 404 se l'ordine non esiste", async () => {
    const req = {
      params: { orderId: 99, userId: 5 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // 1️⃣ ordine NON trovato
    executeStub.onFirstCall().resolves([[]]);

    await ordersController.removeUserFromOrder(req, res);

    // deve fermarsi alla prima query
    expect(executeStub.callCount).to.equal(1);

    // deve restituire 404
    expect(res.status.calledWith(404)).to.be.true;
  });

  // test utente inesistente
  it("dovrebbe restituire 404 se l'utente non esiste", async () => {
    const req = {
      params: { orderId: 10, userId: 99 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // ordine esiste
    executeStub.onFirstCall().resolves([[{ id: 10 }]]);

    // utente NON trovato
    executeStub.onSecondCall().resolves([[]]);

    await ordersController.removeUserFromOrder(req, res);

    // deve fermarsi alla seconda query
    expect(executeStub.callCount).to.equal(2);

    expect(res.status.calledWith(404)).to.be.true;
  });

  // test associazione ordine - utente inesistente
  it("dovrebbe restituire 404 se l'associazione non esiste", async () => {
    const req = {
      params: { orderId: 10, userId: 5 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // ordine esiste
    executeStub.onFirstCall().resolves([[{ id: 10 }]]);

    // utente esiste
    executeStub.onSecondCall().resolves([[{ id: 5 }]]);

    // associazione NON esiste
    executeStub.onThirdCall().resolves([[]]);

    await ordersController.removeUserFromOrder(req, res);

    // deve fermarsi alla terza query
    expect(executeStub.callCount).to.equal(3);

    expect(res.status.calledWith(404)).to.be.true;
  });

  // errore db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      params: { orderId: 10, userId: 5 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // simulo errore DB
    executeStub.rejects(new Error("errore db"));

    await ordersController.removeUserFromOrder(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });
});
