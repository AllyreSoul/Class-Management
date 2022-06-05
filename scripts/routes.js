const express = require("express");
const {
  Home,
  loginPage,
  loginRequest,
  registerPage,
  registerRequest,
  createClass,
  createClassRequest,
  classPage,
  studentRemoveRequest,
  studentCreatePage,
  studentCreateRequest,
  classEditPage,
  classEditRequest,
  logout,
  profilePage,
  profileEditPage,
  profileEditRequest,
  profilePasswordPage,
  profilePasswordRequest,
  aboutPage
} = require("./controllers");
const router = express.Router();

router.get("/", Home);

router.get("/login", loginPage);
router.post("/login", loginRequest);

router.get("/register", registerPage);
router.post("/register", registerRequest);

router.get("/class/create", createClass)
router.post("/class/create", createClassRequest);
router.get("/class/pageAccess/:id", classPage);

router.post("/student/remove/:id", studentRemoveRequest);
router.get("/student/create", studentCreatePage);
router.post("/class/student/create", studentCreateRequest);

router.get("/class/edit", classEditPage);
router.post("/class/edit", classEditRequest)

router.post("/logout", logout)

router.get("/profile", profilePage)

router.get("/profile/edit", profileEditPage)
router.post("/profile/edit", profileEditRequest)

router.get("/profile/password", profilePasswordPage)
router.post("/profile/password", profilePasswordRequest)

router.get("/about", aboutPage)
module.exports = router;