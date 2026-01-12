# Contributing to Ad-Tokens API

Thank you for your interest in contributing to Ad-Tokens API! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/pa-arth/AdAPI/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Python version, OS, etc.)
   - Error messages or logs (sanitized, no API keys)

### Suggesting Features

1. Check if the feature has already been suggested
2. Open an issue with the "feature request" label
3. Include:
   - Use case description
   - Proposed API changes (if applicable)
   - Benefits to developers
   - Example implementation (if possible)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Follow the architecture patterns**
   - Update `openapi.yaml` first (spec-first approach)
   - Follow vertical slices pattern
   - Keep features self-contained
   - Add proper type hints

4. **Write tests** (if applicable)
   - Add tests for new features
   - Ensure existing tests pass

5. **Update documentation**
   - Update README if needed
   - Add/update docstrings
   - Update API documentation

6. **Run code quality checks**
   ```bash
   uv run ruff format .
   uv run ruff check .
   uv run mypy src/
   ```

7. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
   - Use clear, descriptive commit messages
   - Reference issue numbers if applicable

8. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

9. **Open a Pull Request**
   - Provide clear description
   - Reference related issues
   - Request review from maintainers

## Development Setup

### Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager
- Access to LanceDB Cloud, Supabase, and OpenAI (for testing)

### Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/AdAPI.git
   cd AdAPI/api
   ```

2. Install dependencies:
   ```bash
   uv sync --dev
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Run the development server:
   ```bash
   uv run api
   ```

## Code Style

### Python

- Follow PEP 8 style guide
- Use type hints for all functions
- Use `async/await` for all I/O operations
- Keep functions focused and small
- Add docstrings for public functions

### Architecture

- **Spec-First**: Always update `openapi.yaml` before implementing
- **Vertical Slices**: Each feature in its own folder
- **Dependency Injection**: Use FastAPI `Depends` for resources
- **Type Safety**: Full type hints with Pydantic v2

### File Structure

```
api/features/{feature_name}/
├── router.py    # FastAPI routes
├── service.py   # Business logic
└── schemas.py   # Pydantic models
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests for API endpoints
- Test error cases and edge cases

## Documentation

- Update README for user-facing changes
- Add docstrings to new functions
- Update API documentation in `openapi.yaml`
- Add examples if introducing new patterns

## Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Thank you for contributing!

## Questions?

- Open an issue for questions
- Email: hello@ad-tokens.com
- Check existing documentation first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

