$packageJson = (Get-Content (Join-Path $PSScriptRoot "package.json")) -join "`n" | ConvertFrom-Json
$version = Select-Object -InputObject $packageJson -ExpandProperty "version"
$name = Select-Object -InputObject $packageJson -ExpandProperty "name"
$image = "${name}:${version}"
$imageTar = "${name}-${version}.tar"
$exportDir = Join-Path $PSScriptRoot "dist"
$exportPathAbs = (Join-Path $exportDir $imageTar)

docker inspect --type=image $image *>$null
if ($?) {
    Write-Host "`nRemoving previous image with the same name and tag: ${image}"
    docker rmi $image
}

Write-Host "`nBuilding new image";
docker build -f (Join-Path $PSScriptRoot "Dockerfile") -t $image --progress=plain --no-cache .
if (-not $?) {
    Exit 1
}

Write-Host "`nExporting image as TAR"
if (!(Test-Path -PathType Container $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir *>$null
}
docker save -o $exportPathAbs $image
if (-not $?) {
    Exit 1
}
Write-Host "`nImage TAR '${imageTar}' was created in ${exportDir}`n"

Write-Host "`nTo run an application execute these commands"
Write-Host "`n`t1. docker load -i ${exportPathAbs}"
Write-Host "`n`t2. docker run --name ${name} -p 8080:80 -d ${image}`n"