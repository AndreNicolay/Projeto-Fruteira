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
                    new MariaDbServerVersion(new Version(11, 4)), // versão do alwaysdata
                    mysqlOptions => mysqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 5,
                        maxRetryDelay: TimeSpan.FromSeconds(5),
                        errorNumbersToAdd: null)));

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseHttpsRedirection();
            }

            // USAR O CORS AQUI
            app.UseCors("Liberado");

            app.UseAuthorization();

            // Mapeamento dos controllers (antes do app.Run())
            app.MapControllers();

            app.Run();
        }
    }
}
