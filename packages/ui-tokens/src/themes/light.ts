/**
 * Light theme — assembled from semantic token light variants.
 * This file serves as the single source of truth for the light theme.
 */
import { backgroundTokens } from '../semantic/background';
import { textTokens } from '../semantic/text';
import { borderTokens } from '../semantic/border';
import { statusTokens } from '../semantic/status';
import { actionTokens } from '../semantic/action';
import { syntaxTokens } from '../semantic/syntax';

export const lightTheme: Record<string, string> = {
  ...backgroundTokens.light,
  ...textTokens.light,
  ...borderTokens.light,
  ...statusTokens.light,
  ...actionTokens.light,
  ...syntaxTokens.light,
};
