# Project Risk Register

## Active Risks

### SEC-002: xlsx Library Vulnerability (Low Priority)

**Risk Level**: Low (Score: 2)  
**Status**: Accepted Risk  
**Date Identified**: 2025-01-10  
**Affected Component**: xlsx@0.18.5 (Excel file processing)

**Description**:
The xlsx library version 0.18.5 contains two security vulnerabilities:

- Prototype Pollution (GHSA-4r6h-8v6p-xvw6)
- ReDoS (GHSA-5pgg-2g8v-p4x9)

**Business Justification**:

- Required for core financial platform functionality (bank statement imports)
- No fix available from upstream SheetJS maintainer
- Alternative Excel libraries lack feature parity needed for financial data processing
- Acceptable technical debt for MVP release

**Mitigation**:

- Monitor SheetJS security advisories for future updates
- Evaluate alternatives in future sprints if fixes become available
- Input validation on Excel file uploads to reduce attack surface

**Review Date**: Next review by 2025-04-10 or when updates become available

---

## Risk Monitoring

For active risk tracking and updates, see:

- Quality gates: `docs/qa/gates/`
- Risk assessments: `docs/qa/assessments/`