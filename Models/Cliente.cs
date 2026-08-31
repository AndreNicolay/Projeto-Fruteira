using System.Text.Json.Serialization;

namespace Fruteira.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Cpf { get; set; }
        public string? Telefone { get; set; }

        // Propriedade de navegação
        [JsonIgnore]
        public List<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}