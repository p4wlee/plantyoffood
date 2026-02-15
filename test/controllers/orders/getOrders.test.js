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

describe("getOrders Controller", () => {
  // questa funzione viene eseguita DOPO ogni test
  // serve a pulire gli stub per non influenzare i test successivi
  afterEach(() => {
    sinon.restore(); // ripristina tutti gli stub
  });

  // test di recupero ordini senza filtri
  it("dovrebbe restituire la lista degli ordini non filtrata e status 200", async () => {
    // simulo req senza query
    const req = {
      query: {},
    };

    // simulo res
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // preparo un array finto di ordini
    const fakeOrders = [
      { id: 1, created_at: "2026-02-14" },
      { id: 2, created_at: "2026-02-13" },
    ];

    // stubbo db.execute e simulo risposta MySQL
    sinon.stub(db, "execute").resolves([fakeOrders]);

    // eseguo il controller
    await ordersController.getOrders(req, res);

    // verifico chiamata con status 200
    expect(res.status.calledWith(200)).to.be.true;

    //verifico che json venga chiamato una volta
    expect(res.json.calledOnce).to.be.true;

    //verifico che l' array restituito sia corretto
    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.deep.equal(fakeOrders);
  });

  // test di successo con filtro productId
  it("dovrebbe applicare il filtro productId e chiamare il db con parametri corretti", async () => {
    // simulo req con filtro id
    const req = {
      query: {
        productId: 5,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    const fakeOrders = [
      {
        id: 10,
        created_at: "2026-02-14",
      },
    ];

    /* creo stub manuale per poter controllare la chiamata.
    rende il codice piu leggibile soprattutto perchè ho bisogno di due stub,
    uno per la query e uno per il parametro
    */
    const executeStub = sinon.stub(db, "execute").resolves([fakeOrders]);

    // prima chiamata: verifica esistenza prodotto
    executeStub.onFirstCall().resolves([[{ id: 5 }]]);

    // seconda chiamata: query ordini
    executeStub.onSecondCall().resolves([fakeOrders]);

    // eseguo il controller
    await ordersController.getOrders(req, res);

    // verifico che il db venga chiamato due volte
    expect(executeStub.calledTwice).to.be.true;

    // recupero query e parametri della seconda chiamata (query ordini)
    const calledQuery = executeStub.secondCall.args[0]; // secondCall perchè fa riferimento alla query ordini
    const calledParams = executeStub.secondCall.args[1]; // secondCall perchè fa riferimento alla query ordini

    // verifico che la query contenga la condizione productId
    expect(calledQuery).to.include("order_products.product_id = ?");

    // verifico che il parametro passato sia 5
    expect(calledParams).to.include(5);

    // verifico risposta 200
    expect(res.status.calledWith(200)).to.be.true;
  });

  // test nessun ordine trovato
  it("restituisce 404 se non trova ordini", async () => {
    const req = {
      query: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo risposta vuota
    sinon.stub(db, "execute").resolves([[]]);

    await ordersController.getOrders(req, res);

    // verifico che venga restituito 404
    expect(res.status.calledWith(404)).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });

  // test product non trovato
  it("dovrebbe restituire status 404 se il prodotto non esiste", async () => {
    const req = {
      query: { productId: 99 },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // creo lo stub con comportamento specifico per le diverse chiamate
    const executeStub = sinon.stub(db, "execute");

    // prima chiamata (verifica prodotto): restituisce array vuoto (prodotto non trovato)
    executeStub.onFirstCall().resolves([[]]);

    // non serve definire la seconda chiamata perché non dovrebbe mai essere eseguita

    await ordersController.getOrders(req, res);

    // Verifiche sulla risposta
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const responseData = res.json.firstCall.args[0];
    expect(responseData).to.have.property("error");

    // verifica IMPORTANTE: la seconda query NON deve essere chiamata
    expect(executeStub.calledOnce).to.be.true; // solo la prima chiamata deve eseguirsi
    expect(executeStub.calledTwice).to.be.false; // la seconda non deve avvenire
  });

  // test errore db
  it("restituisce 500 se il database genera un errore", async () => {
    const req = {
      query: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // simulo errore MySQL
    sinon.stub(db, "execute").rejects(new Error("errore MySQL"));

    await ordersController.getOrders(req, res);

    // verifico che venga restituito 500
    expect(res.status.calledWith(500)).to.be.true;

    const responseData = res.json.firstCall.args[0];

    expect(responseData).to.have.property("error");
  });
});
