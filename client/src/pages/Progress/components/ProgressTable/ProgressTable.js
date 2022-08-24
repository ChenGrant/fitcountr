import { useTheme } from "@emotion/react";
import { Box, Pagination, Typography } from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import CustomCard from "../../../../components/ui/CustomCard";
import { PROGRESS_TYPE_NAMES } from "../../../../utils";
import { getColumnsHeaders, getRows } from "../../utils";
import ProgressTableRow from "./ProgressTableRow";

// ------------------------------------ CONSTANTS ------------------------------------
const PROGRESS_ITEMS_PER_PAGE = 7;
const INITIAL_PAGE_NUMBER = 1;

// ---------------------------------- TABLE REDUCER ----------------------------------
const TABLE_ACTIONS = {
  SET_COLUMN_HEADERS: "SET_COLUMN_HEADERS",
  SET_ROWS: "SET_ROWS",
  SET_PAGE_NUMBER: "SET_PAGE_NUMBER",
};

const INITIAL_TABLE_STATE = {
  columnHeaders: null,
  rows: null,
  pageNumber: null,
};

const tableReducer = (state, action) => {
  switch (action.type) {
    case TABLE_ACTIONS.SET_COLUMN_HEADERS:
      return { ...state, columnHeaders: action.payload };
    case TABLE_ACTIONS.SET_ROWS:
      return { ...state, rows: action.payload };
    case TABLE_ACTIONS.SET_PAGE_NUMBER:
      return { ...state, pageNumber: action.payload };
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
  const theme = useTheme();

  const displayableProgressItems = table.rows?.slice(
    PROGRESS_ITEMS_PER_PAGE * (table.pageNumber - 1),
    PROGRESS_ITEMS_PER_PAGE * table.pageNumber
  );

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

  // reset page number back to INITIAL_PAGE_NUMBER on progressType change
  useEffect(() => {
    tableDispatch({
      type: TABLE_ACTIONS.SET_PAGE_NUMBER,
      payload: INITIAL_PAGE_NUMBER,
    });
  }, [progressType]);

  // when user.progress changes, make sure the page number is
  // not out of bounds
  useEffect(() => {
    if (displayableProgressItems?.length === 0 && table.pageNumber > 1) {
      tableDispatch({
        type: TABLE_ACTIONS.SET_PAGE_NUMBER,
        payload: table.pageNumber - 1,
      });
    }
  }, [displayableProgressItems, table.pageNumber]);

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
        {displayableProgressItems?.length === 0 ? (
          <Box borderTop="1px solid #D3D3D3" py={2} px={1}>
            <Typography textAlign="center">
              No progress. Click the button above to add new{" "}
              {PROGRESS_TYPE_NAMES[progressType].plural}.
            </Typography>
          </Box>
        ) : (
          displayableProgressItems?.map((row) => (
            <ProgressTableRow
              key={row.id}
              row={row}
              columnHeaders={table.columnHeaders}
            />
          ))
        )}
        {/* Pagination */}
        {table.rows && (
          <Box display="grid" sx={{ placeItems: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(table.rows.length / PROGRESS_ITEMS_PER_PAGE)}
              page={table.pageNumber}
              onChange={(e, pageNumber) =>
                tableDispatch({
                  type: TABLE_ACTIONS.SET_PAGE_NUMBER,
                  payload: pageNumber,
                })
              }
              shape="rounded"
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "black",
                  "&:hover": {
                    background: theme.palette.primary.light,
                  },
                  "&.Mui-selected": {
                    background: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Box>
        )}
      </CustomCard>
    </Box>
  );
};

export default ProgressTable;
