"use client";

import React, { useState } from "react";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { loginUser } from "@/services/users.api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

function Login() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoginError(null);

    // Require either email or phone
    if (!data.email && !data.phoneNumber) {
      setLoginError("Please enter either email or phone number");
      return;
    }

    // Validate email ONLY if email is provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        setLoginError("Please enter a valid email");
        return;
      }
    }

    try {
      setLoading(true);

      await loginUser({
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      });
      reset();
      router.push("/");
      setLoginError(null);
    } catch (error) {
      setLoginError(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input type="text" label="Email" {...register("email")} />

        <p style={{ textAlign: "center" }}>OR</p>

        <Input type="text" label="Phone Number" {...register("phoneNumber")} />

        <Input
          type="password"
          label="Password"
          {...register("password", { required: true })}
        />
        {errors.password && <p>Password is required</p>}

        {loginError && <p className="error">{loginError}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center">
          Don&apos;t have an account? <Link href="/signup">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
