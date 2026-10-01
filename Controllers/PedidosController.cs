using Fruteira.Data;
using Fruteira.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fruteira.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        // 1. CONSULTAR TODOS OS PEDIDOS (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
        {
            return await _context.Pedidos
                .Include(p => p.Cliente)
                .Include(p => p.Produto)
                .ThenInclude(pr => pr.Categoria) // <--- Adiciona esta linha para "puxar" a categoria do produto
                .ToListAsync();
        }

        // 2. REGISTRAR UM NOVO PEDIDO / VENDA (POST)
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(PedidoCreateDto dto)
        {
            // Busca o cliente completo (não só "se existe")
            var cliente = await _context.Clientes.FindAsync(dto.ClienteId);
            if (cliente == null)
            {
                return BadRequest("Cliente não encontrado.");
            }

            // Status = 0 → cliente inativo
            if (!cliente.Status)
            {
                return BadRequest($"O cliente {cliente.Nome} está inativo e não pode fazer pedidos.");
            }

            var produto = await _context.Produtos.FindAsync(dto.ProdutoId);
            if (produto == null)
            {
                return NotFound("Produto não encontrado.");
            }

            if (produto.QuantidadeEstoque < dto.Quantidade)
            {
                return BadRequest($"Estoque insuficiente. Estoque atual de {produto.Nome}: {produto.QuantidadeEstoque} unidades.");
            }

            var pedido = new Pedido
            {
                ClienteId = dto.ClienteId,
                ProdutoId = dto.ProdutoId,
                Quantidade = dto.Quantidade,
                PrecoUnitario = produto.Preco,
                DataPedido = DateTime.Now,
                Status = true // Concluído
            };

            produto.QuantidadeEstoque -= dto.Quantidade;

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPedidos), new { id = pedido.Id }, pedido);
        }
    }
}