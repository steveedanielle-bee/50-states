# Dependency Management Recommendations for 50-States Project

## Executive Summary

This repository is currently empty, providing an excellent opportunity to establish best practices for dependency management from the start. This document outlines recommended approaches for various tech stacks and general principles to avoid security vulnerabilities, outdated packages, and unnecessary bloat.

---

## General Principles

### 1. Security-First Approach

**Automated Scanning:**
- Enable GitHub Dependabot alerts in repository settings
- Consider additional tools: Snyk, OWASP Dependency-Check, or npm audit/pip-audit
- Set up CI/CD checks that fail on high-severity vulnerabilities

**Best Practices:**
- Use lock files for all projects (package-lock.json, Gemfile.lock, poetry.lock, etc.)
- Never commit credentials or API keys
- Review dependencies before adding them (check GitHub stars, last update, maintainers)
- Prefer dependencies with active maintenance and security track records

### 2. Minimize Bloat

**Evaluation Checklist:**
- Does the standard library solve this problem?
- Is the dependency actively maintained? (Last commit within 6-12 months)
- What is the size impact? (Bundle size for frontend, install time for backend)
- How many transitive dependencies does it pull in?
- Is there a lighter alternative?

**Red Flags:**
- Packages with 50+ transitive dependencies
- Unmaintained packages (no updates in 2+ years)
- Packages that do trivial tasks (left-pad scenario)
- Multiple packages solving the same problem

### 3. Version Management

**Semantic Versioning Strategy:**
- Lock major versions in manifest files (^1.0.0, ~1.2.0)
- Use exact versions for critical infrastructure packages
- Allow minor/patch updates for security fixes
- Test updates in staging before production

**Update Cadence:**
- Security patches: Immediate
- Minor updates: Monthly review
- Major updates: Quarterly review with testing
- Document all breaking changes

---

## Technology-Specific Recommendations

### JavaScript/Node.js Projects

**Package Manager Choice:**
- **npm**: Default, widely supported, improving performance
- **yarn**: Better performance, workspaces support
- **pnpm**: Fastest, most disk-efficient, strict dependency resolution

**Essential Setup:**
```bash
# Initialize with package.json
npm init -y

# Enable strict engine checking
echo 'engine-strict=true' > .npmrc

# Add engines field to package.json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=9.0.0"
}
```

**Recommended Scripts:**
```json
"scripts": {
  "audit": "npm audit --production",
  "audit:fix": "npm audit fix",
  "outdated": "npm outdated",
  "update:interactive": "npx npm-check -u"
}
```

**Dependency Categories:**
- Keep devDependencies separate with --save-dev
- Use peer dependencies for plugins/extensions
- Consider bundleDependencies for critical packages

**Security Tools:**
- npm audit (built-in)
- Snyk CLI: `npm install -g snyk && snyk test`
- Socket.dev for supply chain security

**Bloat Prevention:**
- Use `npx` for one-time CLI tools instead of global installs
- Analyze bundle size with `npx bundlephobia <package>`
- Check tree with `npm ls --depth=0`

### Python Projects

**Package Manager:**
- **pip + venv**: Standard approach
- **poetry**: Modern, handles dependencies better
- **pipenv**: Good for application development
- **conda**: For data science with non-Python dependencies

**Essential Setup (Poetry):**
```bash
# Initialize
poetry init

# Configure virtual environment in project
poetry config virtualenvs.in-project true

# Add dependencies
poetry add <package>
poetry add --group dev <dev-package>
```

**Essential Setup (pip + venv):**
```bash
# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Create requirements files
pip freeze > requirements.txt
# Separate dev requirements
pip freeze > requirements-dev.txt
```

**Security Tools:**
- pip-audit: `pip install pip-audit && pip-audit`
- Safety: `pip install safety && safety check`
- Bandit for code security: `pip install bandit`

**Best Practices:**
- Always use virtual environments
- Pin exact versions in requirements.txt for production
- Use requirements.in with pip-compile for maintainability
- Separate test/dev/prod requirements

**Bloat Prevention:**
- Use `pipdeptree` to visualize dependency tree
- Avoid large ML libraries if not doing ML (numpy, pandas, etc.)
- Consider using built-in modules (json, csv, http, etc.)

### Ruby Projects

**Package Manager:**
- Bundler (standard)

**Essential Setup:**
```bash
bundle init
bundle config set --local path 'vendor/bundle'
```

**Gemfile Best Practices:**
```ruby
source 'https://rubygems.org'

# Pin Ruby version
ruby '3.2.0'

# Organize by purpose
group :development, :test do
  gem 'rspec'
  gem 'rubocop'
end

group :production do
  gem 'puma'
end
```

**Security Tools:**
- bundler-audit: `gem install bundler-audit && bundle audit`
- brakeman for Rails security

### Go Projects

**Package Manager:**
- Go modules (built-in)

**Essential Setup:**
```bash
go mod init github.com/username/50-states
go mod tidy
```

**Best Practices:**
- Go modules are built-in, use `go.mod` and `go.sum`
- Minimal external dependencies needed due to robust standard library
- Use `go mod graph` to visualize dependencies
- Use `go mod why <package>` to understand why a dependency exists

**Security Tools:**
- govulncheck: `go install golang.org/x/vuln/cmd/govulncheck@latest`
- nancy: Dependency vulnerability scanner

### Rust Projects

**Package Manager:**
- Cargo (built-in)

**Essential Setup:**
```bash
cargo init
```

**Best Practices:**
- Cargo.toml and Cargo.lock are standard
- Use `cargo audit` for security scanning
- Use feature flags to reduce bloat
- Cargo prevents many common dependency issues

**Security Tools:**
- cargo-audit: `cargo install cargo-audit && cargo audit`
- cargo-outdated: Check for updates

---

## Recommended CI/CD Pipeline Checks

### GitHub Actions Example

```yaml
name: Dependency Audit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    # Run weekly
    - cron: '0 0 * * 0'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Node.js example
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Security audit
        run: npm audit --audit-level=high

      - name: Check for outdated packages
        run: npm outdated || true
```

---

## Documentation Requirements

### Required Files

1. **README.md**: Document all dependencies and why they're needed
2. **SECURITY.md**: Security policy and vulnerability reporting
3. **CHANGELOG.md**: Track dependency updates and breaking changes
4. **.gitignore**: Exclude lock files if appropriate, node_modules, venv, etc.

### Dependency Documentation Template

For each major dependency, document:
- **Why**: Why is this dependency needed?
- **Alternatives**: What alternatives were considered?
- **Version**: What version constraints are set and why?
- **License**: Is the license compatible with your project?

---

## Regular Maintenance Schedule

### Weekly
- Review Dependabot/security alerts
- Apply critical security patches

### Monthly
- Run `npm outdated` / `pip list --outdated` / etc.
- Review and test minor updates
- Check for deprecated packages

### Quarterly
- Major version updates with testing
- Dependency tree analysis for bloat
- Review if all dependencies are still needed
- Update documentation

### Annually
- Complete dependency audit
- Review dependency strategy
- Update tooling and CI/CD

---

## Red Flags to Watch For

### Security
- Packages with known vulnerabilities (CVSS > 7.0)
- Packages with no security policy
- Packages from unknown/unverified publishers
- Packages requesting unusual permissions

### Maintenance
- No commits in 2+ years
- Unresolved critical issues
- No response from maintainers
- Deprecated by author

### Bloat
- Package size > 10MB for simple functionality
- 20+ transitive dependencies for small libraries
- Multiple packages solving same problem
- Unused dependencies in package.json

### Supply Chain
- Recent ownership transfer
- Unusual version jumps (1.0.0 → 10.0.0)
- New maintainers without track record
- Suspicious dependencies added

---

## Tools Summary

### Multi-Language
- **Snyk**: Commercial with free tier, supports most languages
- **OWASP Dependency-Check**: Free, open source
- **GitHub Dependabot**: Free with GitHub, automatic PRs
- **Socket.dev**: Supply chain security

### Language-Specific

**JavaScript/Node.js:**
- npm audit, yarn audit, pnpm audit
- npx bundlephobia (size checking)
- npm-check-updates (update checking)
- depcheck (find unused dependencies)

**Python:**
- pip-audit
- safety
- pipdeptree
- poetry show --outdated

**Ruby:**
- bundler-audit
- bundle outdated

**Go:**
- govulncheck
- go mod graph
- nancy

**Rust:**
- cargo-audit
- cargo-outdated
- cargo-tree

---

## Conclusion

Starting with an empty repository is an opportunity to build with best practices from day one:

1. **Choose dependencies deliberately** - Question every addition
2. **Automate security scanning** - Don't rely on manual checks
3. **Document decisions** - Future you will thank present you
4. **Regular maintenance** - Schedule it, don't wait for breaches
5. **Keep it minimal** - The best dependency is the one you don't need

The cost of adding a dependency is often underestimated. Each dependency:
- Increases security surface area
- Adds maintenance burden
- Introduces potential breaking changes
- May become unmaintained
- Increases build/install time

Choose wisely, audit regularly, and keep your dependency tree lean and secure.
