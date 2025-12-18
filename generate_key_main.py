import subprocess
import os

key_path = os.path.abspath("id_vps_main")
if os.path.exists(key_path):
    try:
        os.remove(key_path)
    except:
        pass
if os.path.exists(key_path + ".pub"):
    try:
        os.remove(key_path + ".pub")
    except:
        pass

print(f"Generating Main VPS key at {key_path}")
try:
    subprocess.run(["ssh-keygen", "-t", "ed25519", "-f", key_path, "-N", ""], check=True)
    print("Key generated successfully")
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
