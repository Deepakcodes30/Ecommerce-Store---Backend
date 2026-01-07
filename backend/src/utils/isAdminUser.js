const isAdminUser = (user) => {
  if (!user) {
    return false;
  }
  return (
    user.email === process.env.ADMIN_EMAIL ||
    user.phoneNumber === process.env.ADMIN_PHONE
  );
};

export default isAdminUser;
