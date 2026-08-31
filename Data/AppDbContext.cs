using Fruteira.Models;
using Microsoft.EntityFrameworkCore;
using Fruteira.Models; // Lembre-se de trocar "SeuProjeto" pelo nome real do seu projeto

namespace Fruteira.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Mapeamento das tabelas
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }

        // Mapeamento exato das chaves estrangeiras (as CONSTRAINTs do banco)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 1. AVISANDO O NOME EXATO DAS TABELAS NO BANCO (Singular)
            modelBuilder.Entity<Categoria>().ToTable("Categoria");
            modelBuilder.Entity<Produto>().ToTable("Produto");
            modelBuilder.Entity<Cliente>().ToTable("Cliente");
            modelBuilder.Entity<Pedido>().ToTable("Pedido");

            // 2. Mapeamento exato das chaves estrangeiras que já tínhamos feito
            modelBuilder.Entity<Produto>()
                .HasOne(p => p.Categoria)
                .WithMany(c => c.Produtos)
                .HasForeignKey(p => p.CategoriaId);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Cliente)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(p => p.ClienteId);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Produto)
                .WithMany(pr => pr.Pedidos)
                .HasForeignKey(p => p.ProdutoId);


            base.OnModelCreating(modelBuilder);
        }
    }
}