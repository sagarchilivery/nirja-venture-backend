import bcrypt from "bcryptjs";

export const cypherPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hashSync(password, salt);
};

export const decypherPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
