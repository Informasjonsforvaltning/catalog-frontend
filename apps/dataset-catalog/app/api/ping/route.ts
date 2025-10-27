const handler = async () => {
  return new Response('Pong', { status: 200 });
};

export { handler as GET };
