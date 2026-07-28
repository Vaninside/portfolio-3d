<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ecc-rules -->
# Coding Rules (ECC)

Follow the ECC rulesets in `.claude/rules/ecc/`. Language-specific rules override `common/` where they conflict.

- **common/** — universal: [coding-style](.claude/rules/ecc/common/coding-style.md), [testing](.claude/rules/ecc/common/testing.md), [security](.claude/rules/ecc/common/security.md), [git-workflow](.claude/rules/ecc/common/git-workflow.md), [patterns](.claude/rules/ecc/common/patterns.md), [performance](.claude/rules/ecc/common/performance.md), [code-review](.claude/rules/ecc/common/code-review.md), [development-workflow](.claude/rules/ecc/common/development-workflow.md)
- **typescript/** — applies to `**/*.ts`, `**/*.tsx`
- **react/** — applies to components/hooks (overrides typescript + common)
- **web/** — frontend/design-quality/performance

Read the relevant ruleset before writing code in that layer.
<!-- END:ecc-rules -->
