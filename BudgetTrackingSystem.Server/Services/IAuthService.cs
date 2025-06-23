using BudgetTrackingSystem.Data.Entities;

namespace BudgetTrackingSystem.Server.Services;

public interface IAuthService
{
    string GenerateJwtToken(User user);
}