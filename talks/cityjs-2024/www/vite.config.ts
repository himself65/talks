export default ({ mode }: any) => {
  return {
    optimizeDeps: {
      exclude: [
        "llamaindex",
        mode === "development" ? "ai/rsc" : undefined,
      ].filter(Boolean),
    },
  };
};
