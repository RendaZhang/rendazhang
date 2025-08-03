export const getEnv = (key) => {
  const envMap = {
    TAG_NAME: import.meta.env.PUBLIC_TAG_NAME,
    NODE_ENV: import.meta.env.PUBLIC_NODE_ENV,
    CDN_BASE: import.meta.env.PUBLIC_CDN_BASE
  };
  return envMap[key] || null;
};

export const isProduction = () => getEnv('NODE_ENV') === 'production';
export const getCdnUrl = (path) => {
  const cdnBase = getEnv('CDN_BASE') || '/';
  return `${cdnBase}/${path.replace(/^\//, '')}`;
};
