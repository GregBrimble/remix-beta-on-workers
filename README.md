# Remix Starter for Cloudflare Workers

Welcome to Remix!

This is a starter repo for using [Remix](https://remix.run) with [Cloudflare Workers](https://workers.cloudflare.com/).

It is adapted from the starter repo for [Remix on Express](https://github.com/remix-run/starter-express), so go check out the documentation there for more information.

## Structure

### `app/`

Your Remix application code. Nothing special here.

### `public/`

You add files to this folder that you want to be served statically (such as `favicon.ico`). Part of the Remix build step also dumps some assets into `public/build/`.

### `workers-site/`

The Cloudflare Worker code. This serves the static files from `public/` and failing that (where there is no file), it serves a response from the Remix server.

### `server.js`

Left over from the [`starter-express` project](https://github.com/remix-run/starter-express), this isn't actually used by the Worker. It's useful for local development though, so it's left in for convenience.

### `wrangler.toml`

**NOTE: This currently requires a modified version of [wrangler](https://github.com/cloudflare/wrangler) to run. A PR is open [here](https://github.com/cloudflare/wrangler/pull/1833).**

The configuration file for your Cloudflare Worker. Documentation can be found [here](https://developers.cloudflare.com/workers/cli-wrangler/configuration), but TL;DR:

```toml
# The name of your Worker script (as it appears in the dashboard)
name = "remix"

# Must be set to `"javascript"`
type = "javascript"

# Your Cloudflare Account ID
account_id = "5a883b414d4090a1442b20361f3c43a9"   #

# If you want to run this on *.workers.dev, set to `true`, otherwise...
workers_dev = true

# If you want to run this on a custom domain, set `zone_id` and `route`...
# Your custom domain's Zone ID
zone_id = "b45d1950557ee2c633714eef986d537a"

# The route to run this Worker on (probably just `yourdomain.com/*`)
route = "gregbrimble.com/*"


# Configuring Workers Sites...
[site]

# The static folder to serve
bucket = "./public"

# The folder with your Worker code
entry-point = "workers-site"


# Configuring the custom build step...
[build]

# `"service-worker"` for easy mode, but if you're using Durable Objects, you'll need `"modules"` (no example built yet)
upload_format = "service-worker"

# The command to build the Worker
command = "npm install && npm run build"

# The directory to execute the build commands in
cwd = "workers-site"
```
