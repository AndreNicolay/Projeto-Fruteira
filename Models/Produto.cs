using System.Text.Json.Serialization;
using Fruteira.Models;

namespace Fruteira.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal Preco { get; set; }
        public int QuantidadeEstoque { get; set; }

        // Chave estrangeira
        public int CategoriaId { get; set; }

        // Propriedade de navegação
        public Categoria? Categoria { get; set; }

        [JsonIgnore]
        public List<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}