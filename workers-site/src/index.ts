import {
  MethodNotAllowedError,
  NotFoundError,
} from "@cloudflare/kv-asset-handler";
import { handleAssetRequest } from "./handleAssetRequest";
import { handleRemixRequest } from "./handleRemixRequest";

const DEBUG = false;

addEventListener("fetch", (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        })
      );
    }
    event.respondWith(new Response("Internal Error", { status: 500 }));
  }
});

const handleEvent = async (event: FetchEvent) => {
  try {
    // Try to first serve the request from the './public' directory...
    return await handleAssetRequest(event, DEBUG);
  } catch (error) {
    if (
      !(
        error instanceof MethodNotAllowedError || error instanceof NotFoundError
      )
    ) {
      // An unexpected error in serving that asset request occurred.
      throw error;
    }

    // There was no matching asset, so let Remix handle the Request...
    return await handleRemixRequest(event.request);
  }
};
