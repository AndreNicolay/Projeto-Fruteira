using Fruteira.Models;

namespace Fruteira.Models
{
    public class Pedido
    {
        public int Id { get; set; }

        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }

        public int ProdutoId { get; set; }
        public Produto? Produto { get; set; }

        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
        public DateTime DataPedido { get; set; } = DateTime.Now;
    }
}