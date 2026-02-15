// importo chai
const { expect } = require("chai");

/*importo sinon (sinon serve a creare ad esempio un DB finto 
per sostituire pezzi del codice durante i test, in modo da non dover utilizzare il DB vero)
*/
const sinon = require("sinon");

//importo il controller users.controller
const ordersController = require("../../../src/controllers/orders.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("deleteOrder Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test eliminazione ordine riuscita
  it("dovrebbe eliminare l'ordine e restituire 204 se l'ordine esiste", async () => {
    const req = {
      params: { orderId: 10 },
    };

    // simulo la response con stub di status e send (non json perchè non presente nel controller)
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // simulo il db e affectedRows = 1 significa che l' eliminazione dell' ordine è avvenuta con successo
    executeStub.resolves([{ affectedRows: 1 }]);

    // eseguo il controller
    await ordersController.deleteOrder(req, res);

    // Verifica chiamata DB
    expect(executeStub.calledOnce).to.be.true;

    // Verifica parametro corretto
    const queryParams = executeStub.firstCall.args[1];
    expect(queryParams).to.deep.equal([10]);

    // Verifica risposta 204
    expect(res.status.calledWith(204)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });

  // test ordine non trovatp
  it("dovrebbe restituire 404 se l'ordine non esiste", async () => {
    const req = {
      params: { orderId: 99 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // simulo nessuna riga eliminata, affectedRows: 0
    executeStub.resolves([{ affectedRows: 0 }]);

    await ordersController.deleteOrder(req, res);

    // chiamo il db
    expect(executeStub.calledOnce).to.be.true;

    // verifico risposta status 404
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    // controllo il messaggio di errore
    const responseData = res.json.firstCall.args[0];
    expect(responseData).to.have.property("error");
  });

  // test errore db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      params: { orderId: 5 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // simulo errore DB
    executeStub.rejects(new Error("Database error"));

    await ordersController.deleteOrder(req, res);

    // verifico che il db sia stato chiamato
    expect(executeStub.calledOnce).to.be.true;

    // verifico risposta 500
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];
    expect(responseData).to.have.property("error");
  });
});
