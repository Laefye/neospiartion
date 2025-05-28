FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["ArtSite/ArtSite.csproj", "ArtSite/"]
COPY ["ArtSite.Core/ArtSite.Core.csproj", "ArtSite.Core/"]
COPY ["ArtSite.Database/ArtSite.Database.csproj", "ArtSite.Database/"]
COPY ["ArtSite.VK/ArtSite.VK.csproj", "ArtSite.VK/"]
RUN dotnet restore "ArtSite/ArtSite.csproj"
COPY . .
WORKDIR "/src/ArtSite"
RUN dotnet build "ArtSite.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ArtSite.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ArtSite.dll"]