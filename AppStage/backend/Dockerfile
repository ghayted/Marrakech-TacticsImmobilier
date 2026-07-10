# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier le fichier projet et restaurer les dépendances
COPY ["backend.csproj", "."]
RUN dotnet restore "backend.csproj"

# Copier le reste du code et compiler
COPY . .
RUN dotnet publish "backend.csproj" -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Configuration pour Render (Render utilise souvent le port 8080 par défaut ou injecte $PORT)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Démarrer l'application
ENTRYPOINT ["dotnet", "backend.dll"]
