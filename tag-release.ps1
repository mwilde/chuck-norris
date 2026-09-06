#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Creates and pushes a Nerdbank.GitVersioning version tag to trigger NuGet publish.

.DESCRIPTION
    Builds the project to resolve the current version via Nerdbank.GitVersioning,
    creates a git tag in the format v{Major}.{Minor}.{Patch}, and pushes it to origin.
    This triggers the NuGet publish workflow on GitHub Actions.

.EXAMPLE
    ./tag-release.ps1
    ./tag-release.ps1 -DryRun
#>
param(
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "🥋 Chuck Norris doesn't version software. Software versions itself in his honor." -ForegroundColor Cyan
Write-Host ""

# Ensure we are on main and up to date
$branch = git branch --show-current
if ($branch -ne "main") {
    Write-Error "❌ You must be on the 'main' branch to tag a release. Current branch: $branch"
    exit 1
}

Write-Host "📡 Fetching latest from origin..." -ForegroundColor Yellow
git fetch origin

$localHash  = git rev-parse HEAD
$remoteHash = git rev-parse origin/main
if ($localHash -ne $remoteHash) {
    Write-Error "❌ Local main is not up to date with origin/main. Run 'git pull' first."
    exit 1
}

# Resolve version via dotnet build output
Write-Host "🔨 Resolving version from Nerdbank.GitVersioning..." -ForegroundColor Yellow
$buildOutput = dotnet build src/ChuckNorris.Extensions/ChuckNorris.Extensions.csproj `
    --configuration Release --verbosity normal 2>&1

$versionLine = $buildOutput | Select-String "NuGetPackageVersion|AssemblyInformationalVersion" | Select-Object -First 1

# Fallback: parse from commit height
if (-not $versionLine) {
    $commitCount = (git rev-list --count HEAD)
    $versionJson = Get-Content version.json | ConvertFrom-Json
    $baseVersion = $versionJson.version  # e.g. "10.0"
    $tag = "v$baseVersion.$commitCount"
    Write-Host "ℹ️  Resolved version from commit height: $tag" -ForegroundColor Gray
} else {
    $match = [regex]::Match($buildOutput -join "`n", '(\d+\.\d+\.\d+)')
    if (-not $match.Success) {
        Write-Error "❌ Could not parse version from build output."
        exit 1
    }
    $tag = "v$($match.Value)"
}

Write-Host ""
Write-Host "🏷️  Version resolved: " -NoNewline -ForegroundColor Green
Write-Host $tag -ForegroundColor White

# Check if tag already exists
$existingTag = git tag -l $tag
if ($existingTag) {
    Write-Error "❌ Tag '$tag' already exists. Nothing to do."
    exit 1
}

if ($DryRun) {
    Write-Host ""
    Write-Host "🔍 Dry run — would create and push tag: $tag" -ForegroundColor Magenta
    exit 0
}

Write-Host ""
Write-Host "🚀 Creating and pushing tag $tag..." -ForegroundColor Yellow
git tag $tag
git push origin $tag

Write-Host ""
Write-Host "✅ Tag $tag pushed! The NuGet publish workflow is now running." -ForegroundColor Green
Write-Host "   👉 https://github.com/mwilde/chuck-norris/actions" -ForegroundColor Cyan
