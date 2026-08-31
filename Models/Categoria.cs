using System.Text.Json.Serialization;

namespace Fruteira.Models // Troque "SeuProjeto" pelo nome real do seu projeto
{
    public class Categoria
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;

        // Propriedade de navegação (Uma categoria tem vários produtos)
        [JsonIgnore]
        public List<Produto> Produtos { get; set; } = new List<Produto>();
    }
}