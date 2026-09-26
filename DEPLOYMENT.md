# Deploying the container

The image serves the compiled site with Nginx. Local Docker listens on port 80. Cloud Run sets `PORT` (8080), and the container listens on that port. Comments and newsletter addresses are stored in Cloud Storage when `GCS_BUCKET` is set. There is no database.

The production domain is `https://amitkumarportfolio.com`.

## Google Cloud Run

Cloud Run does not give the service its own public IP. An A record has to point at a reserved global IP on an HTTPS load balancer, which then forwards to Cloud Run. The steps below match that setup. Official reference: [Set up a global external Application Load Balancer with Cloud Run](https://cloud.google.com/load-balancing/docs/https/setting-up-https-serverless).

A global forwarding rule has a monthly charge even with little traffic. Check the current price in the Google Cloud console before you create it.

Use [Cloud Shell](https://shell.cloud.google.com) for the commands. Replace `YOUR_PROJECT_ID` with the project in your GCP account. The region `asia-south1` is Mumbai. You can change it, but the load balancer network endpoint group must use the same region as the Cloud Run service.

### 1. Put the site in GitHub

The repository [amitcloudarchitect/personalwebsite](https://github.com/amitcloudarchitect/personalwebsite) currently contains only a README. From this project folder:

```bash
git init
git add .
git commit -m "Publish the portfolio site for Cloud Run."
git branch -M main
git remote add origin https://github.com/amitcloudarchitect/personalwebsite.git
git pull origin main --allow-unrelated-histories
git push -u origin main
```

If `git remote add` says the remote already exists, skip that line. If the pull asks you to reconcile the stub README, keep this project's `README.md`.

### 2. Deploy the service

Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install), then:

```powershell
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
.\scripts\deploy-cloud-run.ps1 -Project YOUR_PROJECT_ID -SessionSecret "paste-a-long-random-string"
```

The script enables Cloud Run, Cloud Build, Artifact Registry, and Cloud Storage. It creates the bucket `amitkumarportfolio-community`, lets the Cloud Run service account read and write that bucket, and deploys the service `amit-portfolio` in `asia-south1`. The first deploy prints a `*.run.app` URL. Open that URL and confirm the site loads before you touch DNS.

Generate `SESSION_SECRET` yourself and keep it. If you omit it, signed-in sessions reset whenever Cloud Run starts a new instance.

Sign-in with Gmail, Outlook, and Facebook stays disabled until you add the provider secrets. After the apps exist, register these redirect URIs:

- `https://amitkumarportfolio.com/api/auth/google/callback`
- `https://amitkumarportfolio.com/api/auth/microsoft/callback`
- `https://amitkumarportfolio.com/api/auth/facebook/callback`

Then update the service. Do not commit these values.

```bash
gcloud run services update amit-portfolio \
  --region asia-south1 \
  --update-env-vars GOOGLE_CLIENT_ID=...,GOOGLE_CLIENT_SECRET=...,MICROSOFT_CLIENT_ID=...,MICROSOFT_CLIENT_SECRET=...,FACEBOOK_APP_ID=...,FACEBOOK_APP_SECRET=...
```

`VITE_*` profile links are baked in at image build. The image default for the public URL is `https://amitkumarportfolio.com`. To change LinkedIn or the other public links, rebuild with those build arguments.

### 3. Reserve one public IP and attach the domain

Still in Cloud Shell, after the Cloud Run service exists:

```bash
gcloud compute addresses create amit-portfolio-ip \
  --network-tier=PREMIUM \
  --ip-version=IPV4 \
  --global

gcloud compute addresses describe amit-portfolio-ip --global --format="get(address)"
```

Create a Google-managed certificate for the apex domain and `www`:

```bash
gcloud compute ssl-certificates create amit-portfolio-cert \
  --domains amitkumarportfolio.com,www.amitkumarportfolio.com
```

Connect the load balancer to Cloud Run:

```bash
gcloud compute network-endpoint-groups create amit-portfolio-neg \
  --region=asia-south1 \
  --network-endpoint-type=serverless \
  --cloud-run-service=amit-portfolio

gcloud compute backend-services create amit-portfolio-backend \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --global

gcloud compute backend-services add-backend amit-portfolio-backend \
  --global \
  --network-endpoint-group=amit-portfolio-neg \
  --network-endpoint-group-region=asia-south1

gcloud compute url-maps create amit-portfolio-url \
  --default-service amit-portfolio-backend

gcloud compute target-https-proxies create amit-portfolio-https \
  --ssl-certificates=amit-portfolio-cert \
  --url-map=amit-portfolio-url

gcloud compute forwarding-rules create amit-portfolio-https \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --network-tier=PREMIUM \
  --address=amit-portfolio-ip \
  --target-https-proxy=amit-portfolio-https \
  --global \
  --ports=443
```

Redirect plain HTTP to HTTPS on the same IP:

```bash
gcloud compute url-maps import amit-portfolio-http \
  --global \
  --source /dev/stdin <<'EOF'
name: amit-portfolio-http
defaultUrlRedirect:
  httpsRedirect: true
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
EOF

gcloud compute target-http-proxies create amit-portfolio-http \
  --url-map=amit-portfolio-http

gcloud compute forwarding-rules create amit-portfolio-http \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --network-tier=PREMIUM \
  --address=amit-portfolio-ip \
  --target-http-proxy=amit-portfolio-http \
  --global \
  --ports=80
```

### 4. DNS A records

At the registrar for `amitkumarportfolio.com`, point both names at the reserved IP from step 3. Do not point the A record at a Cloud Run URL.

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | the reserved IP |
| `www` | A | the same reserved IP |

The managed certificate stays in `PROVISIONING` until those records resolve to the load balancer. Check it with:

```bash
gcloud compute ssl-certificates describe amit-portfolio-cert --format="get(managed.status)"
```

When the status is `ACTIVE`, open `https://amitkumarportfolio.com`.

### What you do, in order

1. Push this project to `https://github.com/amitcloudarchitect/personalwebsite`.
2. Run `.\scripts\deploy-cloud-run.ps1` and confirm the `*.run.app` URL.
3. Reserve the global IP and create the load balancer with the commands above.
4. Create the two A records at your domain registrar.
5. Wait until the certificate is `ACTIVE`.
6. Add OAuth secrets only if you want Gmail, Outlook, and Facebook comments.

## Local Docker

Public links and the sitemap origin are build-time values. The public URL defaults to `https://amitkumarportfolio.com`. Pass the other arguments when you want them inside the image:

```bash
docker build -t amit-portfolio \
  --build-arg VITE_SITE_URL=https://amitkumarportfolio.com \
  --build-arg VITE_LINKEDIN_URL=https://www.linkedin.com/in/example \
  --build-arg VITE_GITHUB_URL= \
  --build-arg VITE_EMAIL= \
  --build-arg VITE_YOUTUBE_URL= \
  .
```

A local check:

```bash
docker run --rm -p 8080:80 amit-portfolio
```

Open `http://localhost:8080`. Changing `VITE_*` values later requires a new image build. Profile links can also be updated by replacing `config.json` in the served files, but the sitemap and the HTML canonical URL still come from the build.

## Azure Container Apps

These steps use the Azure CLI. Replace the resource names and region with your own. They assume an existing Azure subscription and `az login`.

1. Create a resource group and an Azure Container Registry.

```bash
az group create --name rg-amit-portfolio --location eastus
az acr create --resource-group rg-amit-portfolio --name amitportfolioregistry --sku Basic
```

The registry name must be globally unique.

2. Build the image in the registry so the machine running the command does not need a local Docker push.

```bash
az acr build --registry amitportfolioregistry --image amit-portfolio:1 \
  --build-arg VITE_SITE_URL=https://www.example.com \
  .
```

Add the other `VITE_*` build arguments from the README when you have values for them.

3. Create a Container Apps environment and the app. Ingress is external. The target port is 80, which is the port Nginx listens on inside the container.

```bash
az containerapp env create \
  --name amit-portfolio-env \
  --resource-group rg-amit-portfolio \
  --location eastus

az acr show --name amitportfolioregistry --query id --output tsv
```

Use the registry resource id from that command as `REGISTRY_ID` below. The command enables the registry admin user for a simple first deployment. For a longer-lived environment, prefer a managed identity instead of the admin account.

```bash
az acr update --name amitportfolioregistry --admin-enabled true
az acr credential show --name amitportfolioregistry

az containerapp create \
  --name amit-portfolio \
  --resource-group rg-amit-portfolio \
  --environment amit-portfolio-env \
  --image amitportfolioregistry.azurecr.io/amit-portfolio:1 \
  --registry-server amitportfolioregistry.azurecr.io \
  --registry-username amitportfolioregistry \
  --registry-password <registry-password> \
  --target-port 80 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 0 \
  --max-replicas 1
```

`--min-replicas 0` lets the app scale to zero when it is idle, which keeps a small site inexpensive. The first request after idle pays a cold start.

4. Read the public URL.

```bash
az containerapp show \
  --name amit-portfolio \
  --resource-group rg-amit-portfolio \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

5. When you attach a custom domain, set `VITE_SITE_URL` to that domain and build a new image so canonical links and `sitemap.xml` match the public address. Azure's custom domain and certificate steps are documented by Microsoft and change over time; bind the domain on the container app ingress after the app is healthy.

6. To publish a new version, run `az acr build` again with a new tag and update the container app image:

```bash
az containerapp update \
  --name amit-portfolio \
  --resource-group rg-amit-portfolio \
  --image amitportfolioregistry.azurecr.io/amit-portfolio:2
```

Runtime environment variables on the container app do not change `VITE_*` values inside the already built JavaScript. Rebuild the image when those values change.

Comments and newsletter addresses are written to `/app/data/community.json`. Attach a volume at `/app/data` if the list and the discussion should survive a new revision. Set `SESSION_SECRET` as a Container Apps secret. Sign-in credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`) are also runtime secrets. Register each provider’s redirect URI as `https://<your-domain>/api/auth/<google|microsoft|facebook>/callback`. Azure’s ingress terminates HTTPS, and the API marks the sign-in cookie Secure when `X-Forwarded-Proto` is `https`.

The same image can be deployed to Google Cloud Run or another container host. Set the container port to 80 and allow unauthenticated HTTPS ingress if the site is public.
