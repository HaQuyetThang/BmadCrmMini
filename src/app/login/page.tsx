import { LoginForm } from "@/app/login/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-page py-page">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
