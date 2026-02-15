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

describe("getAllProduct Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore();
  });

  // test di recupero prodotti
  it("dovrebbe restituire tutti i prodotti con status 200", async () => {
    // req non ci serve in questo caso perché non stiamo leggendo parametri o body
    const req = {};

    // creo un oggetto response finto
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo una risposta positiva del database
    const fakeProducts = [
      { id: 1, nome: "Tofu", created_at: "2026-02-13" },
      { id: 2, nome: "Tempeh", created_at: "2026-02-12" },
    ];

    /* stubbo db.execute per simulare il risultato della query
    il database normalmente restituisce un array:
    [rows, fields] */
    sinon.stub(db, "execute").resolves([fakeProducts, []]);

    // eseguo il controller
    await productsController.getAllProducts(req, res);

    // verifico che venga restituito status 200 (richiesta riuscita)
    expect(res.status.calledWith(200)).to.be.true;

    // verifico che json venga chiamato una sola volta
    expect(res.json.calledOnce).to.be.true;

    // verifico che venga restituito l'elenco dei prodotti
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.be.an("array"); // .to.be.an sta ad indicare il tipo di risultato che mi aspetto (in questo caso l' array dei prodotti)
    expect(responseData).to.be.lengthOf(2); // .to.be.lengthOf sta ad indicare l' esatta lunghezza dell' array (o eventualmente della stringa)
    expect(responseData[0]).to.have.property("nome", "Tofu");
  });

  // test nessun prodotto nel db
  it("dovrebbe restituire array vuoto se non ci sono prodotto", async () => {
    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    sinon.stub(db, "execute").resolves([[], []]);

    await productsController.getAllProducts(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.be.an("array");
    expect(responseData).to.have.lengthOf(0);
  });

  //test errore db
  it("dovrebbe restituire 500 in caso di errore del database", async () => {
    const req = {};

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo un errore del database
    sinon.stub(db, "execute").rejects(new Error("Errore DB"));

    await productsController.getAllProducts(req, res);

    // in caso di errore interno si restituisce status 500
    expect(res.status.calledWith(500)).to.be.true;

    // il controller dovrebbe restituire un oggetto JSON con errore
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
