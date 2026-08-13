"use client";

import { IconCheck, IconMailFast, IconShieldLock } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { MOCK_OTP } from "@/lib/mock-api";
import { useCurrentUser, useVerifyOtp } from "@/lib/mock-api/hooks";
import { cn } from "@/lib/utils";

const LENGTH = 6;

export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: user } = useCurrentUser();
  const verifyOtp = useVerifyOtp();

  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = React.useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState(45);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1_000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const code = digits.join("");

  const setDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = char;
      return next;
    });
    setError(null);
    if (char && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(LENGTH).fill("");
    pasted.split("").forEach((char, index) => {
      next[index] = char;
    });
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const submit = async () => {
    const result = await verifyOtp.mutateAsync(code);
    if (result.ok) {
      toast({ title: "Verified", description: "Your account is confirmed." });
      router.push("/");
    } else {
      setError(result.message ?? "That code is not correct.");
    }
  };

  React.useEffect(() => {
    if (code.length === LENGTH) void submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div>
      <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <IconMailFast className="size-5" />
      </span>

      <h1 className="mt-4 font-display text-2xl font-semibold text-fg">
        Confirm it is you
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
        We sent a {LENGTH}-digit code to{" "}
        <span className="text-fg">{user?.email ?? "your email address"}</span>.
        Enter it below to finish setting up your account.
      </p>

      <div className="mt-6 flex gap-2" onPaste={onPaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            value={digit}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1}`}
            maxLength={1}
            className={cn(
              "h-14 w-full rounded border bg-surface-2 text-center font-display text-xl font-semibold text-fg transition-colors focus:border-accent focus:outline-none",
              error ? "border-danger" : "border-border",
            )}
          />
        ))}
      </div>

      {error ? (
        <p className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          onClick={submit}
          loading={verifyOtp.isPending}
          disabled={code.length < LENGTH}
        >
          Verify
        </Button>
        <Button
          variant="ghost"
          disabled={secondsLeft > 0}
          onClick={() => {
            setSecondsLeft(45);
            toast({ title: "Code resent", description: "It is still 000000." });
          }}
        >
          {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend code"}
        </Button>
      </div>

      <Card className="mt-6">
        <CardBody className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-medium text-fg">
            <IconShieldLock className="size-4 text-accent" />
            Verification status
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone={user?.emailVerified ? "published" : "pending"} size="sm">
              {user?.emailVerified ? <IconCheck /> : null}
              Email {user?.emailVerified ? "verified" : "pending"}
            </Badge>
            <Badge tone={user?.mobileVerified ? "published" : "pending"} size="sm">
              {user?.mobileVerified ? <IconCheck /> : null}
              Mobile {user?.mobileVerified ? "verified" : "pending"}
            </Badge>
            <Badge tone={user?.mfaEnabled ? "published" : "draft"} size="sm">
              MFA {user?.mfaEnabled ? "enabled" : "not set up"}
            </Badge>
          </div>
        </CardBody>
      </Card>

      <p className="mt-6 rounded border border-border bg-surface-2 px-3.5 py-3 text-xs leading-relaxed text-fg-subtle">
        <strong className="text-fg-muted">Prototype note.</strong> The code is
        always{" "}
        <span className="font-mono text-fg">{MOCK_OTP}</span>. No email or SMS is
        delivered — see the out-of-scope list in the build spec.
      </p>

      <p className="mt-4 text-sm text-fg-muted">
        Wrong address?{" "}
        <Link href="/auth/register" className="font-medium text-accent hover:underline">
          Start again
        </Link>
      </p>
    </div>
  );
}
