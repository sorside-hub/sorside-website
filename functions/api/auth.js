export async function onRequestGet(context) {
  const clientId = context.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('Missing OAUTH_CLIENT_ID environment variable in Cloudflare Pages', { status: 500 });
  }
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
  return Response.redirect(redirectUrl, 302);
}
