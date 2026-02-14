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

describe("createOrder Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test di successo per l' ordine
  it("dovrebbe creare un nuovo ordine e restituire 201", async () => {
    // simulo req (non serve nulla nel body)
    const req = {};

    // simulo il res
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo il database
    sinon.stub(db, "execute").resolves([{ insertId: 10 }, []]);

    // eseguo la funzione
    await ordersController.createOrder(req, res);

    // verifico che status sia 201
    expect(res.status.calledWith(201)).to.be.true;

    // verifico che json sia stato chiamato una volta
    expect(res.json.calledOnce).to.be.true;

    // verifico il contenuto della risposta
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("id", 10);
    expect(responseData).to.have.property("created_at");
  });

  // test errore db
  it("dovrebbe restituire 500 se il database genera un errore", async () => {
    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo errore DB
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await ordersController.createOrder(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
