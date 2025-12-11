import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../auth/AuthProvider";

export default function Login() {
  const { signIn, loading } = useAuth();
  const [busy, setBusy] = React.useState(false);

  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      await signIn("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: `
          radial-gradient(1200px 600px at 20% -10%, #21324a66, transparent),
          radial-gradient(800px 500px at 110% 10%, #5b5fc766, transparent),
          linear-gradient(180deg, #0b0f1a, #141b2d)
        `,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            background: "rgba(20, 24, 40, 0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
          }}
        >
          <CardContent>
            <Stack spacing={4} alignItems="stretch">
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={700}>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="#9fb0c9" mt={0.5}>
                  Sign in with your organization account to access Autolux Dashboard
                </Typography>
              </Box>

              <Button
                onClick={handleGoogleLogin}
                disabled={busy || loading}
                variant="contained"
                size="large"
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.3,
                  fontWeight: 700,
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #4285F4 0%, #34A853 35%, #FBBC05 70%, #EA4335 100%)",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                {busy ? "Redirecting…" : "Continue with Google"}
              </Button>

              <Divider sx={{ color: "#7d8aa5" }}>Security Notice</Divider>

              <Typography variant="body2" color="#9fb0c9" textAlign="center">
                Access is managed by your Identity Provider.  
                Make sure to use your assigned organization account.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}