import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";

function OrderList({ orders }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        p: { xs: 1, sm: 2 },
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
        Orders
      </Typography>

      <TableContainer
        sx={{
          maxHeight: "calc(100% - 48px)",
          overflowX: "auto",
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            tableLayout: "fixed",
            width: "100%",
            minWidth: 260,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 64, whiteSpace: "nowrap" }}>#</TableCell>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Name
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Price (€)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {order.name}
                </TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: "EUR",
                  }).format(order.price.toString())}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OrderList;
