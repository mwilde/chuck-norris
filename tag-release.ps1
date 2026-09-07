param(
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "[OK] Chuck Norris does not version software. Software versions itself in his honor." -ForegroundColor Cyan
Write-Host ""

$branch = git branch --show-current
if ($branch -ne "main") {
    Write-Error "You must be on the 'main' branch to tag a release. Current branch: $branch"
    exit 1
}

Write-Host "[INFO] Fetching latest from origin..." -ForegroundColor Yellow
git fetch origin

$localHash  = git rev-parse HEAD
$remoteHash = git rev-parse origin/main
if ($localHash -ne $remoteHash) {
    Write-Error "Local main is not up to date with origin/main. Run 'git pull' first."
    exit 1
}

Write-Host "[BUILD] Resolving version from Nerdbank.GitVersioning..." -ForegroundColor Yellow
$buildOutput = dotnet build src/ChuckNorris.Extensions/ChuckNorris.Extensions.csproj --configuration Release --verbosity normal 2>&1

# Parse "Building version X.Y.Z from commit" line from Nerdbank output
$match = [regex]::Match(($buildOutput -join "`n"), 'Building version (\d+\.\d+\.\d+)')
if ($match.Success) {
    $tag = "v$($match.Groups[1].Value)"
    Write-Host "[INFO] Resolved version: $tag" -ForegroundColor Gray
} else {
    $commitCount = (git rev-list --count HEAD)
    $versionJson = Get-Content version.json | ConvertFrom-Json
    $baseVersion = $versionJson.version
    $tag = "v$baseVersion.$commitCount"
    Write-Host "[INFO] Resolved version from commit height: $tag" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[TAG] Version resolved: $tag" -ForegroundColor Green

$existingTag = git tag -l $tag
if ($existingTag) {
    Write-Error "Tag '$tag' already exists. Nothing to do."
    exit 1
}

if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN] Would create and push tag: $tag" -ForegroundColor Magenta
    exit 0
}

Write-Host ""
Write-Host "[PUSH] Creating and pushing tag $tag..." -ForegroundColor Yellow
git tag $tag
git push origin $tag

Write-Host ""
Write-Host "[OK] Tag $tag pushed! The NuGet publish workflow is now running." -ForegroundColor Green
Write-Host "     https://github.com/mwilde/chuck-norris/actions" -ForegroundColor Cyan