export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  const clientId = context.env.OAUTH_CLIENT_ID;
  const clientSecret = context.env.OAUTH_CLIENT_SECRET;

  if (!code) {
    return new Response('Missing code parameter', { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return new Response('Missing OAUTH_CLIENT_ID or OAUTH_CLIENT_SECRET environment variables', { status: 500 });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const data = await response.json();
    const token = data.access_token;

    if (!token) {
      return new Response(JSON.stringify(data), { status: 400 });
    }

    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authorizing...</title></head>
      <body>
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({ token: token, provider: 'github' })}',
            message.origin
          );
          window.removeEventListener('message', receiveMessage, false);
        };
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      </script>
      <p>Otentikasi berhasil. Menutup jendela ini...</p>
      </body>
      </html>
    `;

    return new Response(content, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
