import { serve } from "./deps.ts";

import { response, Error404 } from "./utils.ts";

const getFile = async (path: string): Promise<string | null> => {
  try {
    const file = await Deno.readFile(path);
    if (file.length === 0) return null;
    return new TextDecoder("utf-8").decode(file);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return null;
    throw err;
  }
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { pathname, href } = new URL(req.url);

    if (pathname !== "/" && href[href.length - 1] === "/")
      return Response.redirect(href.slice(0, -1));

    if (pathname.includes(".html")) throw new Error404();

    const segments = pathname.split("/").filter(Boolean);

    if (segments?.[0] === "api") {
      try {
        const api = await import(`./${segments.join("/")}.ts`);
        return api.default(req);
      } catch (err) {
        console.error(err);
        throw new Error404();
      }
    } else if (segments?.[0] === "static") {
      const file = await getFile(`./${segments.join("/")}`);
      if (file) {
        let mime = segments.slice(-1)[0].split(".")[1];
        if (["js", "mjs"].includes(mime)) mime = "javascript";
        return response.custom(file, `text/${mime}`);
      } else throw new Error404();
    } else {
      let page = await getFile(
        segments.length === 0
          ? "./pages/index.html"
          : `./pages/${segments.join("/")}/index.html`
      );

      if (!page) {
        page = await getFile(`./pages/${segments.join("/")}.html`);
      }

      if (page) {
        return response.html(page);
      } else throw new Error404();
    }
  } catch (err) {
    if (err instanceof Error404) {
      return response.error("Not found", 404);
    } else {
      console.error(err);
      return response.error("Internal server error", 500);
    }
  }
};

console.log("Listening on http://localhost:8000");

await serve(handler);
