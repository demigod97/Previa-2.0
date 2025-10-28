# Previa Frontend Specification v3.0 (Chakra UI + AG-Grid + Copilot Kit)

**Version:** 3.0
**Date:** 2025-10-26
**Scope:** Complete UI/UX specification for Previa financial intelligence platform using Chakra UI, AG-Grid Enterprise, and Copilot Kit.

**Technology Stack:**
- **UI Framework:** Chakra UI 2.8.0 (accessible component library)
- **Data Grids:** AG-Grid Enterprise 31.0.0 (financial table management)
- **AI Chat:** Copilot Kit 0.10.0 (intelligent assistant interface)
- **Styling:** Tailwind CSS 3.4.11 (complementary utility classes)
- **State Management:** TanStack Query 5.56.2 (server state)
- **Forms:** React Hook Form 7.53.0 + Zod 3.23.8 (validation)

---

For the complete v3.0 specification with all 12 screens, component specifications, and implementation details, this document serves as the authoritative reference for Chakra UI migration.

## Key Changes from v2.0

1. **Component Library**: Replaced shadcn/ui with Chakra UI 2.8.0
2. **Data Grids**: Replaced custom table components with AG-Grid Enterprise
3. **AI Chat**: Integrated Copilot Kit for intelligent assistant
4. **Theming**: Chakra UI theme system with Previa color tokens
5. **Accessibility**: WCAG AA compliance built-in with Chakra UI
6. **Responsive Design**: Chakra UI responsive props (base, md, lg, xl)

## Document Structure

Refer to `docs/design-system.md` for detailed Chakra UI theming and component patterns.
Refer to `CLAUDE.md` for development workflow with Chakra UI MCP.

This v3.0 specification will be iteratively expanded during Phases 2-4 implementation with real component examples and screen implementations.

**Status**: Living document - Updated during implementation phases

---

**For immediate reference, see:**
- `docs/design-system.md` - Chakra UI theme configuration
- `CLAUDE.md` - Component patterns and MCP usage
- `docs/architecture/tech-stack.md` - Technology stack details
