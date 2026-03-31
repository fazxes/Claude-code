# claude-trace

View OpenTelemetry traces from Claude Code SDK.

## Installation

```bash
npm install -g @anthropic-ai/claude-trace
```

## Usage

```bash
claude-trace
```

Then run your SDK application with tracing enabled:

```bash
export ENABLE_BETA_TRACING_DETAILED=1
export BETA_TRACING_ENDPOINT=http://localhost:4318
```

## Documentation

See [getting_started.md](./getting_started.md) for detailed setup and API documentation.
