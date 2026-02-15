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

describe("updateProduct Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test aggiornamento riuscito del prodotto
  it("dovrebbe aggiornare il prodotto e restituire status 200", async () => {
    const req = {
      params: { id: 1 }, // questo sarebbe l' ID del prodotto da aggiornare
      body: { nome: "Tempeh" }, // questo è il nuovo nome
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    /*
      simulo risposta del database.
      quando UPDATE va a buon fine,
      MySQL restituisce un oggetto con affectedRows > 0
    */
    sinon.stub(db, "execute").resolves([{ affectedRows: 1 }, []]);

    // eseguo il controller
    await productsController.updateProduct(req, res);

    // verifico status 200
    expect(res.status.calledWith(200)).to.be.true;
    // verifico che json sia stato chiamato
    expect(res.json.calledOnce).to.be.true;

    // verifico il contenuto della risposta
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("id", 1);
    expect(responseData).to.have.property("nome", "Tempeh");
  });

  // test prodotto non trovato
  it("dovrebbe restituire status 404 se il prodotto non esiste", async () => {
    const req = {
      params: { id: 999 },
      body: { nome: "Tempeh" },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    /*
      simulo UPDATE che non modifica nessuna riga.
      affectedRows = 0 significa che l'id non esiste.
    */
    sinon.stub(db, "execute").resolves([{ affectedRows: 0 }, []]);

    await productsController.updateProduct(req, res);

    // deve restituire 404
    expect(res.status.calledWith(404)).to.be.true;

    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });

  // test errore db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {
      params: { id: 1 },
      body: { nome: "Seitan" },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Simulo errore DB
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await productsController.updateProduct(req, res);

    // deve restituire 500
    expect(res.status.calledWith(500)).to.be.true;

    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
