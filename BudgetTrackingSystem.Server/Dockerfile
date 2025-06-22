FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["BudgetTrackingSystem.Server/BudgetTrackingSystem.Server.csproj", "BudgetTrackingSystem.Server/"]
RUN dotnet restore "BudgetTrackingSystem.Server/BudgetTrackingSystem.Server.csproj"
COPY . .
WORKDIR "/src/BudgetTrackingSystem.Server"
RUN dotnet build "./BudgetTrackingSystem.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./BudgetTrackingSystem.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BudgetTrackingSystem.Server.dll"]
