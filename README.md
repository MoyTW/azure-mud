# Yet Another Browser Mud

![Linting and Validation Checks](https://github.com/lazerwalker/azure-mud/workflows/Linting%20and%20Validation%20Checks/badge.svg) [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com?WT.mc_id=spatial-8206-emwalker/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flazerwalker%2Fazure-mud%2Fmain%2Fserver%2Ftemplate.json)

This is a playful text-based online social chat space. You can think of it as a hybrid between communication apps like Slack and Discord and traditional text-based online game spaces such as MUDs and MOOs.

It was primarily built for [Roguelike Celebration 2020](https://roguelike.club), but can hopefully be repurposed for other events or communities.

On the backend, it's powered by a serverless system made up of Azure Functions, Azure SignalR Service, and a Redis instance (currently provided by Azure Cache for Redis).

On the frontend, it's a rich single-page webapp built in TypeScript and React, using the Flux architecture via the `useContext` React hook.

[This article](https://dev.to/lazerwalker/using-game-design-to-make-virtual-events-more-social-24o) provides some insight into the design principles underlying this project.

## Setting up a development environment

In context of Roguelike Celebration, we think of this project as being composed of three different parts: the frontend, the backend, and the content.

- To contribute to the frontend, you can just follow the "frontend dev" instructions.
- To contribute to the backend, you will need to set up your own backend dev instance (the full set of instructions below)
- To contribute to content, you do not need to do local developer setup. Ask a friendly volunteer how to get you set up with the browser-based CMS.

### Content Dev

There is a browser-based "level editor" / CMS located at `/admin/index.html` for a valid instance (e.g. `https://chat.roguelike.club/admin/index.html`). To access the CMS, you will need to be an admin in that instance. Ask an existing admin, or see instructions at the end of this README if you're setting up your own instance.

There's no public docs yet for this editor tool, but hopefully it should be relatively self-explanatory given an understanding of our room format (which I think also sadly isn't documented, but will look familiar to those who have used Twine).

### Frontend Dev

1. Clone this repo

2. Run `npm install`

3. `npm run dev` will start a local development environment (at `http://localhost:1234/index.html` by default). It auto-watches changes to HTML, CSS, and JS/TS code, and attempts to live-reload any connected browser instances.

4. `npm run build` will generate a bundled version of the webapp for distribution.

5. Do note that your frontend installation will not work until you have properly set up Firebase authentication and pointed it at a valid server backend (all via a `.env` file locally, or via GitHub repository secrets if you're deploying via our GH Actions workflows). If you are on the Roguelike Celebration organizing team, get in touch with us and we can give you credentials for an existing server instance (either staging/prod or dev, as appropriate). Otherwise, you will need a valid backend as well as API keys for a valid Firebase authentication account (see next section for setup)

This repo is set up to automatically deploy to Azure Static Web Apps when code is merged into main (see "Deploying new Changes via GitHub Actions" below for how to finish configuring that for your fork). If you want to host your frontend elsewhere, that's totally fine too! You can serve the asset bundle generated by `npm run build` anywhere, although it will need the correct secrets injected and also must be served over SSL/HTTPS.

### Backend Dev

After cloning this repo, the `server` directory contains all of the backend code. You may want to run `npm install` within the `server` directory to pull in dependencies for IDE autocompletion and such.

However, you cannot actually run the backend locally. You'll need to deploy your own server instance of the backend to test changes.

## Deploying This Project

Currently, this project only runs on Azure. This requires your own [Azure subscription](https://azure.com/free/?WT.mc_id=spatial-8206-emwalker).

If you don't already have an Azure account/subscription, you'll get a few hundred bucks of credits to use your first month, but if that's not the case you will want to keep an eye on the fact that **running this backend will cost you actual money**.

**If you are a Roguelike Celebration volunteer**: I apologize if this looks extremely daunting! I promise it's not a lot of work -- it 90% consists of "click a link to automatically deploy a bunch of Azure stuff, then shuffle around some secret keys into GitHub Actions and a local .env file, then make a single Firebase config change".

### Deploying via ARM Template

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/?WT.mc_id=spatial-8206-emwalker#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flazerwalker%2Fazure-mud%2Fmain%2Fserver%2Ftemplate.json)

The easiest way to deploy a backend is to use the template we have prepared. Going to [this link](https://portal.azure.com/?WT.mc_id=spatial-8206-emwalker#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flazerwalker%2Fazure-mud%2Fmain%2Fserver%2Ftemplate.json) will allow you to deploy a server backend to an Azure resource group you specify that will have everything configured, but won't actually contain code yet.

This ARM template asks you to plug in a GitHub Personal Access Token (PAT), which you can generate by going to https://github.com/settings/tokens while logged into GitHub. You want to create a "classic" token, with access to all "repo" and "workflow" permissions. I recommend making it short-lived (e.g. only valid for 7 days), as you will not need it after initial deployment.

After completing ARM template deployment, there are still a few things you need to manually configure before the app will function.

#### Adding WebPubSub
You need to add the proper connection string to your functions app. This should probably be in the template, but for now, follow these steps:

1. Go into your WebPubSub resource in the Azure portal and get the connection string from WebPubSub service "Keys" on the left
2. Go to your functions app in the Azure portal and hit "Configuration" -> "New application setting" 
3. Add a new key with "WebPubSubConnectionString" with that value
4. Hit save

#### Deployment: If you're a Roguelike Celebration volunteer
If you are a volunteer working on the core Roguelike Celebration space, you can use our development Firebase account. If you do not plan to deploy your frontend anywhere (i.e. you will just access it at `localhost`, you do not need to do steps beyond 2.

1. In the shared password manager, find the entry for "Dev Firebase"
2. In your GitHub repo, add Repository Secrets (Settings -> Secrets -> New Repository Secret) containing each field from the password manager entry. You should name these Secrets `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID`, and `FIREBASE_SERVER_JSON`, the latter of which should contain the entire text of the attached JSON file.
3. If you'd like to test your frontend locally via `localhost`, you need to add this locally via a `.env` file. In a local copy of the repo, rename `.env.sample` to `.env` and replace the dummy values with the appropriate real data.
4. Go to the Firebase Console (https://console.firebase.google.com/), logging in as the shared account.
5. Create one more GitHub Actions repository secret, called `SERVER_HOSTNAME`, containing the URL to your own Function App instance (the Azure URL for your backend — typically `https://your-project.azurewebsite.net`, where `your-project` is the project name you entered when deploying the Azure ARM template). Do the same thing to your local `.env` file as appropriate.
6. Since you're using the shared dev Firebase account, you'll need to tell Firebase to allow your publicly-hosted dev frontend. Log into Firebase as the shared account, and select the "Roguelike Celebration dev" project.
7. Select "Build" and then "Authentication" from the left-side menu, then "Settings" and "Authorized domains" from the main pane
8. Click "add domain", enter the domain where your deployed dev frontend will live, and click "add". If you set up a custom domain, use that. If you don't know what this URL is, go to the Azure Portal, find the Static Web Apps instance in your project's resource group, and enter the URL it gives you. It's usually something along the lines of `https://[adjective]-[noun]-[hexadecimal numbers].azurestaticapps.net`.

From here, you will still need to deploy your backend server code, and likely deploy your frontend to the public web as well. Jump down to "Deploying new Changes via GitHub Actions" to continue setting up automatic deployments on git push.

#### Deployment: Setting up your own non-Roguelike Celebration instance

1. You will need to set up Firebase. This is a bit annoying.
    1. Create a new Firebase project. To do this, follow steps 1, 3, and 5 in the setup guide here: <https://firebase.google.com/docs/web/setup#create-project>. Make sure the title is appropriate for display, since by default that's what will go in the confirmation emails.
    2. Register your app with the Firebase project you just created. To do this, follow steps 1-3 here: <https://firebase.google.com/docs/web/setup#register-app>
    3. Set up the client
        1. Go to the General tab in the Settings section for your new project
        2. In your GitHub repo, add repository Secrets (Settings -> Secrets -> New Repository Secret) for all of the values set in the `firebaseConfig` object of the JS config snippet. You should have Secrets titled `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, and `FIREBASE_APP_ID`.
        3. By default, these secrets will be injected into your webapp when GitHub Actions builds and deploys your front-end, but that means they won't work if you're running a local dev server. To enable Firebase login on your local dev server, copy the `.env.sample` file to one named `.env`, and then replace the fake sample values for each key with the appropriate actual values you also stored as GitHub Secrets.
    4. Set up the server
        1. Generate and download a private key file for your new project as instructed here: <https://firebase.google.com/docs/admin/setup#initialize-sdk>
        2. Create a new GitHub repository secret (Settings -> Secrets -> New Repository Secret) whose key is `FIREBASE_SERVER_JSON` and whose value is the entire text of the downloaded JSON file.
        3. You may also want to move the downloaded JSON file to `server/firebase-admin.json`. This file will by default not be tracked by git (and we don't recommend you commit it), but you will need this file to be present if you wish to deploy the backend via CLI or VS Code instead of GitHub Actions (see "Deploying new Changes" sections below)
    5. Go to the `Firebase console` -> `Authentication` -> `Sign-in method` and enable the providers as desired (we currently support email and Google) by following the instructions in each provider's section. For a dev setup, `Email/Password` should be sufficient.
    1. To enable email, you must:
        1. Check the `Email link (passwordless sign-in)` button.
        2. Add your server domain to the `Authorized domains` section beneath the providers list.
    2. Google is simple, just add the provider.

2. You'll need to modify the frontend to actually use your new backend! Add a new GitHub Repository Secret (Settings -> Secrets -> New Repository Secret) named `SERVER_HOSTNAME` that contains the URL to your own Function App instance (the Azure URL for your backend — typically `https://your-project.azurewebsite.net`, where `your-project` is the project name you entered when deploying the Azure ARM template). For local client development, you'll also need to add this to your local `.env` file. This should hopefully be set up from configuring Firebase, but if not you can rename `.env.sample` to `.env` and make that change.

3. Finally, you need to actually deploy the backend code before everything will work. You have three main options (below), but after doing this you should have a working app!

### Deploying new Changes via GitHub Actions

By default, when someone goes into the GitHub Actions tab of the main azure-mud repo and runs the "Production build and deploy" action, it builds and deploys the frontend and backend. It's very little work to configure this same behavior to make your GitHub fork deploy to yoru dev instance (and you should do this if you're a Roguelike volunteer).

1. Add a GitHub Repository Secret (Settings -> Secrets -> Add Repository Secret) with the key `AZURE_FUNCTION_APP_NAME` whose value is your Azure app name. Follow [these instructions](https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-github-actions?WT.mc_id=spatial-8206-emwalker) to generate a publish profile and add that as a GH Secret titled `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`.

2. Go to the "Actions" tab of your repo, and click the button to enable the preexisting forked Actions in your project.

3. Optionally, the GitHub Action workflow will send a webhook to the server when a new deployment has completed, which allows us to notify connected clients that a new browser app has been deployed and they should refresh the page. To enable this, create a random string to use as a token (we recommend running `uuidgen` on a Mac or a Linux machine). Store it as a GitHub Repository Secret (Settings -> Secrets -> Add Repository Secret) under the key `DEPLOY_WEBHOOK_KEY`. Also store it as an ENV variable in the Azure Functions App (while viewing the Function App in the Portal, Configuration -> New Application Setting) under the key `DEPLOY_WEBHOOK_KEY`. Now, if you have your frontend open when you deploy via GitHub Actions, you should see a pop-up in the frontend instructing you to refresh.

If you select the "Production Build and Deploy" workflow in your Actions tab, you can then click "Run Workflow" and start a new deploy. If you refresh the page, you can click on the new run to see real-time progress.

After this succeeds, both your frontend and backend services should be live. You can find the URL for your frontend by finding your Azure Static Web Apps resource within the created resource group in the Azure Portal. You will also need to either set up a custom domain for Azure Static Web Apps, or if this is the URL you will use, go into Firebase and add this URL as an Authorized Domain for auth ("Build" and then "Authentication" from the left-side menu, then "Settings" and "Authorized domains" from the main pane).

(If you are working on your own project rather than contributing to Roguelike Celebration, I'd recommend modifying these workflows to auto-deploy on push. It's trickier for Roguelike Celebration, since this is the CI setup for our main branch and it's annoying to have your local workflow files out-of-sync with the main repo. I'm thinking through solutions, potentially involving GitHub's "environments" feature)

**To verify your setup, you should have the following repository secrets:**
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` (the full text of a file downloaded from the Function App page on the Azure Portal) 
- `AZURE_FUNCTION_APP_NAME`
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (automatically generated on ARM template deploy, you do not need to create this)
- `FIREBASE_API_KEY` (from password manager)
- `FIREBASE_APP_ID` (from password manager)
- `FIREBASE_AUTH_DOMAIN` (from password manager)
- `FIREBASE_MESSAGING_SENDER_ID` (from password manager)
- `FIREBASE_PROJECT_ID` (from password manager)
- `FIREBASE_SERVER_JSON` (file contents from password manager)
- `FIREBASE_STORAGE_BUCKET` (from password manager)
- `SERVER_HOSTNAME` (typically `https://azure_function_app_name.azurewebsites.net`)

#### Deploying new Changes via VS Code

If you use VS Code as an IDE, the Azure Functions extension makes it extremely easy to deploy directly from there. Check out [this tutorial](https://docs.microsoft.com/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript&WT.mc_id=spatial-8206-emwalker) for more info.

VS Code will likely get confused if your active project is the root of your fork — we recommend explicilty opening the "server" directory in VS Code and deploying from there.

You will also need to make sure there is a `firebase-admin.json` file in the `server` directory.

#### Deploying new Changes via CLI

If you have the [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local&WT.mc_id=spatial-8206-emwalker) installed, you can run `func azure functionapp publish [project name]` to deploy directly from the CLI.

You will also need to make sure there is a `firebase-admin.json` file in the `server` directory.

### Costs and Scaling

For development purposes, you can use the free tier of both SignalR Service and Azure functions, you just need to pay for a small Redis instance (~$15/month). As mentioned, if you're a new Azure user, you'll get more than enough free credits to cover hosting this for your first month.

To get this ready for production use, all you need to do is scale up your SignalR Service usage tier. Running this project with a single SignalR unit (good for up to 1,000 concurrent users) will cost you roughly $2.50 per day, with each additional SignalR unit (another 1,000 concurrents) adding roughly an additional $1.50 per day. These numbers are all rough ballpark figures.

Other than managing SignalR units, you won't need to worry about adjusting capacity in order to scale. Azure Functions charges you based on usage, and it's extremely unlikely you'll need to scale up Redis unless you have tens of thousands of concurrent users. At Roguelike Celebration, with an average of around 300 concurrent users, we never hit more than a few hundred kilobytes of Redis data or used even 1% of our processing power.

### Manual Deployment Instructions

If you would prefer to not use the ARM template above, here is how you can manually configure a set of Azure resources to run this project.

1. Deploy the project to a new Azure Function App instance you control. I recommend using VS Code and the VS Code Azure Functions extension. See the "Publish the project to Azure" section of [this tutorial](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript?WT.mc_id=spatial-8206-emwalker) for details. You can also use the Azure CLI or any other method.

2) In the Azure Portal, sign up for a new [Azure SignalR Service](https://docs.microsoft.com/en-us/azure/azure-signalr/signalr-overview?WT.mc_id=spatial-8206-emwalker) instance. For development purposes, you can probably start with the free tier.

3) Grab the connection string from your Azure SignalR Service instance. Back in the settings for your Function App, go to the Configuration tab and add a Application Setting with the key `AzureSignalRConnectionString`

4) Set up an [Azure Cache for Redis](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-overview?WT.mc_id=spatial-8206-emwalker) instance. Again, the cheapest tier is likely acceptable for testing purposes. You could theoretically use an alternative Redis provider, as nothing about our use is Azure-specific, but I have not tried this.

5) As above, you want to take your Redis access key, the hostname, and the port, and add them as Application settings to the Function App with the keys `RedisKey` and `RedisHostname`, `RedisPort`.

6) Set up CORS in the Azure Portal page for the Function app. There's a "CORS" menu item on the left. Allow `http://localhost:1234` for local development, as well as whatever URLs you're using for a production version of the frontend.

7) In `src/config.ts` in this repo, update the hostname to point to your own Function App instance (the Azure URL for your backend, NOT wherever you're hosting the app's frontend).

## Deployment and CI/CD via GitHub Actions

In addition to the production/staging deploys (which, as mentioned, run manually and on main push, respectively, the "lint" workflow runs on every open PR and on every commit to main. It checks (a) whether the code passes a TypeScript compilation/typecheck step, (b) whether all your room description links are valid (see below), and (c) whether the front-end code passes accessibility best standars (via [axe linter](https://axe-linter.deque.com/))/.

You can naturally disable this if you'd prefer.

## Designing your own space

This project is open-source, and currently includes the scripting code for the space we used at Roguelike Celebration. However, we would ask that you design your own event space on this platform, rather than using Roguelike Celebration's space (room descriptions, map, etc). Fortunately, it's easy to customize the space!

Rooms are currently defined in `server/src/rooms`. Each room definition is a JSON object containing its description and other information; check the definitions in `server/src/rooms/index.ts` for an example there. The list of rooms in that file is definitive, but you can also see there how to define a room in an external file and link it in.

Within room descriptions, this project uses a custom Twine-like syntax for links.

* A link to a `[[room]]` will link directly to a room whose `id` is `room`.
* A link to `[[another room->someOtherRoom]]` will display the text "another room" but link to the room whose `id` is `someOtherRoom`
* A link that looks like it links to the `id` "item" (e.g. `[[a heavy book->item]]`) will result in the player picking up that item, so long as that item string is an exact match in the list in `server/src/allowedItems.ts`.
* Links can also trigger client-side code if the link `id` refers to a function in the client-side `src/linkActions` object. As an example, `[[Get a random food item->generateFood]]` will trigger the `generateFood` function that in turn assigns the player an inventory object that is a procedurally-generated piece of food.

There is an automated script to validate that none of your links are broken (i.e. all room links go to valid room IDs, all linked items are in the allowed item list, and all client-side functions actually exist). You can run this by typing `npm run lint-rooms` in the main project directory, and it also runs automatically on PRs if you have the default GitHub Actions running.

Links between rooms are purely visual. If an attendee is moving rooms using the map or the `/move` command, they can move to any room at any time. It's still best practice to include links to "nearby" rooms (matching your visual map) to help users navigate the space.

Right now, because room descriptions are part of the server codebase, changing room data requires redeploying the entire server backend. Changing that is a high development priority.

## Editing the map

TODO: These instructions are slightly out-of-date. The map used for Roguelike Celebration 2021 was drawn using Playscii, but the thing that really needs to be documented is the supplemental data you need to add to inject active room counts and set up click/scroll targets. Check out `src/components/MapView.tsx` for more info until this is properly documented.

Outdated info: The ASCII map was created with [MonoDraw](https://monodraw.helftone.com), a Mac-only ASCII art tool. You'll want to open the `map.monopic` file in that, export your changes, paste the ASCII string into `src/components/MapView.tsx`, and then update any changes to the two datasets of persistence identifiers and clickable areas.

## Adding a Mod

A moderator has the ability to make any other user a mod by clicking their username and choosing the appropriate option in the space. By default, the first user who creates a user account will become a mod. However, if something gets messed up and you need to do this manually, here's how to add a mod directly to the database:

1. Find the user ID of the user you want to make a mod. In the space, if you open your browser's development tools and go to the network inspector, and then click their name (including your own name in the top-left corner if you want to mod your own user) and "view profile", you will see a HTTP request to `/fetchProfile` that contains the userId in JSON as the request payload.

2. Go to your Redis instance in the Azure Portal. Click the "Console" button at the top-left of the main pane.

3. In the Redis terminal, type `sadd mods [userId]` (swapping in the user ID you fetched earlier, without square brackets).

If that user reloads the space, they will now be a mod and have the ability to add other mods.

## Contributions

If you're looking to get involved: awesome! There's a "Good First Issue" tag in this repo's GitHub Issues that may point you towards something. If you want to work on something, it might be nice to comment that you're looking into it in case others are already working on it or were thinking about it.

Fork this repo, make your changes, open a pull request! Once you've contributed, I'm fairly liberal with granting people contributor access, but the `main` branch is still locked.

Pull requests are run through a few automated checks. If the `ESLint` checks fail, first try running `npm run lint-fix` to try to automatically fix as many of the errors as you can; anything that doesn't catch will need to be fixed manually.

# TODO: Firebase 2024 issue

for future: https://github.com/firebase/quickstart-js/blob/master/auth/README.md
will try #3 from here: https://firebase.google.com/docs/auth/web/redirect-best-practices#web_1
how to enable proxies: https://learn.microsoft.com/en-us/azure/azure-functions/legacy-proxies#re-enable-proxies-in-functions-v4x

TODO: Add to README note on adding feature flags
+ Add AzureWebJobsFeatureFlags with a value of EnableProxies
(done on my dev, not on prod, TODO that)

NOTE THAT THIS WILL TURN OFF 2025 soooo good luck to me then
maybe look at this https://demiliani.com/2022/12/27/are-you-using-proxies-with-azure-functions-start-moving-to-azure-api-management/

Notes:
+ I changed the .env to match server_hostname (dev-2023-2.azurewebsites.net)

## Issue: invalid OAuth redirect
+ ok once you change the proxies file AND change the .env file (AND change the FIREBASE_AUTH_DOMAIN) you'll try to log in and get this:

Error 400: redirect_uri_mismatch

You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.

If you're the app developer, register the redirect URI in the Google Cloud Console.
Request details: redirect_uri=https://dev-2023-2.azurewebsites.net/__/auth/handler flowName=GeneralOAuthFlow
GO TO: https://console.cloud.google.com/apis/credentials?pli=1&project=roguelike-celebration-dev
  - Under OAuth 2.0 Client IDs add in the redirect sections at the bottom https://<FIREBASE_AUTH_DOMAIN>/__/auth/handler
  - I also added it to the JS URIs just for good measure
  - idk why there are 2 of 'em I just added to both
  - wait like 2 hours I guess!?

  FIREBASE_AUTH_DOMAIN=dev-2023-2.azurewebsites.net

NOTE: I can't seem to develop locally I'm gonna try pushing it to my repo
  - turns out I didn't have, like, the Actions set up
  - rip I set it up I hope this works