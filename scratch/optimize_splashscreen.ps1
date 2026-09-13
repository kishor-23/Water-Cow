Add-Type -AssemblyName System.Drawing

$sourcePath = "d:\Projects\WaterCow\assets\favicon.png"
$resDir = "d:\Projects\WaterCow\android\app\src\main\res"

$densities = @(
    @{ folder = "drawable-mdpi"; size = 160 },
    @{ folder = "drawable-hdpi"; size = 240 },
    @{ folder = "drawable-xhdpi"; size = 320 },
    @{ folder = "drawable-xxhdpi"; size = 480 },
    @{ folder = "drawable-xxxhdpi"; size = 512 }
)

$sourceImg = [System.Drawing.Bitmap]::FromFile($sourcePath)

foreach ($d in $densities) {
    $targetFolder = Join-Path $resDir $d.folder
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder | Out-Null
    }
    $targetPath = Join-Path $targetFolder "splashscreen_logo.png"

    $size = $d.size
    $destImg = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($destImg)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.DrawImage($sourceImg, 0, 0, $size, $size)
    $g.Dispose()

    $destImg.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destImg.Dispose()
    Write-Host "Optimized $targetPath"
}

$sourceImg.Dispose()
