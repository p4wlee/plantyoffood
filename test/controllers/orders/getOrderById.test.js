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

describe("getOrderById Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test ordine con successo
  it("restituisce 200 e l'ordine se esiste", async () => {
    // simulo req con orderId valido
    const req = {
      params: {
        orderId: 5,
      },
    };

    // simulo res con status che ritorna this per permettere concatenazione
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // preparo un ordine finto che il database deve restituire
    const fakeOrder = {
      id: 5,
      created_at: "2026-02-14",
    };

    // stubbo db.execute e simulo risposta di MySQL
    // MySQL restituisce un array con le righe come primo elemento
    sinon.stub(db, "execute").resolves([[fakeOrder]]);

    // eseguo il controller
    await ordersController.getOrderById(req, res);

    // verifico che venga chiamato status con 200
    expect(res.status.calledWith(200)).to.be.true;

    // verifico che json venga chiamato una sola volta
    expect(res.json.calledOnce).to.be.true;

    // recupero il dato passato a json
    const responseData = res.json.firstCall.args[0];

    // verifico che il dato restituito sia l'ordine corretto
    expect(responseData).to.deep.equal(fakeOrder);
  });

  // test ordine non esistente
  it("restituisce 404 se l'ordine non esiste", async () => {
    // simulo req con orderId che non esiste
    const req = {
      params: {
        orderId: 99,
      },
    };

    // simulo res
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo risposta del database vuota
    sinon.stub(db, "execute").resolves([[]]);

    // eseguo il controller
    await ordersController.getOrderById(req, res);

    // verifico che venga restituito 404
    expect(res.status.calledWith(404)).to.be.true;

    // verifico che json venga chiamato
    expect(res.json.calledOnce).to.be.true;

    // controllo il messaggio di errore
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });

  // test errore db
  it("restituisce 500 se il database genera un errore", async () => {
    // simulo req
    const req = {
      params: {
        orderId: 1,
      },
    };

    // simulo res
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo errore di MySQL
    sinon.stub(db, "execute").rejects(new Error("errore MySQL"));

    // eseguo il controller
    await ordersController.getOrderById(req, res);

    // verifico che venga restituito 500
    expect(res.status.calledWith(500)).to.be.true;

    // verifico che json venga chiamato
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
