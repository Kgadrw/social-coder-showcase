import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPasswordState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
      navigate("/admin");
    } catch {
      setError("Invalid password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="modern-card w-full max-w-md p-5 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          Admin Login
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your admin password to edit the portfolio.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPasswordState(e.target.value)}
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : null}

          <Button className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

