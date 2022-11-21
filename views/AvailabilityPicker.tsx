import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import parseJSON from "date-fns/parseJSON";
import intlFormat from "date-fns/intlFormat";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import addDays from "date-fns/addDays";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import parse from "date-fns/parse";
import isWithinInterval from "date-fns/isWithinInterval";
import { Availability, Status } from "../lib/availability";

type SpecialDate = {
  date: string;
  name: string;
};

function get2023SpecialDateText(friday: Date): string | undefined {
  const tuesday = addDays(friday, 4);

  const specialDates: SpecialDate[] = [
    { date: "2023-01-16", name: "Martin Luther King's Day (USA)" },
    { date: "2023-02-12", name: "Super Bowl (USA)" },
    { date: "2023-02-20", name: "President's Day (USA)" },
    { date: "2023-02-20", name: "Mid-Winter Break (MA)" },
    { date: "2023-02-24", name: "Mid-Winter Break (MA)" },
    { date: "2023-03-17", name: "St. Patrick's Day" },
  ];
  const matchingDates = [];
  for (const date of specialDates) {
    const specialDate = parse(date.date, "yyyy-MM-dd", new Date());
    if (
      isWithinInterval(specialDate, {
        start: friday,
        end: tuesday, // include Monday holidays
      })
    ) {
      matchingDates.push(date);
    }
  }
  return matchingDates.map((d) => d.name).join(", ");
}

export default function AvailabilityPicker({
  state,
  setState,
  setSubmitted,
}: {
  state: Availability;
  setState: React.Dispatch<React.SetStateAction<Availability>>;
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  function handleChange(key: string, status: Status | null) {
    setSubmitted(false);
    if (status === null) {
      return;
    }
    setState({
      ...state,
      [key]: status,
    });
  }

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">
        What dates are you currently available?
      </FormLabel>
      {isMobile ? (
        <Box mb={2}>
          <Stack direction="row" alignItems="center">
            <CancelIcon /> Unavailable
          </Stack>
          <Stack direction="row" alignItems="center">
            <CheckCircleIcon /> Available
          </Stack>
          <Stack direction="row" alignItems="center">
            <StarIcon /> Preferred
          </Stack>
        </Box>
      ) : (
        ""
      )}
      <FormGroup>
        <Stack spacing={1}>
          {Object.keys(state).map((key) => {
            const date = parse(key, "yyyy-MM-dd", new Date());
            const status = state[key];
            const specialDate = get2023SpecialDateText(date);
            return (
              <Stack key={key} direction="row" alignItems="center" spacing={1}>
                <ToggleButtonGroup
                  key="controls"
                  exclusive
                  value={status}
                  onChange={(
                    e: React.MouseEvent<HTMLElement>,
                    value: Status
                  ) => {
                    return handleChange(key, value);
                  }}
                  aria-label="availability"
                  size="small"
                >
                  <ToggleButton
                    value={Status.Unavailable}
                    color="error"
                    aria-label="unavailable"
                  >
                    {isMobile ? (
                      <CancelIcon />
                    ) : (
                      <>
                        <CancelIcon fontSize="small" />
                        Can't Go
                      </>
                    )}
                  </ToggleButton>
                  <ToggleButton
                    value={Status.Available}
                    color="success"
                    aria-label="available"
                  >
                    {isMobile ? (
                      <CheckCircleIcon />
                    ) : (
                      <>
                        <CheckCircleIcon fontSize="small" />
                        Avail
                      </>
                    )}
                  </ToggleButton>
                  <ToggleButton
                    value={Status.Preferred}
                    color="secondary"
                    aria-label="preferred"
                  >
                    {isMobile ? (
                      <StarIcon />
                    ) : (
                      <>
                        <StarIcon fontSize="small" />
                        Prefer
                      </>
                    )}
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography key="date">
                  {intlFormat(date, {
                    weekday: isMobile ? "short" : "long",
                    month: isMobile ? "numeric" : "long",
                    day: "numeric",
                  }).replace(" ", "\u00A0")}{" "}
                  to{" "}
                  {intlFormat(addDays(date, 2), {
                    weekday: isMobile ? "short" : "long",
                    month: isMobile ? "numeric" : "long",
                    day: "numeric",
                  }).replace(" ", "\u00A0")}
                  {specialDate
                    ? ` [${specialDate.replace(" ", "\u00A0")}]`
                    : ""}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </FormGroup>
    </FormControl>
  );
}