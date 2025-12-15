export const useSiteOrigin = () => {
  const url = useRequestURL();
  const proto = url.protocol.replace(':', '');
  const host = url.host;
  return computed(() => `${proto}://${host}`);
};
