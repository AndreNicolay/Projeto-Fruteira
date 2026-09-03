console.log("api.js carregado");

const API_BASE = "http://localhost:5022/api";

const PRODUTOS_URL = `${API_BASE}/Produtos`;
const CLIENTES_URL = `${API_BASE}/Clientes`;
const PEDIDOS_URL = `${API_BASE}/Pedidos`;

//PAGINA DE PRODUTOS
//POST PRODUTOS
async function cadastrarProduto() {

    const produto = {
        nome: document.getElementById("nome").value,
        preco: Number(document.getElementById("preco").value),
        quantidadeEstoque: Number(document.getElementById("estoque").value),
        categoriaId: Number(document.getElementById("categoriaId").value)
    };

    await fetch(PRODUTOS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    carregarProdutos();
}

//GET PRODUTOS
async function carregarProdutos() {

    const response =
        await fetch(PRODUTOS_URL);

    const produtos =
        await response.json();

    const lista =
        document.getElementById("listaProdutos");

    lista.innerHTML = "";

        produtos.forEach(produto => {

            lista.innerHTML += `
                <div class="card">

                <h3>${produto.nome}</h3>

                <p>Preço: R$ ${produto.preco}</p>

                <p>Estoque: ${produto.quantidadeEstoque}</p>

                <p>Categoria: ${produto.categoria?.nome}</p>

                <button onclick="excluirProduto(${produto.id})">
                    Excluir
                </button>

            </div>
            `;
    });
}

//PAGINA CLIENTES
//POST CLIENTES
async function cadastrarCliente() {

    const cliente = {
        nome: document.getElementById("nomeCliente").value,
        cpf: document.getElementById("cpfCliente").value,
        telefone: document.getElementById("telefoneCliente").value
    };

    await fetch(CLIENTES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });

    carregarClientes();
}

//GET CLIENTES
async function carregarClientes() {

    const response =
        await fetch(CLIENTES_URL);

    const clientes =
        await response.json();

    const lista =
        document.getElementById("listaClientes");

    lista.innerHTML = "";

    clientes.forEach(cliente => {

        lista.innerHTML += `
            <div class="card">

                <h3>${cliente.nome}</h3>

                <p>CPF: ${cliente.cpf}</p>

                <p>Telefone: ${cliente.telefone}</p>

            </div>
        `;
    });
}

//PAGINA PEDIDOS
//POST PEDIDOS
async function carregarClientesSelect() {

    const response =
        await fetch(CLIENTES_URL);

    const clientes =
        await response.json();

    const select =
        document.getElementById("clienteSelect");

    select.innerHTML = "";

    clientes.forEach(cliente => {

        select.innerHTML += `
            <option value="${cliente.id}">
                ${cliente.nome}
            </option>
        `;
    });
}

//GET PEDIDOS
async function carregarProdutosSelect() {

    const response =
        await fetch(PRODUTOS_URL);

    const produtos =
        await response.json();

    const select =
        document.getElementById("produtoSelect");

    select.innerHTML = "";

    produtos.forEach(produto => {

        select.innerHTML += `
            <option value="${produto.id}">
                ${produto.nome}
            </option>
        `;
    });
}

//CRIAR PEDIDO]
async function criarPedido() {

    const pedido = {

        clienteId:
            Number(
                document.getElementById("clienteSelect").value
            ),

        produtoId:
            Number(
                document.getElementById("produtoSelect").value
            ),

        quantidade:
            Number(
                document.getElementById("quantidade").value
            )
    };

    await fetch(PEDIDOS_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(pedido)
    });

    carregarPedidos();
}

//LISTAR PEDIDOS
async function carregarPedidos() {

    const response =
        await fetch(PEDIDOS_URL);

    const pedidos =
        await response.json();

    const lista =
        document.getElementById("listaPedidos");

    lista.innerHTML = "";

    pedidos.forEach(pedido => {

        const total =
            pedido.quantidade *
            pedido.precoUnitario;

        lista.innerHTML += `

            <div class="card">

                <h3>
                    Pedido #${pedido.id}
                </h3>

                <p>
                    Cliente:
                    ${pedido.cliente?.nome}
                </p>

                <p>
                    Produto:
                    ${pedido.produto?.nome}
                </p>

                <p>
                    Quantidade:
                    ${pedido.quantidade}
                </p>

                <p>
                    Valor Unitário:
                    R$ ${pedido.precoUnitario}
                </p>

                <p>
                    Total:
                    R$ ${total.toFixed(2)}
                </p>

            </div>
        `;
    });
}
