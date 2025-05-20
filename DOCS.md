# Документация
## Структура проекта
- ArtSite - Основной веб проект
- ArtSite.Core - Содержит бизнес логику, интерфейсы и DTO
- ArtSite.Database - Содержит классы для работы с базой данных
- ArtSite.VK - Содержит классы для работы с API ВКонтакте
### Для добавление нового контроллера
Создать новый контроллер в папке ArtSite/Controllers

DTO которые нужны только для контроллера, нужно создавать в папке ArtSite/DTO

```csharp
namespace ArtSite.Controllers;

[Route("/api/somethings")]
[ApiController]
public class SomethingController : ControllerBase
{
    private readonly ISomethingService _somethingService;

    public SomethingController(ISomethingService somethingService) {
        _somethingService = somethingService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(Entity), StatusCodes.Status200Ok)]
    public async Task<ActionResult> GetSomething() {
        var result = await _somethingService.GetSomethingAsync();
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Entity), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateSomething([FromBody] CreateSomethingDto dto) {
        var result = await _somethingService.CreateSomethingAsync(dto);
        return CreatedAtAction(nameof(GetSomething), new { id = result.Id }, result);
    }
}
```
#### Для добавление авторизации
Необходимо добавить атрибут [Authorize] к контроллеру или методу контроллера.

Для получение авторизаванного профиля используйте службу UserService
```csharp
[Authorize]
[HttpGet]
[ProducesResponseType(typeof(Entity), StatusCodes.Status200Ok)]
public async Task<ActionResult> GetSomething() {
    Profile profile;
    try {
        profile = await _userService.GetProfileByClaims(User);
    } catch (UserException ex) {
        return BadRequest(new ProblemDetails
           {
               Detail = e.Message,
           });
    }
    return Ok(result);
}
```

##### Для проверка что пользователь является художником
Нужно также использовать службу и UserService и ArtistService
```csharp
[Authorize(Policy = "Artist")]
[HttpGet]
[ProducesResponseType(typeof(Entity), StatusCodes.Status200Ok)]
public async Task<ActionResult> GetSomething() {
    Profile profile;
    try {
        profile = await _userService.GetProfileByClaims(User);
    } catch (UserException ex) {
        return BadRequest(new ProblemDetails
           {
               Detail = e.Message,
           });
    }
    Artist artist = await _artistService.GetArtistByProfileId(profile.Id);
    return Ok(result);
}
```
