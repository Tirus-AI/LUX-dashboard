import * as React from "react";
import { Box } from "@mui/material";
import { DatagridConfigurable } from "react-admin";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof DatagridConfigurable>;

export default function ResizableDatagrid(props: Props) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const headerCells: HTMLTableCellElement[] = Array.from(
            root.querySelectorAll<HTMLTableCellElement>(
                "thead .MuiTableRow-root .MuiTableCell-root"
            )
        );

        headerCells.forEach((th) => {
            th.querySelectorAll(".__ra_col_resizer").forEach((el) => el.remove());
            th.style.position = "relative";
            th.style.userSelect = "none";
        });

        const applyWidth = (colIndex: number, widthPx: number) => {
            const table = root.querySelector("table");
            if (!table) return;
            const nth = colIndex + 1;

            const th = table.querySelector<HTMLTableCellElement>(
                `thead .MuiTableRow-root .MuiTableCell-root:nth-child(${nth})`
            );
            if (th) {
                th.style.width = `${widthPx}px`;
                th.style.minWidth = `${widthPx}px`;
                th.style.maxWidth = `${widthPx}px`;
            }
            table
                .querySelectorAll<HTMLTableCellElement>(
                    `tbody .MuiTableRow-root td:nth-child(${nth})`
                )
                .forEach((td) => {
                    td.style.width = `${widthPx}px`;
                    td.style.minWidth = `${widthPx}px`;
                    td.style.maxWidth = `${widthPx}px`;
                });
        };

        headerCells.forEach((th, i) => {
            const isUtilityCol =
                th.className.includes("RaDatagrid-expandHeader") ||
                !!th.querySelector("input[type=checkbox]");

            if (isUtilityCol) return;

            const handle = document.createElement("div");
            handle.className = "__ra_col_resizer";
            Object.assign(handle.style, {
                position: "absolute",
                top: "0px",
                right: "-6px",
                width: "12px",
                height: "100%",
                cursor: "col-resize",
                zIndex: "10",
                background: "transparent",
            } as CSSStyleDeclaration);

            let startX = 0;
            let startW = 0;
            const min = 60;

            const onMouseMove = (ev: MouseEvent) => {
                const dx = ev.clientX - startX;
                const next = Math.max(min, startW + dx);
                applyWidth(i, next);
            };
            const onMouseUp = () => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
                document.body.style.cursor = "";
            };

            handle.addEventListener("mousedown", (ev) => {
                ev.preventDefault();
                const rect = th.getBoundingClientRect();
                startW = rect.width;
                startX = ev.clientX;
                document.body.style.cursor = "col-resize";
                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onMouseUp);
            });

            th.appendChild(handle);
        });

        return () => {
            headerCells.forEach((th) =>
                th.querySelectorAll(".__ra_col_resizer").forEach((el) => el.remove())
            );
        };
    });

    const shimSx = {
        "& table": { tableLayout: "auto" },
    };

    return (
        <Box ref={rootRef} sx={shimSx}>
            <DatagridConfigurable {...props} />
        </Box>
    );
}