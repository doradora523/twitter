import React from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ userObj, refreshUser }) => {
  return (
    <Router>
      {userObj && <Navigation userObj={userObj} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {userObj ? (
            <>
              <Route path="/" element={<Home userObj={userObj} />}></Route>
              <Route
                path="/profile"
                element={
                  <Profile userObj={userObj} refreshUser={refreshUser} />
                }
              ></Route>
            </>
          ) : (
            <>
              <Route path="/" element={<Auth />}></Route>
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
