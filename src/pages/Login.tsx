import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import labHero from "@/assets/lab-hero.jpg";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, navigate to dashboard directly (no auth backend yet)
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={labHero}
          alt="Laboratory"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 to-primary/70" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-primary-foreground">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Laboratory Observation<br />Module Builder
          </h1>
          <p className="text-lg opacity-90 max-w-md">
            Create and manage lab experiment observation sheets for students with ease.
          </p>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {isSignUp ? "Sign up for a new account" : "Sign in to your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className="w-full text-base py-5">
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
