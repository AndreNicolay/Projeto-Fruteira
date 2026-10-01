using Fruteira.Data;
using Fruteira.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fruteira.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/Clientes  ou  /api/Clientes?apenasAtivos=true
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes([FromQuery] bool apenasAtivos = false)
        {
            var query = _context.Clientes.AsQueryable();

            if (apenasAtivos)
                query = query.Where(c => c.Status); // Status = 1

            return await query.OrderBy(c => c.Nome).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            cliente.Status = true; // todo cliente novo começa ativo

            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClientes), new { id = cliente.Id }, cliente);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id)
                return BadRequest("ID do cliente não confere.");

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Clientes.AnyAsync(e => e.Id == id))
                    return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
                return NotFound("Cliente não encontrado.");

            // Cliente com pedidos: inativa (Status = 0) em vez de apagar
            if (await _context.Pedidos.AnyAsync(p => p.ClienteId == id))
            {
                cliente.Status = false;
                await _context.SaveChangesAsync();
                return Ok("Este cliente possui pedidos e foi marcado como Inativo.");
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
