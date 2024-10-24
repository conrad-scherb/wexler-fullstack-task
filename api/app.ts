import router from "./router";

const port = process.env.PORT || 9001;
router.listen(port, () => {
  console.log("Server listening on port " + port);
});
