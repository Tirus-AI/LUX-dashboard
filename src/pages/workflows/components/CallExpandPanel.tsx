import * as React from "react";
import { Box, Chip, Typography, Link as MuiLink, Divider, Stack } from "@mui/material";
import { useRecordContext } from "react-admin";
import { C } from "./uiTokens";
import { fmtDate, msToSec } from "./format";

function FieldKV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ color: C.textFaint }}>{label}</Typography>
      <Typography variant="body1" sx={{ color: C.text }}>{value ?? "-"}</Typography>
    </Box>
  );
}

export default function CallExpandPanel() {
  const rec = useRecordContext<any>();
  if (!rec) return null;

  return (
    <Box
      sx={{
        p: 3, backgroundColor: "#0A0F1C", borderRadius: 2, width: "100%",
        border: `1px solid ${C.border}`, color: C.text, textAlign: "left",
      }}
    >
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={2}>
        {[
          `Status: ${rec.call_status ?? "-"}`,
          `Dir: ${rec.direction ?? "-"}`,
          `From: ${rec.from_number ?? "-"}`,
          `To: ${rec.to_number ?? "-"}`,
          `Started: ${fmtDate(rec.start_timestamp)}`,
          `Ended: ${fmtDate(rec.end_timestamp)}`,
          `Duration: ${msToSec(rec.duration_ms)}s`,
          `Sentiment: ${rec.call_analysis?.user_sentiment ?? "-"}`,
        ].map((t, i) => (
          <Chip key={i} size="small"
            label={t}
            sx={{ bgcolor: C.surface, color: C.text, border: `1px solid ${C.border}` }}
          />
        ))}
        <Chip
          size="small"
          label={`Successful: ${rec.call_analysis?.call_successful ? "Yes" : "No"}`}
          sx={{
            bgcolor: rec.call_analysis?.call_successful ? "rgba(80,200,120,0.18)" : "rgba(255,84,84,0.18)",
            color: rec.call_analysis?.call_successful ? "#72E2A8" : "#FF8484",
            border: `1px solid ${C.border}`,
          }}
        />
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, mb: 2 }}>
        <FieldKV label="Agent" value={rec.agent_name} />
        <FieldKV label="Twilio SID" value={rec.telephony_identifier?.twilio_call_sid} />
        <FieldKV
          label="Unit price"
          value={rec.call_cost ? `$${Number(rec.call_cost.total_duration_unit_price ?? 0).toFixed(6)}` : "-"}
        />
        <FieldKV
          label="Billing seconds"
          value={rec.call_cost?.total_duration_seconds ?? msToSec(rec.duration_ms)}
        />
        <FieldKV
          label="Cost"
          value={rec.call_cost ? `$${((rec.call_cost.combined_cost ?? 0) / 100).toFixed(2)}` : "-"}
        />
        <FieldKV
          label="Recording"
          value={
            rec.recording_url
              ? <MuiLink href={rec.recording_url} target="_blank" rel="noopener" sx={{ color: C.accent }}>Open recording</MuiLink>
              : "-"
          }
        />
        <FieldKV
          label="Public log"
          value={
            rec.public_log_url
              ? <MuiLink href={rec.public_log_url} target="_blank" rel="noopener" sx={{ color: C.accent }}>Open log</MuiLink>
              : "-"
          }
        />
        <FieldKV label="Call type" value={rec.call_type} />
        <FieldKV label="Disconnect" value={rec.disconnection_reason} />
      </Box>

      {rec.retell_llm_dynamic_variables && (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1, color: C.text }}>Dynamic variables</Typography>
          <Box component="pre" sx={{
            m: 0, p: 1, border: `1px dashed ${C.border}`, borderRadius: 1,
            bgcolor: "#0A0F1C", color: C.text, maxHeight: 220, overflow: "auto", whiteSpace: "pre-wrap"
          }}>
            {JSON.stringify(rec.retell_llm_dynamic_variables, null, 2)}
          </Box>
        </>
      )}

      {rec.call_analysis?.call_summary && (
        <>
          <Typography variant="subtitle2" sx={{ my: 1, color: C.text }}>Summary</Typography>
          <Box component="pre" sx={{
            m: 0, p: 1, border: `1px dashed ${C.border}`, borderRadius: 1,
            bgcolor: "#0A0F1C", color: C.textDim, maxHeight: 200, overflow: "auto", whiteSpace: "pre-wrap"
          }}>
            {rec.call_analysis.call_summary}
          </Box>
        </>
      )}

      {rec.transcript && (
        <>
          <Typography variant="subtitle2" sx={{ my: 1, color: C.text }}>Transcript</Typography>
          <Box component="pre" sx={{
            m: 0, p: 1, border: `1px dashed ${C.border}`, borderRadius: 1,
            bgcolor: "#0A0F1C", color: C.text, maxHeight: 300, overflow: "auto", whiteSpace: "pre-wrap"
          }}>
            {rec.transcript}
          </Box>
        </>
      )}

      <Divider sx={{ mt: 2, borderColor: C.border }} />
    </Box>
  );
}