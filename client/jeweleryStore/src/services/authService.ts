export const loginService = async (email: string, password: string) => {
  return { token: "demo-token", email };
};

export const signupService = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return { token: "demo-token", email };
};
