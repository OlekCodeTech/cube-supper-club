"""Next 16 static export writes prefetch payloads as nested folders
(__next.t/$d$token/__PAGE__.txt) but the client requests flat names
(__next.t.$d$token.__PAGE__.txt). Copy each nested file to its flat name."""
import shutil
import sys
from pathlib import Path

out = Path(sys.argv[1] if len(sys.argv) > 1 else "out")
count = 0
for f in out.rglob("*.txt"):
    rel = f.relative_to(out).parts
    idx = next((i for i, p in enumerate(rel) if p.startswith("__next.")), None)
    if idx is None or idx == len(rel) - 1:
        continue
    flat = ".".join(rel[idx:])
    target = out.joinpath(*rel[:idx], flat)
    if not target.exists():
        shutil.copyfile(f, target)
        count += 1
print(f"flattened {count} RSC payloads")
