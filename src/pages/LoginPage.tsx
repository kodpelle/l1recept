
 function LoginPage() {
  return (
    <>
    <div>
      <h1>Login</h1>
      <form action="login">
        <label>
          Email
        <input type="text" name="email" />
        </label>
        <label>
          Password
        <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
    </>
  );
}
LoginPage.route = {
  path: '/login',
  menuLabel: 'Login',
  index: 1  
};

export default LoginPage;