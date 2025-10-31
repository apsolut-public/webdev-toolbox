# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing the maintainer. Please do not open a public issue.

## Recent Security Incident

**Date:** 2025-10-31

### Critical Vulnerability Removed

A malicious `preinstall.js` file was discovered and removed from this repository. The file contained obfuscated code that:

- Connected to external Solana blockchain endpoints
- Attempted to fetch and execute remote code
- Tried to exfiltrate data from the system
- Attempted to write malicious scripts to the filesystem

**Action Taken:**
1. Removed the malicious `preinstall.js` file
2. Removed the `preinstall` script hook from `package.json`
3. Enhanced `.gitignore` to prevent committing environment files

**Recommendation:**
If you have previously installed dependencies for this project, please:
1. Delete your `node_modules` folder
2. Clear your npm cache: `npm cache clean --force`
3. Pull the latest changes from the repository
4. Reinstall dependencies: `npm install`
5. Review your system for any suspicious activity

## Security Best Practices

This project follows these security practices:

### 1. No Hardcoded Secrets
- No API keys, passwords, or tokens should be committed to the repository
- Use environment variables for sensitive configuration
- All `.env` files are gitignored

### 2. Dependencies
- Regularly audit dependencies for known vulnerabilities
- Use `npm audit` to check for security issues
- Keep dependencies up to date

### 3. Client-Side Security
- This is a client-side only application with no backend
- All processing happens in the browser
- No user data is sent to external servers
- Tools like JWT decoder, hash generators work entirely offline

### 4. Information Disclosure
- Console logging of sensitive information has been removed
- Error messages do not expose internal system details

## Secure Development Guidelines

When contributing to this project:

1. **Never commit sensitive data**
   - API keys, tokens, passwords
   - `.env` files
   - Private keys or certificates

2. **Validate user input**
   - Sanitize all user inputs
   - Use proper encoding for outputs

3. **Keep dependencies updated**
   - Run `npm audit` before committing
   - Address high and critical vulnerabilities

4. **Review third-party code**
   - Be cautious with new dependencies
   - Review package source before adding
   - Use trusted, well-maintained packages

## Audit Trail

| Date       | Issue                           | Severity | Status  |
|------------|---------------------------------|----------|---------|
| 2025-10-31 | Malicious preinstall.js         | CRITICAL | Fixed   |
| 2025-10-31 | Console logging user paths      | LOW      | Fixed   |
| 2025-10-31 | Missing .env in .gitignore      | MEDIUM   | Fixed   |

## Tools Used

- **Static Analysis**: ESLint
- **Dependency Scanning**: npm audit
- **Code Review**: Manual review of all source files

## Contact

For security concerns, please contact the repository maintainer through GitHub.
