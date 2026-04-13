"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { IconArrowLeft, IconEye, IconEyeOff } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ResetStep = "forgot" | { email: string };

export function PasswordResetForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [step, setStep] = React.useState<ResetStep>("forgot");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  function isErrorWithMessage(err: unknown): err is { message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof (err as { message?: unknown }).message === "string"
    );
  }

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await signIn("password", { flow: "reset", email });
      setStep({ email });
      setSuccessMessage(`A verification code has been sent to ${email}`);
    } catch (err) {
      if (isErrorWithMessage(err)) {
        setError(err.message);
      } else {
        setError("Failed to send reset code. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = typeof step === "object" ? step.email : "";
    const code = formData.get("code") as string;
    const newPassword = formData.get("newPassword") as string;

    try {
      await signIn("password", {
        flow: "reset-verification",
        email,
        code,
        newPassword,
      });
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (err) {
      if (isErrorWithMessage(err)) {
        setError(err.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (successMessage && typeof step !== "string") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className="text-green-600 font-medium">{successMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <IconArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>

            {step === "forgot" ? (
              <form onSubmit={handleForgotSubmit}>
                <FieldGroup>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Enter your email to receive a reset code
                    </p>
                  </div>

                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input name="email" type="email" placeholder="m@example.com" required />
                  </Field>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Code"}
                  </Button>

                  <FieldDescription className="text-center">
                    Remember your password?{" "}
                    <Link href={`/${locale}/login`} className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <FieldGroup>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                      Enter the code sent to {typeof step === "object" ? step.email : ""}
                    </p>
                  </div>

                  <Field>
                    <FieldLabel>Verification Code</FieldLabel>
                    <Input name="code" type="text" placeholder="12345678" maxLength={8} required />
                  </Field>

                  <Field>
                    <FieldLabel>New Password</FieldLabel>
                    <div className="relative">
                      <Input
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <IconEyeOff className="size-5" />
                        ) : (
                          <IconEye className="size-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be 8+ characters with digit, lowercase, and uppercase
                    </p>
                  </Field>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep("forgot");
                      setError(null);
                    }}
                  >
                    Did not receive the code? Resend
                  </Button>
                </FieldGroup>
              </form>
            )}
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/logo.png"
              alt="Image"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
