async function handler() {
  return new Response('Pong', { status: 200 });
}

export { handler as GET, handler as POST };
