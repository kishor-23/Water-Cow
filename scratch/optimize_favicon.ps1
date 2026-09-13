Add-Type -AssemblyName System.Drawing

$favPath = Join-Path (Get-Location) "assets\favicon.png"
Write-Host "Optimizing $favPath"

$src = [System.Drawing.Image]::FromFile($favPath)
$bmp = New-Object System.Drawing.Bitmap 512, 512
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$graphics.DrawImage($src, 0, 0, 512, 512)

$src.Dispose()
$graphics.Dispose()

$tempPath = Join-Path (Get-Location) "assets\favicon_opt.png"
$bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Remove-Item $favPath -Force
Rename-Item $tempPath $favPath

# Remove all duplicate image files in assets
$filesToDelete = @(
    "assets\icon.png",
    "assets\splash-icon.png",
    "assets\cowfavi.png",
    "assets\waterCowWithGlass.png",
    "assets\android-icon-foreground.png",
    "assets\android-icon-background.png",
    "assets\android-icon-monochrome.png"
)

foreach ($file in $filesToDelete) {
    $fullPath = Join-Path (Get-Location) $file
    if (Test-Path $fullPath) {
        Remove-Item $fullPath -Force
        Write-Host "Removed duplicate: $file"
    }
}

Write-Host "Done! Single asset favicon.png size: $((Get-Item $favPath).Length) bytes"
