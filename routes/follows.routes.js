import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowing,
} from "../controllers/follows.controller.js";

const followsRouter = Router();

followsRouter.post(  "/:userId",              authorize, followUser);
followsRouter.delete("/:userId",              authorize, unfollowUser);
followsRouter.get(   "/:userId/followers",               getFollowers);
followsRouter.get(   "/:userId/following",               getFollowing);
followsRouter.get(   "/check/:userId",        authorize, checkFollowing);

export default followsRouter;