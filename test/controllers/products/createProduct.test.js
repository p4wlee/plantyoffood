// importo chai
const { expect } = require("chai");

/*importo sinon (sinon serve a creare ad esempio un DB finto 
per sostituire pezzi del codice durante i test, in modo da non dover utilizzare il DB vero)
*/
const sinon = require("sinon");

//importo il controller products.controller
const productsController = require("../../../src/controllers/products.controller");

// importo il database per poterlo stubbare (ossia fingere l' avvenimento di una funzione)
const db = require("../../../src/db/connection");

describe("createProduct Controller", async () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  //test creazione prodotto riuscita
  it("dovrebbe creare un prodotto e restituire 201", async () => {
    // richiesta express
    const req = {
      body: {
        nome: "Tofu",
      },
    };

    // creo un oggetto response finto
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    /* simulo la risposta del db
    insertId è l' id generato dal db */
    sinon.stub(db, "execute").resolves([{ insertId: 10 }, []]);

    await productsController.createProduct(req, res);

    // verifico che venga restituito status 201 per la creazione del prodotto
    expect(res.status.calledWith(201)).to.be.true;

    // verifico che json venga chiamato una sola volta
    expect(res.json.calledOnce).to.be.true;

    // verifico che il json restituito contenga sia l' id che il nome
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("id", 10);
    expect(responseData).to.have.property("nome", "Tofu");
    expect(responseData).to.have.property("created_at");
  });

  // test errore del db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      body: {
        nome: "Tofu",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simuliamo errore del database
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await productsController.createProduct(req, res);

    // deve restituire 500
    expect(res.status.calledWith(500)).to.be.true;

    // deve restituire JSON con errore
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
