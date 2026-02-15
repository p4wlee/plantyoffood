// importo chai
const { expect } = require("chai");

/*importo sinon (sinon serve a creare ad esempio un DB finto 
per sostituire pezzi del codice durante i test, in modo da non dover utilizzare il DB vero)
*/
const sinon = require("sinon");

//importo il controller order.controller
const ordersController = require("../../../src/controllers/orders.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("addProductToOrder Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test di aggiunta prodotto ad un ordine
  it("dovrebbe aggiungere il prodotto all' ordine e restituire 201", async () => {
    // simulo request con orderId e productId
    const req = {
      params: {
        orderId: 10,
        productId: 3,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // creo stub del db
    const executeStub = sinon.stub(db, "execute");

    // prima chiamata per virificare l' esistenza dell' ordine
    executeStub.onFirstCall().resolves([[{ id: 10 }]]);
    // seconda chiamata per virificare l' esistenza del prodotto
    executeStub.onSecondCall().resolves([[{ id: 3 }]]);
    // terza chiamata per verificare che NON esista già associazione
    executeStub.onThirdCall().resolves([[]]);
    // quarta chiamata per simulazione insert (quindi per creare l' associazione ordine - prodotto)
    executeStub.onCall(3).resolves([{ insertId: 50 }]);

    // eseguo controller
    await ordersController.addProductToOrder(req, res);

    // verifico che il db sia stato chiamato 4 volte
    expect(executeStub.callCount).to.equal(4);

    // verifico risposta 201
    expect(res.status.calledWith(201)).to.be.true;

    // verifico payload restituito
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.deep.equal({
      id: 50,
      order_id: 10,
      product_id: 3,
    });
  });

  // test ordine inesistente
  it("dovrebbe restituire 404 se l' ordine non esiste", async () => {
    const req = {
      params: {
        orderId: 99,
        productId: 3,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // ordine non trovato
    executeStub.onFirstCall().resolves([[]]);

    await ordersController.addProductToOrder(req, res);

    // verifico risposta 404
    expect(res.status.calledWith(404)).to.be.true;

    // verifico che venga eseguita solo la prima query
    expect(executeStub.callCount).to.equal(1);
  });

  // test prodotto inesistente
  it("dovrebbe restituire 404 se il prodotto non esiste", async () => {
    const req = {
      params: {
        orderId: 10,
        productId: 99,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // ordine esiste
    executeStub.onFirstCall().resolves([[{ id: 10 }]]);

    // prodotto non trovato
    executeStub.onSecondCall().resolves([[]]);

    await ordersController.addProductToOrder(req, res);

    // verifico risposta 404
    expect(res.status.calledWith(404)).to.be.true;

    // verifico che si fermi alla seconda query
    expect(executeStub.callCount).to.equal(2);
  });

  // test associazione già esistente
  it("dovrebbe restituire 400 se l'associazione esiste già", async () => {
    const req = {
      params: {
        orderId: 10,
        productId: 3,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // ordine esiste
    executeStub.onFirstCall().resolves([[{ id: 10 }]]);

    // prodotto esiste
    executeStub.onSecondCall().resolves([[{ id: 3 }]]);

    // associazione già presente
    executeStub.onThirdCall().resolves([[{ order_id: 10, product_id: 3 }]]);

    await ordersController.addProductToOrder(req, res);

    // verifico risposta 400
    expect(res.status.calledWith(400)).to.be.true;

    // verifico che si fermi alla terza query
    expect(executeStub.callCount).to.equal(3);
  });

  // test errore db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      params: { orderId: 10, productId: 3 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const executeStub = sinon.stub(db, "execute");

    // simulo errore db
    executeStub.rejects(new Error("errore db"));

    await ordersController.addProductToOrder(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });
});
