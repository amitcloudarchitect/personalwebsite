param(
  [string]$Project = "",
  [string]$Region = "asia-south1",
  [string]$Service = "amit-portfolio",
  [string]$SiteUrl = "https://amitkumarportfolio.com",
  [string]$Bucket = "amitkumarportfolio-community",
  [string]$SessionSecret = ""
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
  throw "Install the Google Cloud SDK and run 'gcloud auth login' before this script."
}

if (-not $Project) {
  $Project = (gcloud config get-value project 2>$null).Trim()
}
if (-not $Project -or $Project -eq "(unset)") {
  throw "Set a project: gcloud config set project YOUR_PROJECT_ID"
}

Write-Host "Project: $Project"
Write-Host "Region:  $Region"
Write-Host "Site:    $SiteUrl"

gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com storage.googleapis.com --project $Project
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$bucketExists = $null
try {
  $bucketExists = gcloud storage buckets describe "gs://$Bucket" --project $Project 2>$null
} catch {
  $bucketExists = $null
}
if (-not $bucketExists) {
  gcloud storage buckets create "gs://$Bucket" --project $Project --location $Region --uniform-bucket-level-access
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$projectNumber = (gcloud projects describe $Project --format="value(projectNumber)").Trim()
gcloud storage buckets add-iam-policy-binding "gs://$Bucket" `
  --member "serviceAccount:${projectNumber}-compute@developer.gserviceaccount.com" `
  --role "roles/storage.objectAdmin" | Out-Null
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$envVars = "PUBLIC_SITE_URL=$SiteUrl,GCS_BUCKET=$Bucket"
if ($SessionSecret) {
  $envVars = "$envVars,SESSION_SECRET=$SessionSecret"
}

gcloud run deploy $Service `
  --source . `
  --project $Project `
  --region $Region `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 2 `
  --update-env-vars $envVars
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

gcloud run services describe $Service --project $Project --region $Region --format="value(status.url)"
