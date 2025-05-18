using Microsoft.AspNetCore.Identity;

namespace ArtSite.Core.Exceptions;

public class UserException : Exception
{
    public enum UserError
    {
        NotFound,
        AlreadyExists,
        FieldError,
        InvalidCredentials,
    }

    public UserError ErrorType { get; }
    
    public IEnumerable<IdentityError>? Errors { get; } = null;
    
    private static string GetMessage(UserError errorType)
    {
        return errorType switch
        {
            UserError.NotFound => "User not found",
            UserError.AlreadyExists => "User already exists",
            UserError.FieldError => "Field error",
            UserError.InvalidCredentials => "Invalid credentials",
            _ => throw new ArgumentOutOfRangeException(nameof(errorType), errorType, null)
        };
    }
    
    public UserException(UserError errorType) : base(GetMessage(errorType))
    {
        ErrorType = errorType;
    }
    
    public UserException(UserError errorType, IEnumerable<IdentityError> errors) : base(GetMessage(errorType))
    {
        ErrorType = errorType;
        Errors = errors;
    }

    public UserException(string message) : base(message)
    {
    }

    public class FormErrorException : UserException
    {
        public IEnumerable<IdentityError> Errors { get; init; }

        public FormErrorException(IEnumerable<IdentityError> errors) : base("Form errors")
        {
            Errors = errors;
        }
    }

    public class NotAllowedException : UserException
    {
        public NotAllowedException() : base("Not allowed")
        {
        }
    }
}