using System.ComponentModel.DataAnnotations;

namespace Fruteira.Models
{
    public class PedidoCreateDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Selecione um cliente válido.")]
        public int ClienteId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Selecione um produto válido.")]
        public int ProdutoId { get; set; }

        [Range(1, 10000, ErrorMessage = "A quantidade deve ser entre 1 e 10000.")]
        public int Quantidade { get; set; }
    }
}
