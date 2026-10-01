using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Fruteira.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        public string? Cpf { get; set; }
        public string? Telefone { get; set; }

        // TINYINT NOT NULL: 1 = Ativo, 0 = Inativo
        public bool Status { get; set; } = true;

        [JsonIgnore]
        public List<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}
