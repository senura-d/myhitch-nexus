"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconBrandApple,
  IconBrandGoogle,
  IconMail,
  IconShieldLock,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { login } from "@/lib/mock-api";

const schema = z.object({
  email: z.string().min(1, "Enter your email address").email("That does not look like an email address"),
  password: z.string().min(8, "Passwords are at least 8 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "mara@marasolace.example", password: "prototype", remember: true },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    await login(values.email);
    setSubmitting(false);
    toast({
      title: "Signed in",
      description: "Mock session — no credentials were sent anywhere.",
    });
    router.push("/");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Sign in</h1>
      <p className="mt-1.5 text-sm text-fg-muted">
        New here?{" "}
        <Link href="/auth/register" className="font-medium text-accent hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={() =>
            toast({ title: "Social sign-in is a UI demonstration", tone: "info" })
          }
        >
          <IconBrandGoogle />
          Continue with Google
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({ title: "Social sign-in is a UI demonstration", tone: "info" })
          }
        >
          <IconBrandApple />
          Continue with Apple
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-2xs uppercase tracking-wide text-fg-subtle">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Field label="Email address" htmlFor="email" error={errors.email?.message} required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            leading={<IconMail />}
            invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          required
          aside={
            <Link href="#" className="text-accent hover:underline">
              Forgot password?
            </Link>
          }
        >
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            leading={<IconShieldLock />}
            invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </Field>

        <Checkbox label="Keep me signed in on this device" {...register("remember")} />

        <Button type="submit" variant="primary" block loading={submitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 rounded border border-border bg-surface-2 px-3.5 py-3 text-xs leading-relaxed text-fg-subtle">
        <strong className="text-fg-muted">Prototype note.</strong> Any email and an
        8-character password will sign you in. Nothing is transmitted, stored or
        verified — the session lives in browser memory only.
      </p>
    </div>
  );
}
