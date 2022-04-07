export const response = {
  json: (body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), {
      headers: new Headers({ "Content-Type": "application/json" }),
    }),
  html: (body: string) =>
    new Response(body, {
      headers: new Headers({ "Content-Type": "text/html" }),
    }),
  custom: (body: string, contentType: string) =>
    new Response(body, {
      headers: new Headers({ "Content-Type": contentType }),
    }),
  error: (error: string, status = 500) => new Response(error, { status }),
};

export class Error404 extends Error {}
