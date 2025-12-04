# Issue Guidelines for Bite

Thank you for helping improve Bite! This guide will help you create effective issues that can be addressed quickly and efficiently.

## Table of Contents

- [Before Creating an Issue](#before-creating-an-issue)
- [Issue Types](#issue-types)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Documentation Issues](#documentation-issues)
- [Security Issues](#security-issues)
- [Issue Labels](#issue-labels)
- [Issue Lifecycle](#issue-lifecycle)

## Before Creating an Issue

### Check First

- [ ] **Search existing issues** to avoid duplicates
- [ ] **Check closed issues** for similar problems
- [ ] **Review documentation** for known solutions
- [ ] **Test with latest version** of the app
- [ ] **Reproduce the issue** consistently

### Quick Fixes

Some issues might have quick solutions:
- **App crashes**: Try restarting the app
- **API errors**: Check network connection
- **Build errors**: Clear cache with `pnpm clean`
- **Dependencies**: Run `pnpm install` to update

## Issue Types

### 🐛 Bug Reports

Issues with existing functionality that doesn't work as expected.

### ✨ Feature Requests

Suggestions for new features or enhancements to existing features.

### 📚 Documentation

Improvements or additions to documentation, README files, or code comments.

### 🔧 Technical Debt

Code refactoring, performance improvements, or maintenance tasks.

### ❓ Questions

Questions about usage, implementation, or project direction.

## Bug Reports

Use this template for reporting bugs:

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain the problem.

## Environment
- **Device**: (e.g., iPhone 12, Samsung Galaxy S21)
- **OS**: (e.g., iOS 15.0, Android 12)
- **App Version**: (e.g., 1.2.3)
- **API Version**: (e.g., 1.0.5)

## Additional Context
Any other context about the problem.

## Logs
```
Paste relevant logs here
```

## Possible Solution
If you have ideas about how to fix the issue.
```

### Bug Severity Levels

- **🔥 Critical**: App crashes, data loss, security vulnerabilities
- **🚨 High**: Major functionality broken, blocking users
- **⚠️ Medium**: Some functionality impaired, workarounds available
- **ℹ️ Low**: Minor issues, cosmetic problems

## Feature Requests

Use this template for requesting new features:

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem Statement
What problem would this feature solve? Why do you need it?

## Proposed Solution
Describe how you'd like this feature to work.

## Alternative Solutions
Any alternative solutions or features you've considered.

## User Stories
As a [type of user], I want [goal] so that [benefit].

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Design Mockups
If applicable, add mockups or wireframes.

## Technical Considerations
Any technical details or constraints to consider.

## Priority
- [ ] Critical (blocking other work)
- [ ] High (important for next release)
- [ ] Medium (nice to have)
- [ ] Low (future consideration)
```

### Feature Categories

- **🎨 UI/UX**: Interface improvements and user experience enhancements
- **🤖 AI/ML**: AI-powered features and machine learning improvements
- **📱 Mobile**: Mobile app specific features
- **🔌 API**: Backend API enhancements
- **📊 Analytics**: Data tracking and analysis features
- **🔐 Security**: Authentication and security features

## Documentation Issues

For documentation improvements:

### Documentation Template

```markdown
## Documentation Issue
What part of the documentation needs improvement?

## Current State
What's currently missing or incorrect?

## Proposed Changes
What should be added or changed?

## Affected Files
- [ ] README.md
- [ ] API documentation
- [ ] Code comments
- [ ] Contributing guidelines
- [ ] Other: ___________

## Priority
How important is this documentation update?
```

## Security Issues

**⚠️ IMPORTANT**: Do not create public issues for security vulnerabilities.

For security-related issues:
1. **Read our [Security Policy](SECURITY.md)**
2. **Email security issues** to the maintainers privately
3. **Provide detailed information** about the vulnerability
4. **Wait for confirmation** before public disclosure

## Issue Labels

### Type Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `question` - Further information is requested
- `help wanted` - Extra attention is needed
- `good first issue` - Good for newcomers

### Priority Labels
- `priority: critical` - Needs immediate attention
- `priority: high` - Important for next release
- `priority: medium` - Standard priority
- `priority: low` - Can be addressed later

### Component Labels
- `api` - Backend API related
- `mobile` - Mobile app related
- `ai` - AI/ML functionality
- `ui/ux` - User interface and experience
- `database` - Database related
- `build` - Build system and CI/CD

### Status Labels
- `status: investigating` - Issue is being investigated
- `status: in progress` - Work has started
- `status: blocked` - Cannot proceed due to dependencies
- `status: needs reproduction` - Unable to reproduce the issue
- `status: waiting for response` - Waiting for more information

## Issue Lifecycle

### 1. Submission
- Issue is created using appropriate template
- Auto-labels are applied based on content
- Maintainers are notified

### 2. Triage
- Maintainers review within 24-48 hours
- Labels are added for categorization
- Priority is assigned
- Additional information may be requested

### 3. Investigation
- Issue is reproduced and analyzed
- Technical feasibility is assessed
- Implementation approach is planned

### 4. Implementation
- Work begins on the issue
- Progress updates are provided
- Pull requests are linked

### 5. Testing
- Changes are tested thoroughly
- Feedback is gathered from stakeholders
- Adjustments are made if needed

### 6. Resolution
- Issue is closed when completed
- Solution is documented
- Follow-up actions are noted

## Writing Good Issues

### Do's
- **Be specific** with titles and descriptions
- **Provide context** and background information
- **Include relevant details** (versions, environment, etc.)
- **Use proper formatting** with Markdown
- **Attach screenshots** for UI issues
- **Follow up** with additional information if requested

### Don'ts
- **Don't create duplicates** without checking existing issues
- **Don't use vague titles** like "App broken" or "Doesn't work"
- **Don't mix multiple issues** in one report
- **Don't demand immediate fixes** without justification
- **Don't include sensitive information** in public issues

## Response Times

### Expected Response Times
- **Critical issues**: Within 4-6 hours
- **High priority**: Within 24 hours
- **Medium priority**: Within 3-5 days
- **Low priority**: Within 1-2 weeks

### Factors Affecting Response Time
- Issue complexity and scope
- Maintainer availability
- Project priorities and roadmap
- Community involvement

## Getting Faster Resolution

### Help Us Help You
- **Provide complete information** upfront
- **Respond quickly** to follow-up questions
- **Test proposed solutions** and provide feedback
- **Contribute fixes** when possible

### Community Support
- **Answer questions** from other users
- **Reproduce issues** reported by others
- **Suggest solutions** based on your experience
- **Help with testing** new features

---

Thank you for helping improve Bite! Your issues and feedback make this project better for everyone. 🎯
