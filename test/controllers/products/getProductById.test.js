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

describe("getProductById Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test prodotto trovato
  it("dovrebbe restituire il prodotto se esiste e status 200", async () => {
    // simulo una richiesta con parametro id
    const req = {
      params: {
        id: 1,
      },
    };

    // creo un oggetto response finto
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo la risposta del database
    const fakeProduct = [{ id: 1, nome: "Tofu", created_at: "2026-02-14" }];

    /*
    Il database restituisce un array con:
    [rows, fields]
    rows sarà un array con i risultati trovati
    */
    sinon.stub(db, "execute").resolves([fakeProduct, []]);

    // eseguo il controller
    await productsController.getProductById(req, res);

    // verifico che venga restituito status 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json venga chiamato una sola volta
    expect(res.json.calledOnce).to.be.true;

    // verifico che venga restituito il prodotto corretto
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("id", 1);
    expect(responseData).to.have.property("nome", "Tofu");
  });

  // test prodotto non trovato
  it("dovrebbe restituire 404 se il prodotto non esiste", async () => {
    const req = {
      params: {
        id: 999,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo il caso in cui il database non trovi nessun prodotto
    // quindi rows sarà un array vuoto
    sinon.stub(db, "execute").resolves([[], []]);

    await productsController.getProductById(req, res);

    // in questo caso il controller dovrebbe restituire 404
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });

  //test errore del db
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

    // simulo un errore del database
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await productsController.getProductById(req, res);

    // in caso di errore interno viene restituito status 500
    expect(res.status.calledWith(500)).to.be.true;

    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
