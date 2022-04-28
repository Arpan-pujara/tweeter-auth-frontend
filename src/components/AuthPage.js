import React, { useEffect } from "react";
import axios from "axios";
import qs from "query-string";

export default function SignIn(props) {
  useEffect(() => {
    //   gets the returned query
    console.log("in call back url");
    const query = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    console.log("query",query)

    // makes call to callback endpoint(on our server) with the needed params
    let codeVerifier = localStorage.getItem('codeVerifier')
    let state = localStorage.getItem('state')
    console.log("item1 while getting for cll", localStorage.getItem("codeVerifier"), Date.now())
    console.log("item2 while getting for call ba", localStorage.getItem("state"))
    alert("just a pause")
    query.codeVerifier = codeVerifier
    query.sessionState = state
    axios
      .get(
        `/callback`,{params:query}
      )
      .then((response) => {
        if (response.data.oauthAccessToken) {
          //check to see if oauthAccessToken is returned
          //   if returned, check to verify
          axios
            .get(
              `/verify/${response.data.oauthAccessToken}/${response.data.oauthAccessTokenSecret}`
            )
            .then((res) => {
              const { user } = res.data;
              const keys = response.data;

              const userInfo = {
                accessToken: keys.oauthAccessToken,
                secret: keys.oauthAccessTokenSecret,
                user_id: user.id_str,
                screen_name: user.screen_name,
                photo: user.profile_image_url_https.replace("_normal", ""),
              };

              // and send user info to /home route
              props.history.push({
                pathname: "/home",
                state: {
                  user: userInfo,
                },
              });
            });
        }
      })
      .catch((err) => {
        alert("authentication error");
        props.history.push({
          pathname: "/",
        });
      });
  }, [props.location.search, props.history]);
  return (
    <div className="App-header ">
      <h2>auth loading</h2>
      <h2> Authenticating... </h2>
    </div>
  );
}
