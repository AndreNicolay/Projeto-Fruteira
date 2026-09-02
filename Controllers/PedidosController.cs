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
            var clienteExiste = await _context.Clientes.AnyAsync(c => c.Id == dto.ClienteId);
            if (!clienteExiste)
            {
                return BadRequest("Cliente não encontrado.");
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
                DataPedido = DateTime.Now
            };

            produto.QuantidadeEstoque -= dto.Quantidade;

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPedidos), new { id = pedido.Id }, pedido);
        }
    }
}