import { apiconnector } from "./Apiconnector";



export const login = async (email, password) => {
    
  const res = await apiconnector("GET",'/users',null,{},{
    email
  });//get
  const user = res.data[0];

  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }

  // Create a fake token by encoding user info
  const token = btoa(
    JSON.stringify({
      id: user.id,
      role: user.role,
      email: user.email,
    }),
  );

  return { user, token };
};