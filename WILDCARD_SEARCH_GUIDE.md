# 🔥 Wildcard Search Feature

## Overview

The wildcard search feature allows users to search for medications using partial patterns with `*` as placeholders for unknown characters.

## How It Works

### Usage Examples

- `A*G*M*N` → matches **Augmentin**
- `P*N*D*L` → matches **Panadol**
- `C*N*G*S*L` → matches **Congestal**
- `AM*X*C*L*N` → matches **Amoxicillin**

### Pattern Rules

1. **Minimum Characters**: At least 2 non-wildcard characters required
2. **Case Insensitive**: Works with both uppercase and lowercase
3. **Field Coverage**: Searches both trade names and active ingredients
4. **Flexible Patterns**: `*` can represent zero or more characters

### Search Priority

1. **Exact Matches** (highest priority)
2. **Wildcard Matches** (new feature)
3. **Fuzzy Matches** (fallback)

## Technical Implementation

### Wildcard Detection

```typescript
const isWildcardPattern = (query: string): boolean => {
  return query.includes("*") && query.replace(/\*/g, "").length >= 2;
};
```

### Regex Conversion

```typescript
const convertWildcardToRegex = (pattern: string): RegExp => {
  // Escape special regex characters except *
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  // Replace * with .* (any characters, zero or more)
  const regexPattern = escaped.replace(/\*/g, ".*");
  // Create case-insensitive regex
  return new RegExp(regexPattern, "i");
};
```

### Scoring Algorithm

Wildcard matches are scored based on:

- **Base Score**: Higher for trade names (0.7) vs ingredients (0.5)
- **Length Similarity**: Closer lengths get bonus points
- **Starts With Bonus**: If text starts with pattern's first part
- **Character Coverage**: How many pattern characters are in the text

## UI Features

### Visual Guidance

- **Placeholder Examples**: Shows `A*G*M*N (wildcard)` in search bar
- **Real-time Hint**: Displays usage tip when wildcard pattern detected
- **Search Type Indicator**: Console logs show "wildcard + exact" search type

### Performance

- **Optimized Search**: Runs before expensive fuzzy search
- **Early Termination**: Stops when sufficient matches found
- **Caching**: Results are cached for repeated queries

## User Experience

### When to Use Wildcards

- When you know some letters but not the complete spelling
- For brand names you partially remember
- When traditional search doesn't find what you're looking for

### Examples in Practice

1. User remembers "Aug...something...tin" → types `AUG*TIN`
2. User knows it starts with "P" and has "dol" → types `P*DOL*`
3. User recalls "Amox..." → types `AMOX*`

This feature makes medication search more intuitive and flexible for users who have partial knowledge of drug names.
