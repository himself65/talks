export default () => {
  return {
    optimizeDeps: {
      exclude: ["llamaindex"],
    },
    ssr: {
      external: ["llamaindex"],
    },
  };
};
