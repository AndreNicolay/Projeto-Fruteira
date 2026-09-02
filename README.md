#  API Fruteira

API RESTful desenvolvida em C# com .NET, Entity Framework Core e MySQL para o gerenciamento de um sistema de inventário e vendas de uma fruteira. Projeto acadêmico voltado para o controle de estoque, categorias, produtos, clientes e registro de pedidos com regras de negócio automatizadas.

##  Tecnologias Utilizadas

* **.NET 8 / ASP.NET Core Web API**
* **Entity Framework Core** (ORM)
* **Pomelo.EntityFrameworkCore.MySql** (Provedor MySQL)
* **Swagger / OpenAPI** (Documentação interativa)

---

##  Arquitetura do Projeto

* **`Models/`**: Entidades de domínio (`Categoria`, `Produto`, `Cliente`, `Pedido`) e DTOs para transferência de dados.
* **`Data/`**: Classe `AppDbContext` responsável pela configuração do contexto do banco de dados e mapeamento via Fluent API.
* **`Controllers/`**: Endpoints da API divididos em:
  * `ProdutosController`: Gerenciamento de frutas e preços.
  * `ClientesController`: Cadastro e listagem de clientes.
  * `PedidosController`: Lógica de vendas, validação de estoque, baixa automática e cálculo de valores.

---

##  Como Executar o Projeto

1. Clone o repositório para a sua máquina:
   ```bash
   git clone [https://github.com/AndreNicolay/Projeto-Fruteira.git](https://github.com/AndreNicolay/Projeto-Fruteira.git)
