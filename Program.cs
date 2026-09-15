using Microsoft.EntityFrameworkCore;
using Fruteira.Data;

namespace Fruteira
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Registro dos serviços (antes do builder.Build())
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // CONFIGURAÇÃO DO CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Liberado", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(
                    connectionString,
                    ServerVersion.AutoDetect(connectionString)));

            // ... outros serviços

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Middlewares (após o build)
            app.UseHttpsRedirection();

            // USAR O CORS AQUI
            app.UseCors("Liberado");

            app.UseAuthorization();

            // Mapeamento dos controllers (antes do app.Run())
            app.MapControllers();

            app.Run();
        }
    }
}