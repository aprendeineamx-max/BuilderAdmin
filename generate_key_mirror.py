import subprocess
import os

key_path = os.path.abspath("id_vps_mirror")

# Generate SSH key using ssh-keygen
subprocess.run(["ssh-keygen", "-t", "ed25519", "-f", key_path, "-N", ""])
print(f"Key generated at: {key_path}")
