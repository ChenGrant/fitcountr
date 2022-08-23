import { Box, Typography } from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import CustomCard from "../../../../components/ui/CustomCard";
import { getColumnsHeaders, getRows } from "../../utils";
import ProgressTableRow from "./ProgressTableRow";

// ---------------------------------- TABLE REDUCER ----------------------------------
const TABLE_ACTIONS = {
  SET_COLUMN_HEADERS: "SET_COLUMN_HEADERS",
  SET_ROWS: "SET_ROWS",
};

const INITIAL_TABLE_STATE = {
  columnHeaders: null,
  rows: null,
};

const tableReducer = (state, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SET_COLUMN_HEADERS:
      return { ...state, columnHeaders: action.payload };
    case TABLE_ACTIONS.SET_ROWS:
      return { ...state, rows: action.payload };
    default:
      return state;
  }
};

// ************************************************************************************
// ------------------------------------ COMPONENT -------------------------------------
// ************************************************************************************
const ProgressTable = () => {
  const { progressPage, user } = useSelector((state) => state);
  const { progressType } = progressPage;
  const [table, tableDispatch] = useReducer(tableReducer, INITIAL_TABLE_STATE);

  // ----------------------------------- USE EFFECT -----------------------------------
  useEffect(() => {
    const columnsHeaders = getColumnsHeaders(progressType, user.goals);
    tableDispatch({
      type: TABLE_ACTIONS.SET_COLUMN_HEADERS,
      payload: columnsHeaders,
    });
    tableDispatch({
      type: TABLE_ACTIONS.SET_ROWS,
      payload: getRows(progressType, user.progress, columnsHeaders),
    });
  }, [progressType, user.progress, user.goals]);

  // ------------------------------------- RENDER -------------------------------------
  return (
    <Box sx={{ display: "grid", placeItems: "center", width: "max-content" }}>
      <CustomCard>
        {/* Table Column Headers */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          width="max-content"
          px={1}
        >
          {table.columnHeaders?.map(({ label, width }) => (
            <Box width={width} key={label}>
              <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
            </Box>
          ))}
        </Box>
        {/* Table Rows */}
        {table.rows?.map((row) => (
          <ProgressTableRow
            key={row.id}
            row={row}
            columnHeaders={table.columnHeaders}
          />
        ))}
      </CustomCard>
    </Box>
  );
};

export default ProgressTable;
