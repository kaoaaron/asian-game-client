import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ClassicModeList = ({ filter, handleFilterChange, filteredData }) => {
  return (
    <>
      <FormControl component="fieldset">
        <RadioGroup
          row
          value={filter}
          onChange={handleFilterChange}
          aria-label="filter"
          name="filter"
        >
          <FormControlLabel value="10" control={<Radio />} label="10" />
          <FormControlLabel value="30" control={<Radio />} label="30" />
          <FormControlLabel value="50" control={<Radio />} label="50" />
          <FormControlLabel value="100" control={<Radio />} label="100" />
          <FormControlLabel value="150" control={<Radio />} label="150" />
          <FormControlLabel value="200" control={<Radio />} label="200" />
        </RadioGroup>
      </FormControl>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "lightgray" }}>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Date completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData ? (
              filteredData.map((row, idx) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {idx + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>
                    {`${((row.scored / row.total) * 100).toFixed(2)}% (${
                      row.scored
                    }/${row.total})`}
                  </TableCell>
                  <TableCell>{`${
                    row.completedAt.getMonth() + 1
                  }/${row.completedAt.getDate()}, ${row.completedAt.getFullYear()}`}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ClassicModeList;
