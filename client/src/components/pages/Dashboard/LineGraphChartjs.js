import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import CustomCard from "../../../mui/CustomCard";
import { useTheme } from "@emotion/react";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
const rawData = [
  {
    "Weight in mornings on empty stomach, took a shit the night before": "Date",
    undefined: "Weight",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-Nov-21",
    undefined: "76.36",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-Nov-21",
    undefined: "76.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-Nov-21",
    undefined: "75.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-Nov-21",
    undefined: "75.36",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-Nov-21",
    undefined: "75.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "18-Nov-21",
    undefined: "75.35",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-Nov-21",
    undefined: "75.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-Nov-21",
    undefined: "74.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-Nov-21",
    undefined: "74.35",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-Nov-21",
    undefined: "74.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-Nov-21",
    undefined: "74.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-Nov-21",
    undefined: "74.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-Nov-21",
    undefined: "74.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-Nov-21",
    undefined: "74.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "29-Nov-21",
    undefined: "74.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "30-Nov-21",
    undefined: "73.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-Dec-21",
    undefined: "74.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-Dec-21",
    undefined: "73.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "3-Dec-21",
    undefined: "73.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "4-Dec-21",
    undefined: "73.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "5-Dec-21",
    undefined: "73.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "6-Dec-21",
    undefined: "73.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "7-Dec-21",
    undefined: "73.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "8-Dec-21",
    undefined: "72.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "9-Dec-21",
    undefined: "72.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "10-Dec-21",
    undefined: "72.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-Dec-21",
    undefined: "72.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-Dec-21",
    undefined: "72.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "13-Dec-21",
    undefined: "72",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "14-Dec-21",
    undefined: "71.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-Dec-21",
    undefined: "71.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-Dec-21",
    undefined: "71.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-Dec-21",
    undefined: "70.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-Dec-21",
    undefined: "70.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-Dec-21",
    undefined: "70.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-Dec-21",
    undefined: "69.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-Dec-21",
    undefined: "69.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-Dec-21",
    undefined: "69.4",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-Dec-21",
    undefined: "69.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-Dec-21",
    undefined: "70.3",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-Dec-21",
    undefined: "69.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "27-Dec-21",
    undefined: "69.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "28-Dec-21",
    undefined: "69.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "29-Dec-21",
    undefined: "69.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "30-Dec-21",
    undefined: "68.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "31-Dec-21",
    undefined: "68.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-Jan-22",
    undefined: "68.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-Jan-22",
    undefined: "68.35",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "3-Jan-22",
    undefined: "68.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "4-Jan-22",
    undefined: "68.35",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "5-Jan-22",
    undefined: "67.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "6-Jan-22",
    undefined: "67.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "7-Jan-22",
    undefined: "67.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "8-Jan-22",
    undefined: "67.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "9-Jan-22",
    undefined: "67.6",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "10-Jan-22",
    undefined: "67.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-Jan-22",
    undefined: "67.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-Jan-22",
    undefined: "67.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "13-Jan-22",
    undefined: "67.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "14-Jan-22",
    undefined: "67.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-Jan-22",
    undefined: "67.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-Jan-22",
    undefined: "67.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-Jan-22",
    undefined: "67.3",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "18-Jan-22",
    undefined: "67.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-Jan-22",
    undefined: "67.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-Jan-22",
    undefined: "67.4",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-Jan-22",
    undefined: "66.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-Jan-22",
    undefined: "66.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-Jan-22",
    undefined: "66.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-Jan-22",
    undefined: "66.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-Jan-22",
    undefined: "67.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-Jan-22",
    undefined: "66.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "27-Jan-22",
    undefined: "67.35",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "28-Jan-22",
    undefined: "66.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "29-Jan-22",
    undefined: "66.95",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "30-Jan-22",
    undefined: "66.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "31-Jan-22",
    undefined: "66.3",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-Feb-22",
    undefined: "66.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-Feb-22",
    undefined: "66.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "3-Feb-22",
    undefined: "66.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "4-Feb-22",
    undefined: "67.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "6-Feb-22",
    undefined: "66.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "7-Feb-22",
    undefined: "65.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "8-Feb-22",
    undefined: "65.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "9-Feb-22",
    undefined: "65.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "10-Feb-22",
    undefined: "65.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-Feb-22",
    undefined: "65.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-Feb-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "13-Feb-22",
    undefined: "65.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "14-Feb-22",
    undefined: "65.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-Feb-22",
    undefined: "65.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-Feb-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-Feb-22",
    undefined: "65.3",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "18-Feb-22",
    undefined: "65.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-Feb-22",
    undefined: "65.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-Feb-22",
    undefined: "65.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-Feb-22",
    undefined: "65.6",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-Feb-22",
    undefined: "66.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-Feb-22",
    undefined: "65.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-Feb-22",
    undefined: "65.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-Feb-22",
    undefined: "65.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-Feb-22",
    undefined: "65.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "27-Feb-22",
    undefined: "65.4",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "28-Feb-22",
    undefined: "65.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-Mar-22",
    undefined: "65.4",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-Mar-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "3-Mar-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "4-Mar-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "5-Mar-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "6-Mar-22",
    undefined: "64.95",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "7-Mar-22",
    undefined: "65.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "8-Mar-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "9-Mar-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "10-Mar-22",
    undefined: "64.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-Mar-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-Mar-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "13-Mar-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "14-Mar-22",
    undefined: "65.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-Mar-22",
    undefined: "65.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-Mar-22",
    undefined: "64.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-Mar-22",
    undefined: "65.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "18-Mar-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-Mar-22",
    undefined: "65.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-Mar-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-Mar-22",
    undefined: "65.6",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-Mar-22",
    undefined: "65.35",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-Mar-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-Mar-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-Mar-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-Mar-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "27-Mar-22",
    undefined: "64.95",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "28-Mar-22",
    undefined: "64.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "29-Mar-22",
    undefined: "65.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "30-Mar-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "31-Mar-22",
    undefined: "64.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-Apr-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-Apr-22",
    undefined: "65.1",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "3-Apr-22",
    undefined: "64.95",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "4-Apr-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "5-Apr-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "6-Apr-22",
    undefined: "64.95",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "7-Apr-22",
    undefined: "65.75",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "8-Apr-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "9-Apr-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "10-Apr-22",
    undefined: "65.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-Apr-22",
    undefined: "65.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-Apr-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "13-Apr-22",
    undefined: "64.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "14-Apr-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-Apr-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-Apr-22",
    undefined: "64.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-Apr-22",
    undefined: "64.7",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "18-Apr-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-Apr-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-Apr-22",
    undefined: "64.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-Apr-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-Apr-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-Apr-22",
    undefined: "64.4",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-Apr-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-Apr-22",
    undefined: "64.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-Apr-22",
    undefined: "64.95",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "27-Apr-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "28-Apr-22",
    undefined: "64.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "29-Apr-22",
    undefined: "64.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "30-Apr-22",
    undefined: "64.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-May-22",
    undefined: "64.45",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-May-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "3-May-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "4-May-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "5-May-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "6-May-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "7-May-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "8-May-22",
    undefined: "65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "9-May-22",
    undefined: "65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "10-May-22",
    undefined: "65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "11-May-22",
    undefined: "65.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "12-May-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "13-May-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "14-May-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "15-May-22",
    undefined: "64.9",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "16-May-22",
    undefined: "65.15",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "17-May-22",
    undefined: "64.8",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "18-May-22",
    undefined: "65.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "19-May-22",
    undefined: "64.6",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "20-May-22",
    undefined: "65.05",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "21-May-22",
    undefined: "65.25",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "22-May-22",
    undefined: "65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "23-May-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "24-May-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "25-May-22",
    undefined: "65.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "26-May-22",
    undefined: "65.2",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "27-May-22",
    undefined: "65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "28-May-22",
    undefined: "64.65",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "29-May-22",
    undefined: "64.85",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "30-May-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "31-May-22",
    undefined: "65.5",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "1-Jun-22",
    undefined: "64.55",
  },
  {
    "Weight in mornings on empty stomach, took a shit the night before":
      "2-Jun-22",
    undefined: "64.3",
  },
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const filteredData = rawData
  .map((item) => parseFloat(item.undefined))
  .filter((item) => !isNaN(item))
  .slice(-30);

const LineGraphChartjs = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    Math.max(...filteredData),
    Math.min(...filteredData),
  ]);

  useEffect(() => {
    setData(filteredData);
  }, []);

  // CHANGE FONT FAMILY FOR WHEN U HOVER OVER A POINT, ALSO
  // WHEN A POINT SHOULD BE CLICKABLE AND MORE INFO ABOUT SHOULD
  // APPEAR
  return (
    <CustomCard sx={{ height: "450px" }}>
      <Box height="100%" display="flex" flexDirection="column" fullWidth>
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Weight Progress</Typography>
        </Box>
        <Box flex={1} fullWidth>
          <Line
            options={{
              maintainAspectRatio: false,
              responsive: true,
              animation: {
                tension: {
                  duration: 1000,
                  easing: "easeInQuad",
                  from: 1,
                  to: 0,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: false,
                  text: "Chart.js Line Chart",
                },
              },
              scales: {
                x: {
                  ticks: {
                    display: true,
                    font: {
                      family: "Montserrat,sans-serif",
                      size: 16,
                      weight: 600,
                    },
                    color: "black",
                  },
                  grid: {
                    z: 1,
                    tickLength: 15,
                  },
                },
                y: {
                  ticks: {
                    display: true,
                    font: {
                      family: "Montserrat,sans-serif",
                      size: 16,
                      weight: 600,
                    },
                    color: "black",
                  },
                  grid: {
                    z: 1,
                    tickLength: 15,
                  },
                },
              },
            }}
            data={{
              labels: data.map((item, index) => index),
              datasets: [
                {
                  fill: true,
                  data: data,
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light,
                },
              ],
            }}
          />
        </Box>
      </Box>
    </CustomCard>
  );
};

export default LineGraphChartjs;
