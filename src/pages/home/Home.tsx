import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import Search from "../../components/ui/Search";
import InvoicesPage from "./InvoicesPage";
import theme from "../../theme";

const TOKENS = {
    pageBg: "transparent",
    surface: "#12172A",
    cardBg: "#161C32",
    border: "rgba(255,255,255,0.08)",
    text: "#E8EAFF",
    subtext: "rgba(232,234,255,0.7)",

    searchBg: "rgba(232,234,255,0.08)",
    searchBgHover: "rgba(232,234,255,0.12)",

    chipBg: "rgba(232,234,255,0.08)",
    chipBorder: "rgba(232,234,255,0.18)",
    chipText: "#E8EAFF",

    tableHeadBg: "rgba(232,234,255,0.08)",
    rowHover: "rgba(232,234,255,0.04)",
};

type StatCard = { title: string; value: string | number; subtitle?: string };

const STAT_CARDS: StatCard[] = [
    { title: "New Customers", value: 18, subtitle: "last 7 days" },
    { title: "Open Claims", value: 37, subtitle: "awaiting action" },
    { title: "Total customers", value: "120", subtitle: "Since inception" },
];

export default function Home() {
    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: TOKENS.pageBg, color: TOKENS.text }}>
            <Search />
            <Grid container spacing={3} sx={{
                display: "flex",
                mt: 3, alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                maxWidth: 1200,
                 mx: "auto", 
            }}>
                {STAT_CARDS.map((c) => (
                    <Grid key={c.title} size={{ xs: 12, sm: 6, md: 4 }} display={"flex"} justifyContent="center">
                        <Card
                            sx={{
                                height: { xs: 160, md: 160 },
                                width: { xs: 300, md: 300 },
                                bgcolor: TOKENS.cardBg,
                                border: `1px solid ${TOKENS.border}`,
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{
                                display: "flex", alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                height: "100%",
                                flexDirection: "column", gap: 1,
                                p: 3,
                            }}>
                                <Typography sx={{ ...theme.typography.h6, color: TOKENS.subtext }}>
                                    {c.title}
                                </Typography>
                                <Typography sx={{ ...theme.typography.h4, fontWeight: 700, color: TOKENS.text }}>
                                    {c.value}
                                </Typography>
                                {c.subtitle && (
                                    <Typography sx={{ ...theme.typography.h6, color: TOKENS.subtext }}>
                                        {c.subtitle}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <InvoicesPage />
        </Box>
    );
}