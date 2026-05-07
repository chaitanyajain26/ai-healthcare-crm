class ApplicationError(Exception):
    """Base domain error for predictable API failures."""


class AIProviderUnavailable(ApplicationError):
    """Raised when the configured LLM provider cannot complete a request."""
