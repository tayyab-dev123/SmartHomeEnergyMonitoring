import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in">
        <RegisterForm />
      </div>
    </div>
  );
}
