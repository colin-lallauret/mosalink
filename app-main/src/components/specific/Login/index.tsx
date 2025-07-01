"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");

  const isEmailValid = useMemo(() => {
    return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);
  }, [email]);

  return (
    <form className="flex flex-col gap-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-96"
        placeholder="Votre email"
        required
      />
      <Button
        disabled={!isEmailValid}
        onClick={(e) => {
          e.preventDefault();
          signIn("email", { email: email });
        }}
        type="submit"
      >
        Connection avec Email
      </Button>
    </form>
  );
};

export default Login;
