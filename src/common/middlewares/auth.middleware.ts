import passport from "passport";

export function authorizeUser() {
  return passport.authenticate("jwt", { session: false });
}
