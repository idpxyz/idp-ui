import { describe, expect, it } from 'vitest';
import { foundation } from './core';
import { semanticByTheme } from './semantic';
import { lightTheme, darkTheme } from './themes/index';
import { density } from './density';

describe('foundation tokens', () => {
  it('has space scale', () => {
    expect(foundation.space).toBeDefined();
    expect(typeof foundation.space).toBe('object');
  });

  it('space.4 is 16px', () => {
    expect(foundation.space[4]).toBe('16px');
  });
});

describe('semanticByTheme', () => {
  it('has light theme tokens', () => {
    expect(semanticByTheme.light).toBeDefined();
    expect(typeof semanticByTheme.light).toBe('object');
  });

  it('has dark theme tokens', () => {
    expect(semanticByTheme.dark).toBeDefined();
    expect(Object.keys(semanticByTheme.dark).length).toBeGreaterThan(0);
  });
});

describe('themes', () => {
  it('lightTheme is defined', () => expect(lightTheme).toBeDefined());
  it('darkTheme is defined', () => expect(darkTheme).toBeDefined());
});

describe('density', () => {
  it('has compact mode', () => {
    expect(density.compact).toBeDefined();
  });

  it('has comfortable mode', () => {
    expect(density.comfortable).toBeDefined();
    expect(density.comfortable.rowHeight).toBe('36px');
  });
});
