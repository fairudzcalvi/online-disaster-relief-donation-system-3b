Here's the exact order of what to do right now:

Step 1 — Test locally first (XAMPP)

Open XAMPP → start Apache and MySQL

Go to http://localhost/phpmyadmin → drop the old bayanihan_relief database → create a new one → import the updated bayanihan_relief.sql

Open http://localhost/your-folder/ and test:

Public pages load

Campaigns load from DB

Donation form works (steps 1→2→3)

Admin login works (admin / reset password if needed)

Admin pages load data

Step 2 — Sign up for PayMongo

Go to paymongo.com → create a free account

Go to Settings → API Keys

Copy your Secret Key (sk_test_...)

Add it temporarily to api/config/database.php for local testing:

putenv('PAYMONGO_SECRET_KEY=sk_test_your_key_here'); 

Test the donation flow locally — clicking "Pay Now" should redirect to GCash/Maya test page

Step 3 — Push to GitHub

git add . git commit -m "Add PayMongo integration and full API" git push 

Step 4 — Deploy to Railway

Go to railway.app → your project

Add a MySQL plugin if not already there

Go to Variables → add:

PAYMONGO_SECRET_KEY = sk_test_your_key_here 

In the MySQL plugin → Query tab → import your bayanihan_relief.sql

Railway auto-deploys from your GitHub push — wait for it to go green

Copy your Railway public URL (e.g. https://bayanihan.up.railway.app)

Step 5 — Register PayMongo Webhook

Go to PayMongo dashboard → Webhooks → Add endpoint

URL: https://your-railway-url.up.railway.app/api/auth/paymongo_webhook.php

Events: check source.chargeable

Copy the webhook secret

Go back to Railway → Variables → add:

PAYMONGO_WEBHOOK_SECRET = whsec_your_secret_here 

Step 6 — Final test on live URL

Open your Railway URL

Do a full donation test with PayMongo test credentials:

GCash test number: 09123456789

OTP: 111111

Check phpMyAdmin on Railway — donation should appear with status verified

Check admin panel — donation should show up

Quick checklist before demo

[ ] XAMPP local test passes [ ] All admin pages load real data [ ] Campaigns show on public page [ ] PayMongo redirects correctly [ ] Webhook updates donation to verified [ ] Railway deployment is live [ ] Admin login works on live URL 

Start with Step 1 — get it working locally before touching Railway.



put this 