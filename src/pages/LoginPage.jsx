import React from "react";

const LoginPage = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <form className="w-4/5 max-w-md p-8">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
            Welcome Back
          </h2>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              <a href="/tourpage"></a>Login
            </button>
            <div className="">
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>

      <div className="flex-1 flex items-center justify-center bg-blue-600">
        <h1 className="text-6xl font-bold text-white"> LOGIN HERE </h1>
      </div>
    </div>
  );
};

export default LoginPage;
