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

    try {
        const response = await fetch(PRODUTOS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (!response.ok) throw new Error("Falha ao cadastrar produto");

        await Swal.fire("Sucesso!", "Produto cadastrado com sucesso.", "success");
        carregarProdutos();
    } catch (error) {
        Swal.fire("Erro!", "Não foi possível cadastrar o produto.", "error");
        console.error(error);
    }
}

// PUT DE PRODUTOS NA PAGINA PRODUTOS //
async function editarProduto(id) {
    try {
        const response = await fetch(PRODUTOS_URL);

        if (!response.ok) throw new Error("Falha ao carregar produto");

        const produtos = await response.json();
        const produto = produtos.find(item => item.id === id);

        if (!produto) throw new Error("Produto não encontrado");

        const resultado = await Swal.fire({
            title: "Editar produto",
            html: `
                <input id="editarNome" class="swal2-input" placeholder="Nome">
                <input id="editarPreco" class="swal2-input" type="number" min="0" step="0.01" placeholder="Preço">
                <input id="editarEstoque" class="swal2-input" type="number" min="0" step="1" placeholder="Estoque">
                <input id="editarCategoriaId" class="swal2-input" type="number" min="1" step="1" placeholder="ID da categoria">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Salvar alterações",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2e7d32",
            didOpen: () => {
                document.getElementById("editarNome").value = produto.nome;
                document.getElementById("editarPreco").value = produto.preco;
                document.getElementById("editarEstoque").value = produto.quantidadeEstoque;
                document.getElementById("editarCategoriaId").value = produto.categoriaId ?? produto.categoria?.id ?? "";
            },
            preConfirm: () => {
                const nome = document.getElementById("editarNome").value.trim();
                const preco = Number(document.getElementById("editarPreco").value);
                const quantidadeEstoque = Number(document.getElementById("editarEstoque").value);
                const categoriaId = Number(document.getElementById("editarCategoriaId").value);

                if (
                    !nome ||
                    !Number.isFinite(preco) ||
                    preco < 0 ||
                    !Number.isInteger(quantidadeEstoque) ||
                    quantidadeEstoque < 0 ||
                    !Number.isInteger(categoriaId) ||
                    categoriaId < 1
                ) {
                    Swal.showValidationMessage("Preencha os campos com valores válidos.");
                    return false;
                }

                return { nome, preco, quantidadeEstoque, categoriaId };
            }
        });

        if (!resultado.isConfirmed) return;

        const atualizar = await fetch(`${PRODUTOS_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                ...resultado.value
            })
        });

        if (!atualizar.ok) throw new Error("Falha ao atualizar produto");

        await Swal.fire("Sucesso!", "Produto atualizado com sucesso.", "success");
        carregarProdutos();
    } catch (error) {
        Swal.fire("Erro!", "Não foi possível atualizar o produto.", "error");
        console.error(error);
    }
}
// DELETE DE PRODUTOS NA PAGINA PRODUTOS //
async function excluirProduto(id) {
    const confirmacao = await Swal.fire({
        title: "Excluir produto?",
        text: "Essa ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33"
    });

    if (!confirmacao.isConfirmed) return;

    try {
        const response = await fetch(`${PRODUTOS_URL}/${id}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Falha ao excluir produto");

        await Swal.fire("Excluído!", "Produto removido com sucesso.", "success");
        carregarProdutos();
    } catch (error) {
        Swal.fire("Erro!", "Não foi possível excluir o produto.", "error");
        console.error(error);
    }
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

                <div class="card-actions">
                    <button onclick="editarProduto(${produto.id})">
                        Editar
                    </button>

                    <button onclick="excluirProduto(${produto.id})">
                        Excluir
                    </button>
                </div>

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

    try {

        const response = await fetch(CLIENTES_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (!response.ok) {

            Swal.fire({
                title: "Erro!",
                text: "Não foi possível cadastrar o cliente.",
                icon: "error",
                confirmButtonColor: "#d33"
            });

            return;
        }

        Swal.fire({
            title: "Sucesso!",
            text: "Cliente cadastrado com sucesso.",
            icon: "success",
            confirmButtonColor: "#2e7d32"
        });

        document.getElementById("nomeCliente").value = "";
        document.getElementById("cpfCliente").value = "";
        document.getElementById("telefoneCliente").value = "";

        carregarClientes();

    } catch (error) {

        Swal.fire({
            title: "Erro de conexão!",
            text: "Não foi possível comunicar com a API.",
            icon: "error",
            confirmButtonColor: "#d33"
        });

        console.error(error);
    }
}
// PUT DE CLIENTES NA PAGINA CLIENTES //
async function editarCliente(id) {
    try {
        const response = await fetch(CLIENTES_URL);

        if (!response.ok) throw new Error("Falha ao carregar cliente");

        const clientes = await response.json();
        const cliente = clientes.find(item => item.id === id);

        if (!cliente) throw new Error("Cliente não encontrado");

        const resultado = await Swal.fire({
            title: "Editar cliente",
            html: `
                <input id="editarClienteNome" class="swal2-input" placeholder="Nome">
                <input id="editarClienteCpf" class="swal2-input" placeholder="CPF">
                <input id="editarClienteTelefone" class="swal2-input" placeholder="Telefone">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Salvar alterações",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#2e7d32",
            didOpen: () => {
                document.getElementById("editarClienteNome").value = cliente.nome;
                document.getElementById("editarClienteCpf").value = cliente.cpf;
                document.getElementById("editarClienteTelefone").value = cliente.telefone;
            },
            preConfirm: () => {
                const nome = document.getElementById("editarClienteNome").value.trim();
                const cpf = document.getElementById("editarClienteCpf").value.trim();
                const telefone = document.getElementById("editarClienteTelefone").value.trim();

                if (!nome || !cpf || !telefone) {
                    Swal.showValidationMessage("Preencha todos os campos.");
                    return false;
                }

                return { nome, cpf, telefone };
            }
        });

        if (!resultado.isConfirmed) return;

        const atualizar = await fetch(`${CLIENTES_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                ...resultado.value
            })
        });

        if (!atualizar.ok) throw new Error("Falha ao atualizar cliente");

        await Swal.fire("Sucesso!", "Cliente atualizado com sucesso.", "success");
        carregarClientes();
    } catch (error) {
        Swal.fire("Erro!", "Não foi possível atualizar o cliente.", "error");
        console.error(error);
    }
}
// DELETE DE CLIENTES NA PAGINA CLIENTES //
async function excluirCliente(id) {
    const confirmacao = await Swal.fire({
        title: "Excluir cliente?",
        text: "Essa ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33"
    });

    if (!confirmacao.isConfirmed) return;

    try {
        const pedidosResponse = await fetch(PEDIDOS_URL);

        if (pedidosResponse.ok) {
            const pedidos = await pedidosResponse.json();
            const possuiPedidos = pedidos.some(pedido =>
                Number(pedido.clienteId) === id || Number(pedido.cliente?.id) === id
            );

            if (possuiPedidos) {
                await Swal.fire(
                    "Não é possível excluir",
                    "Este cliente possui pedidos cadastrados e não pode ser removido.",
                    "warning"
                );
                return;
            }
        }

        const response = await fetch(`${CLIENTES_URL}/${id}`, { method: "DELETE" });

        if (!response.ok) {
            const detalhe = await response.text();
            throw new Error(detalhe || `A API retornou o status ${response.status}`);
        }

        await Swal.fire("Excluído!", "Cliente removido com sucesso.", "success");
        carregarClientes();
    } catch (error) {
        Swal.fire("Erro!", error.message || "Não foi possível excluir o cliente.", "error");
        console.error(error);
    }
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

                <div class="card-actions">
                    <button onclick="editarCliente(${cliente.id})">
                        Editar
                    </button>

                    <button onclick="excluirCliente(${cliente.id})">
                        Excluir
                    </button>
                </div>

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
                ${produto.nome} | Estoque: ${produto.quantidadeEstoque}
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

    const response = await fetch(PEDIDOS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    });

    if (!response.ok) {

        const erro = await response.text();

        Swal.fire({
            title: "Não foi possível registrar a venda",
            text: erro || "Verifique os dados informados.",
            icon: "error",
            confirmButtonColor: "#d33"
        });

        return;
    }

    await Swal.fire("Sucesso!", "Venda registrada com sucesso.", "success");
    carregarPedidos();
}

//LISTAR PEDIDOS
async function carregarPedidos() {

    const response =
        await fetch(PEDIDOS_URL);

    const pedidos =
        await response.json();

    const lista = document.getElementById("listaPedidos");

    if (!lista) return;

    lista.innerHTML = "";

    pedidos.forEach(pedido => {

        const total =
            pedido.quantidade *
            pedido.precoUnitario;

        lista.innerHTML += `

            <div class="card card-pedido">

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
                    R$ ${Number(pedido.precoUnitario).toFixed(2)}
                </p>

                <p class="data-pedido">
                    Data:
                    ${new Date(pedido.dataPedido)
                        .toLocaleDateString("pt-BR")}
                </p>

                <p class="total-pedido">
                    Total: R$ ${Number(total).toFixed(2)}
                </p>
                    
                </div>
                `;
                
    });
}

// CLIENTES
if (document.getElementById("listaClientes")) {
    carregarClientes();
}

// PRODUTOS
if (document.getElementById("listaProdutos")) {
    carregarProdutos();
}

// PEDIDOS
if (document.getElementById("listaPedidos")) {

    carregarClientesSelect();
    carregarProdutosSelect();
    carregarPedidos();
}

if (document.getElementById("clienteSelect")) {

    carregarClientesSelect();
    carregarProdutosSelect();
    carregarPedidos();

}