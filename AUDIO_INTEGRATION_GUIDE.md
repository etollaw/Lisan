# Audio File Integration Guide

## Method 1: Manual Copy (Recommended for small collections)

### Step 1: Organize Your Files
Create this structure in your PC folder before copying:

```
YourAmharicAudio/
├── alphabets/
│   ├── ha.mp3
│   ├── la.mp3
│   ├── ma.mp3
│   └── ...
├── greetings/
│   ├── hello.mp3 (for ሰላም)
│   ├── how_are_you.mp3 (for እንዴት ናት?)
│   ├── goodbye.mp3 (for ደህና ሁን)
│   └── ...
└── numbers/
    ├── one.mp3 (for አንድ)
    ├── two.mp3 (for ሁለት)
    └── ...
```

### Step 2: Copy to Project
1. Copy your organized folders to: `C:\Users\eldad\Lisan\assets\audio\`
2. Make sure the structure matches exactly

### Step 3: Update AudioService
After copying, update the `getAudioPath` method in `app/services/AudioService.ts`

## Method 2: Bulk Processing Script

If you have many files with different names, use this PowerShell script:

```powershell
# Save this as organize_audio.ps1
param(
    [string]$SourceFolder = "C:\Path\To\Your\Audio\Files",
    [string]$DestFolder = "C:\Users\eldad\Lisan\assets\audio"
)

# Create destination folders
$categories = @("alphabets", "greetings", "numbers")
foreach ($category in $categories) {
    $categoryPath = Join-Path $DestFolder $category
    if (-not (Test-Path $categoryPath)) {
        New-Item -ItemType Directory -Path $categoryPath -Force
    }
}

Write-Host "Audio file organization script"
Write-Host "Source: $SourceFolder"
Write-Host "Destination: $DestFolder"
Write-Host ""

# Define mapping of your files to standardized names
$fileMapping = @{
    # Alphabets - map your file names to standard names
    "your_ha_sound.mp3" = "alphabets/ha.mp3"
    "your_la_sound.mp3" = "alphabets/la.mp3"
    "your_ma_sound.mp3" = "alphabets/ma.mp3"
    
    # Greetings
    "selam.mp3" = "greetings/hello.mp3"
    "indet_nat.mp3" = "greetings/how_are_you.mp3"
    "dehna_hun.mp3" = "greetings/goodbye.mp3"
    
    # Numbers
    "and.mp3" = "numbers/one.mp3"
    "hulet.mp3" = "numbers/two.mp3"
    "sost.mp3" = "numbers/three.mp3"
}

# Copy and rename files
foreach ($sourceFile in $fileMapping.Keys) {
    $sourcePath = Join-Path $SourceFolder $sourceFile
    $destRelativePath = $fileMapping[$sourceFile]
    $destPath = Join-Path $DestFolder $destRelativePath
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $destPath -Force
        Write-Host "✓ Copied: $sourceFile → $destRelativePath"
    } else {
        Write-Host "✗ Not found: $sourceFile"
    }
}

Write-Host ""
Write-Host "Done! Update the AudioService.ts file next."
```

## Method 3: Interactive File Mapper

For a more interactive approach, I can create a simple mapping tool:
