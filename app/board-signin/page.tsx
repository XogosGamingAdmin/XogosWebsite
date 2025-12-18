import { redirect } from "next/navigation";

export default function BoardSignInPage() {
  // Read Client ID from environment variable
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = "https://www.histronics.com/api/auth/callback/google";

  if (!clientId) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Configuration Error</h2>
        <p>GOOGLE_CLIENT_ID is not set in environment variables.</p>
        <p>Please contact the administrator.</p>
      </div>
    );
  }

  // Construct Google OAuth URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  // Redirect to Google
  redirect(googleAuthUrl.toString());
}
