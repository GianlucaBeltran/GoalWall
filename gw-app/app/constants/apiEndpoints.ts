import { Dispatch } from "react";
import { AppAction, AppActionType } from "../context/appContext";
import { User } from "../types/data.types";

const urlNgrok = "https://quick-assured-macaque.ngrok-free.app"; // gianluca ngrok, only works when ngrok is running

const urlHome = process.env.EXPO_PUBLIC_HOME_API; // env variable instantied in bash run command

export const url = urlHome || "";

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
