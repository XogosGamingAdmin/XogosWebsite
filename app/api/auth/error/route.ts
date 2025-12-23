import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get("error");

  console.error("NextAuth Error:", error);

  // Redirect to sign-in page with error parameter
  redirect(`/signin?error=${error || "Configuration"}`);
}
