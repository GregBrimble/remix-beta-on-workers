import build from "../../build/index.js";
import {
  createRequestHandler as nodeCreateRequestHandler,
  ServerBuild,
  Request as NodeFetchRequest,
} from "@remix-run/node";

// Adapted from @remix-run/express/server.js
const createRequestHandler = ({
  build,
  getLoadContext,
  mode = process.env.NODE_ENV,
}: {
  build: ServerBuild;
  getLoadContext?: (request: Request) => {};
  mode?: string;
}) => {
  const handleRequest = nodeCreateRequestHandler(build, mode);
  return async (request: Request): Promise<Response> => {
    const loadContext =
      typeof getLoadContext === "function"
        ? getLoadContext(request)
        : undefined;

    // node-fetch extends the spec with a few extra properties on the Request instance, so we need to cast between them.
    const nodeRequest: NodeFetchRequest = request as any;
    const nodeResponse = await handleRequest(nodeRequest, loadContext);
    return nodeResponse as any;
  };
};

export const handleRemixRequest = async (request: Request, DEBUG = false) => {
  const handler = createRequestHandler({
    build,
    mode: DEBUG ? "development" : "production",
  });
  return await handler(request);
};
