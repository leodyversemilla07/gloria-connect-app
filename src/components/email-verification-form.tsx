"use client";

import { useAuthToken } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleConvexError } from "@/hooks/use-convex-error";
import { localeRoute } from "@/lib/locale-paths";
import { api } from "../../convex/_generated/api";

const SESSION_KEY_PREFIX = "verification-email-sent:";

export function EmailVerificationForm() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthToken();
  const currentUser = useQuery(api.users.getCurrentUser);
  const adminStatus = useQuery(api.users.getIsAdmin, {});
  const verificationStatus = useQuery(api.users.getEmailVerificationStatus, {});
  const sendVerificationCode = useMutation(api.users.sendVerificationCode);
  const verifyEmailCode = useMutation(api.users.verifyEmailCode);

  const [code, setCode] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const locale = pathname.split("/")[1] || "en";

  React.useEffect(() => {
    if (token === null || token === undefined) {
      router.replace(`/${locale}/login`);
    }
  }, [locale, router, token]);

  React.useEffect(() => {
    if (verificationStatus?.isVerified && adminStatus !== undefined) {
      router.replace(
        adminStatus.isAdmin ? localeRoute(pathname, "/dashboard") : localeRoute(pathname, "/"),
      );
    }
  }, [adminStatus, pathname, router, verificationStatus]);

  React.useEffect(() => {
    const email = verificationStatus?.email;
    if (!email || verificationStatus?.isVerified) {
      return;
    }

    const sessionKey = `${SESSION_KEY_PREFIX}${email}`;
    if (window.sessionStorage.getItem(sessionKey)) {
      return;
    }

    setIsSending(true);
    void sendVerificationCode({ email })
      .then(() => {
        window.sessionStorage.setItem(sessionKey, "true");
        toast.success("Verification code sent.");
      })
      .catch((error) => {
        handleConvexError(error, "Failed to send verification code");
      })
      .finally(() => {
        setIsSending(false);
      });
  }, [sendVerificationCode, verificationStatus]);

  const handleResend = async () => {
    if (!verificationStatus?.email) {
      return;
    }

    setIsSending(true);
    try {
      await sendVerificationCode({ email: verificationStatus.email });
      window.sessionStorage.setItem(`${SESSION_KEY_PREFIX}${verificationStatus.email}`, "true");
      toast.success("Verification code sent.");
    } catch (error) {
      handleConvexError(error, "Failed to send verification code");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!verificationStatus?.email || !code.trim()) {
      toast.error("Enter the verification code.");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyEmailCode({
        email: verificationStatus.email,
        code: code.trim(),
      });
      toast.success("Email verified.");
      router.replace(
        adminStatus?.isAdmin ? localeRoute(pathname, "/dashboard") : localeRoute(pathname, "/"),
      );
    } catch (error) {
      handleConvexError(error, "Failed to verify email");
    } finally {
      setIsVerifying(false);
    }
  };

  if (token === undefined || verificationStatus === undefined || adminStatus === undefined) {
    return (
      <Card className="w-full">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (token === null || !currentUser?.email) {
    if (typeof window !== "undefined") {
      window.location.href = `/${locale}/login`;
    }
    return (
      <Card className="w-full">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Redirecting to login...
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus.isVerified) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {verificationStatus.email}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleVerify}>
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification code</Label>
            <Input
              id="verification-code"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              value={code}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="sm:flex-1" disabled={isVerifying} type="submit">
              {isVerifying ? "Verifying..." : "Verify email"}
            </Button>
            <Button
              className="sm:flex-1"
              disabled={isSending}
              onClick={() => void handleResend()}
              type="button"
              variant="outline"
            >
              {isSending ? "Sending..." : "Resend code"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
