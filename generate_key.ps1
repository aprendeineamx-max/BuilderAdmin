$keyPath = Join-Path $PSScriptRoot "id_vps_lms"
if (Test-Path $keyPath) { Remove-Item $keyPath }
if (Test-Path "$keyPath.pub") { Remove-Item "$keyPath.pub" }
ssh-keygen -t ed25519 -f $keyPath -N ""
