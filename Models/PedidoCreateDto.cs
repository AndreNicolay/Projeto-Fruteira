namespace Fruteira.Models
{
    public class PedidoCreateDto
    {
        public int ClienteId { get; set; }
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }
}