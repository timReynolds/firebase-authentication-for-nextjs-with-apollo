export default apolloClient =>
  apolloClient.cache
    .reset()
    .then(() => {
      console.log("CACHE RESET");
    })
    .catch(() => {
      console.error("CACHE RESET ERROR");
    });
