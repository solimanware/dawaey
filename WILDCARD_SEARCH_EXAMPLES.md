# Wildcard Search Examples

## How to Use Wildcard Search

The wildcard search feature allows you to find medications using incomplete patterns with asterisks (\*) as placeholders.

### Pattern Format

- Use `*` as a wildcard to match any characters
- Minimum 3 characters required (including asterisks)
- Case insensitive matching

### Examples

#### Common Medication Patterns

1. **Augmentin** - Try these patterns:
   - `A*G*M*N` → Matches "**A**u**g**mentin"
   - `AU*MEN` → Matches "**AU**g**MEN**tin"
   - `*GMEN*` → Matches "Au**GMEN**tin"

2. **Paracetamol** - Try these patterns:
   - `P*R*C*T*M*L` → Matches "**P**a**r**a**c**e**t**a**m**o**l**"
   - `PARA*MOL` → Matches "**PARA**ceta**MOL**"
   - `*CETA*` → Matches "Para**CETA**mol"

3. **Ibuprofen** - Try these patterns:
   - `I*B*P*R*F*N` → Matches "**I**bu**p**rofen"
   - `IBU*FEN` → Matches "**IBU**pro**FEN**"
   - `*PROF*` → Matches "Ibu**PROF**en"

4. **Amoxicillin** - Try these patterns:
   - `A*M*X*C*L*N` → Matches "**A**mo**x**i**c**i**l**lin"
   - `AMO*LIN` → Matches "**AMO**xicil**LIN**"
   - `*XICI*` → Matches "Amo**XICI**llin"

### Search Indicators

When using wildcard search, you'll see:

- **Blue indicator** showing "Wildcard Search" mode
- **Pattern hint** explaining wildcard usage
- **Result count** showing matches found

### Tips for Better Results

1. **Start with key letters**: Use the first and last letters of the medication name
2. **Include distinctive sequences**: Use unique letter combinations that are less common
3. **Adjust pattern specificity**: More specific patterns give more accurate results
4. **Try different variations**: If one pattern doesn't work, try alternative letter combinations

### Technical Details

- Searches both trade names and active ingredients
- Uses regex pattern matching for efficient searching
- Prioritizes trade name matches over active ingredient matches
- Results are scored and sorted by relevance
- Maintains high performance even with complex patterns

### Fallback Behavior

If wildcard search doesn't find results, you can:

- Remove some asterisks to make the pattern less specific
- Try the regular fuzzy search by removing all asterisks
- Use exact text search for known medication names
