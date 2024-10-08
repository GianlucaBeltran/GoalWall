export const getUser = (id: number) => {
  return { message: "User with id " + id + " was found!" };
};

export const getUsers = () => {
  return { message: "All users were found!" };
};

export const getGoal = (id: number) => {
  return { message: "Goal with id " + id + " was found!" };
};

export const getGoals = () => {
  return { message: "All goals were found!" };
};
