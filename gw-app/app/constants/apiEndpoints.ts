import { Dispatch } from "react";
import { AppAction, AppActionType } from "../context/appContext";
import { User } from "../types/data.types";

export const urlSchool = "http://130.229.135.156:3000";
export const urlHome = "http://192.168.0.198:3000";
export const urlNgrok = "https://quick-assured-macaque.ngrok-free.app";

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
    const response = await fetch(url + "/user", {
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
