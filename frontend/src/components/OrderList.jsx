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
        width: "100%", // Full width
        height: "100%", // Full height
        overflow: "hidden", // Prevent scrollbars entirely
        padding: 2,
        boxSizing: "border-box", // Include padding in width calculation
      }}
    >
      {/* Title */}
      <Typography variant="h6" gutterBottom>
        Orders
      </Typography>

      {/* Scrollable Table */}
      <TableContainer
        sx={{
          maxHeight: "calc(100% - 50px)", // Adjust for header and padding
          overflowX: "auto", // Horizontal scrolling for the table if needed
        }}
      >
        <Table
          size="small"
          stickyHeader
          sx={{
            tableLayout: "fixed", // Fix cell layout to avoid stretching
            width: "100%", // Ensure table respects container width
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Number
              </TableCell>
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
                <TableCell align="right">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'EUR' }).format(order.price.toString())}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default OrderList;
