using Fruteira.Data;
using Fruteira.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fruteira.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        // O construtor recebe o banco de dados (AppDbContext) que configuramos no Program.cs
        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        // 1. CONSULTAR PRODUTOS (GET)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            // O .Include() faz um JOIN com a tabela Categoria para trazer os dados dela junto
            return await _context.Produtos.Include(p => p.Categoria).ToListAsync();
        }

        // 2. CADASTRAR PRODUTO (POST)
        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            // TRAVA DE SEGURANÇA: 
            // Diz para o Entity Framework ignorar o objeto Categoria e usar apenas o CategoriaId
            produto.Categoria = null;

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProdutos), new { id = produto.Id }, produto);
        }

        // 3. ALTERAR PRODUTO (PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduto(int id, Produto produto)
        {
            if (id != produto.Id)
            {
                return BadRequest("O ID da URL é diferente do ID do produto.");
            }

            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProdutoExists(id))
                {
                    return NotFound("Produto não encontrado.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 4. EXCLUIR PRODUTO (DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound("Produto não encontrado.");
            }

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método auxiliar para verificar se o produto existe
        private bool ProdutoExists(int id)
        {
            return _context.Produtos.Any(e => e.Id == id);
        }
    }
}