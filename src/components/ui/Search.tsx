import { Box, InputBase, Toolbar } from "@mui/material";
import search from "/assets/search.svg";
import arrow from "/assets/arrow.svg";

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

export default function Search() {
    return (
        <Box>
            <Toolbar sx={{ px: 0 }}>
                <Box
                    sx={{
                        position: "relative",
                        borderRadius: 1,
                        bgcolor: TOKENS.searchBg,
                        "&:hover": { bgcolor: TOKENS.searchBgHover },
                        ml: 3,
                        mr: 2,
                        width: "100%",
                        maxWidth: 420,
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        border: `1px solid ${TOKENS.border}`,
                    }}
                >
                    <Box
                        sx={{
                            px: 1.5,
                            pointerEvents: "none",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={search}
                            alt="search"
                            sx={{ width: 24, height: 24}}
                        />
                    </Box>
                    <InputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                        sx={{
                            width: "100%",
                            pr: 2,
                            color: TOKENS.text,
                            "& .MuiInputBase-input": { py: 1.2 },
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const value = (e.target as HTMLInputElement).value.trim();
                                if (value) console.log("Search:", value);
                            }
                        }}
                    />
                     <Box
            sx={{
              pr: 1.5,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={arrow}
              alt="go"
              sx={{ width: 32, height: 32 }}
              onClick={() => console.log("Arrow clicked")} // ✅ add action
            />
          </Box>
                </Box>
            </Toolbar>
        </Box>
    );
}