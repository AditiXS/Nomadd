import re

file_path = r'd:\NOMAD\src\components\IndiaPaths.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Match the export const indiaData = [ ... ]; structure
# We want to extract individual objects.
# They look like { id: "...", label: "...", d: "..." }
# However, the corruption seems to be missing }, between objects.

# Let's find all instances of { id: "
# re.finditer(r'\{\s*id:\s*"[^"]+"', content)

# I will try to split by '{ id: "' but keep it.
# Actually, let's identify where an object starts.
starts = [m.start() for m in re.finditer(r'\{\s*id:\s*"', content)]

objects = []
for i in range(len(starts)):
    start = starts[i]
    end = starts[i+1] if i + 1 < len(starts) else content.rfind(']')
    
    # Extract the chunk
    chunk = content[start:end].strip()
    
    # Try to clean the chunk. It might end with a comma or nothing.
    # We want to ensure it ends with }
    # first, remove any trailing commas or whitespace
    chunk = re.sub(r',\s*$', '', chunk)
    if not chunk.endswith('}'):
        # If it doesn't end with }, we need to find where the last "d" value ends.
        # This is tricky because "d" values are long strings of path data.
        # But usually they end with a quote.
        if '"' in chunk:
            last_quote = chunk.rfind('"')
            chunk = chunk[:last_quote+1] + ' }'
    
    objects.append(chunk)

# Now rebuild the file
new_content = 'export const indiaData = [\n\t' + ',\n\t'.join(objects) + '\n];\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Fixed {len(objects)} objects in {file_path}")
