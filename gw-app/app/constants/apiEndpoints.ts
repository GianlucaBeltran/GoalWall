import { Dispatch } from "react";
import { AppAction, AppActionType } from "../context/appContext";
import { User } from "../types/data.types";

const urlSchool = "130.229.135.156"; // gianluca personal ip when connected to KTH VPN
const urlNgrok = "https://quick-assured-macaque.ngrok-free.app"; // gianluca ngrok, only works when ngrok is running

// This needs to be the ip of the computer that ran the npx expo start command
const urlHome = process.env.EXPO_PUBLIC_HOME_API; // <--- change this to your local ip address,
// it is displayed right after the QR code when you run the app:
// Metro waiting on exp://192.168.0.198:8081 DO NOT USE THE PORT NUMBER (:8081) and exp://
// Change to:             ^^^^^^^^^^^^^
// you can also find it by running `ifconfig` on mac

export const url = urlHome || "";

console.log(url, "url");

export async function fetchUser({
  url,
  userLogin,
  dispatch,
  navigateCallBack,
}: {
  url: string;
  userLogin: { firstName: string; lastName: string };
  dispatch: Dispatch<AppAction>;
  navigateCallBack: () => void;
}) {
  try {
    const response = await fetch(url + "/user/", {
      method: "POST",
      body: JSON.stringify(userLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log(response.status, "response status");
      throw new Error(`Response status: ${response.status}`);
    }

    const user: { user: User } = await response.json();

    if (!dispatch) return;
    dispatch({
      type: AppActionType.SET_USER,
      payload: user.user,
    });
    navigateCallBack();
    return;
  } catch (error: any) {
    console.error(error.message);
  }
}
