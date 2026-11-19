FRESHFOLD LAUNDRY - VERCEL VERSION
Same app as your Java version, rebuilt for Vercel (Vercel cannot run Java).

STEP 1 - GET A FREE CLOUD MONGODB (Atlas) - 5 mins
Your laptop MongoDB is localhost - Vercel on the internet CANNOT reach your laptop.
So you need cloud MongoDB:
1. Go to mongodb.com/atlas > Sign up free > Create FREE M0 cluster
2. Database Access > Add User: username + password (save them!)
3. Network Access > Add IP > Allow Access From Anywhere: 0.0.0.0/0 (needed for Vercel)
4. Clusters > Connect > Drivers > Copy connection string:
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/laundry_db?retryWrites=true&w=majority
Replace USERNAME/PASSWORD with your Atlas user.

STEP 2 - PUSH TO GITHUB
In VS Code terminal in THIS folder:
  git init
  git add .
  git commit -m "laundry vercel"
  git branch -M main
Create repo on github.com, then:
  git remote add origin YOUR_GITHUB_URL
  git push -u origin main

STEP 3 - DEPLOY ON VERCEL
1. vercel.com > Add New > Project > Import your repo
2. Framework: Other / No Framework (it auto-detects)
3. IMPORTANT - Environment Variables: Add:
   Name: MONGODB_URI
   Value: your Atlas string from Step 1 (paste full mongodb+srv://...)
4. Click Deploy

You get: https://your-laundry.vercel.app - REAL, saves to Atlas MongoDB.

STEP 4 - TEST
Open your Vercel link, add an order, refresh.
Check in Atlas: Browse Collections > laundry_db > orders - your order is there.

LOCAL TEST (optional):
  npm install
  Create .env file with MONGODB_URI=...
  npx vercel dev
  Open http://localhost:3000

TROUBLESHOOTING
- 500 error / MONGODB_URI not set -> You forgot Step 3 env var, or typo. Go to Vercel > Project > Settings > Environment Variables > Add, then Redeploy.
- MongoServerError: bad auth -> Wrong username/password in Atlas string.
- Connection timeout -> You forgot Network Access 0.0.0.0/0 in Atlas.
- Page loads but orders don't save -> Check Vercel > Deployments > Logs.

YOUR JAVA VERSION STILL WORKS LOCALLY - this Vercel version is for the live link.
