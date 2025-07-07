import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Smart Home Energy Monitor</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Monitor and understand your home energy consumption with AI
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
