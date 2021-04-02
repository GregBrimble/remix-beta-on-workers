import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

export const handleAssetRequest = async (event: FetchEvent, DEBUG = false) => {
  const options: Parameters<typeof getAssetFromKV>[1] = {};

  if (DEBUG) {
    options.cacheControl = {
      bypassCache: true,
    };
  }

  const page = await getAssetFromKV(event, options);

  const response = new Response(page.body, page);

  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "unsafe-url");
  response.headers.set("Feature-Policy", "none");

  return response;
};
