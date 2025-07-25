import { describe, it, expect, vi } from 'vitest';
import { SecurityAnalysisEngine } from '../securityAnalysisEngine';

describe('SecurityAnalysisEngine', () => {
  it('should create an instance', () => {
    const engine = new SecurityAnalysisEngine();
    expect(engine).toBeInstanceOf(SecurityAnalysisEngine);
  });

  it('should analyze code and return results', async () => {
    const engine = new SecurityAnalysisEngine();
    const mockCode = `
      const userInput = req.body.username;
      const query = "SELECT * FROM users WHERE username = '" + userInput + "'";
    `;

    const results = await engine.analyzeCode(mockCode, 'test.js');
    
    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
  });

  it('should detect SQL injection vulnerabilities', async () => {
    const engine = new SecurityAnalysisEngine();
    const vulnerableCode = `
      const query = "SELECT * FROM users WHERE id = " + userId;
      db.query(query);
    `;

    const results = await engine.analyzeCode(vulnerableCode, 'vulnerable.js');
    
    // Should detect potential SQL injection
    expect(results.length).toBeGreaterThan(0);
    const sqlInjectionIssue = results.find(issue => 
      issue.rule?.includes('sql') || issue.title?.toLowerCase().includes('sql')
    );
    expect(sqlInjectionIssue).toBeDefined();
  });

  it('should handle empty code input', async () => {
    const engine = new SecurityAnalysisEngine();
    const results = await engine.analyzeCode('', 'empty.js');
    
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });

  it('should handle invalid code gracefully', async () => {
    const engine = new SecurityAnalysisEngine();
    const invalidCode = 'this is not valid javascript {{{';
    
    // Should not throw an error
    const results = await engine.analyzeCode(invalidCode, 'invalid.js');
    expect(Array.isArray(results)).toBe(true);
  });
});