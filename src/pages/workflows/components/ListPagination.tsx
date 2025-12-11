import { Pagination } from "react-admin";

export default function ListPagination(props: any) {
  return (
    <Pagination
      {...props}
      rowsPerPageOptions={[10, 25, 50, 100]}
      labelRowsPerPage="Rows per page:"
      labelDisplayedRows={({
        from,
        to,
        count,
      }: {
        from: number;
        to: number;
        count: number;
      }) =>
        `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
      }
    />
  );
}