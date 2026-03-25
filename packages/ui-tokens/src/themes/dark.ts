/**
 * Dark theme — assembled from semantic token dark variants.
 * This file serves as the single source of truth for the dark theme.
 */
import { backgroundTokens } from '../semantic/background';
import { textTokens } from '../semantic/text';
import { borderTokens } from '../semantic/border';
import { statusTokens } from '../semantic/status';
import { actionTokens } from '../semantic/action';
import { syntaxTokens } from '../semantic/syntax';

export const darkTheme: Record<string, string> = {
  ...backgroundTokens.dark,
  ...textTokens.dark,
  ...borderTokens.dark,
  ...statusTokens.dark,
  ...actionTokens.dark,
  ...syntaxTokens.dark,
};
