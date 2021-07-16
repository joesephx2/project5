import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import { FormControl, FormControlLabel, FormLabel, Grid } from '@material-ui/core';
import { Typography, Radio, RadioGroup, InputLabel, MenuItem, Select } from '@material-ui/core';



const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function ViewScores() {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [testData, setTestData] = useState([]);
  const [updatedFlag, setUpdatedFlag] = useState(false);
  const [updateField, setUpdateField] = useState(false);
  const [clickedId, setClickedId] = useState(null);
  // const [pushups, setPushups] = useState(null);
  // const [situps, setSitups] = useState(null);
  // const [runTime, setRunTime] = useState(null);
  const [tmpRowValues, setTmpRowValues] = useState({});

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, testData.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (id) => {
    fetch('http://localhost:3001/tests', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ test_id: id }) // body data type must match "Content-Type" header
    })
      .then(() => setUpdatedFlag(!updatedFlag))//fetch chain      
      .catch(err => {
        console.error(err);
      })
  }

  useEffect(() => {
    console.log('fetching database data')
    fetch('http://localhost:3001/tests')
      .then((response) => {
        return response.json();
      })
      .then(data => {
        data = data.sort((a, b) => {
          let lnameA = a.last_name.toUpperCase(); // ignore upper and lowercase
          let lnameB = b.last_name.toUpperCase();
          let fnameA = a.first_name.toUpperCase();
          let fnameB = b.first_name.toUpperCase();
          if (lnameA < lnameB) { return -1; }
          else if (lnameA > lnameB) { return 1; }
          else if (fnameA < fnameB) { return -1; }
          else if (fnameA > fnameB) { return 1; }
          else return 0;
        });
        return data;
      })
      .then(setTestData)
      .catch(err => {
        console.error(err);
      });//fetch
  }, [updatedFlag]);//useEffect initial API call

  function getRunScore(runtime) {
    let maxPoints = 60
    let maxRun = 9.12
    let tmp = runtime.split(':');
    let runMin = tmp[0];
    let runSec = tmp[1];
    let runNum = parseFloat([runMin, runSec].join('.'))
    if (runNum < maxRun) {
      return 60
    } else {
      return (Math.round(((maxRun / runNum) * maxPoints) * 100) / 100)
    }
  }


  function getSitupsScore(situps) {
    let maxSitups = 58
    let maxScore = 20

    if (situps >= maxSitups) {
      return maxScore
    } else {
      return parseFloat(((situps / maxSitups) * maxScore).toFixed(1));
    }
  }

  function getPushupsScore(pushups) {
    let maxPushups = 67
    let maxScore = 20
    console.log('getPushupsScore', pushups);
    if (pushups >= maxPushups) {
      return maxScore
    } else {
      return parseFloat(((pushups / maxPushups) * maxScore).toFixed(1));
    }
  }

  function onUpdate() {

    console.log('onUpdate tmpRowValue', tmpRowValues);
    // let updatedData = {...tmpRowValues, test_id: clickedId, push_ups_score: pushupScore, sit_ups_score: situpsScore};
    // console.log('onUpdate() updatedData: ', updatedData);
    fetch('http://localhost:3001/tests', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(tmpRowValues) // body data type must match "Content-Type" header
    })
      // .then(setTmpRowValues({}))
      .then(() => setUpdatedFlag(!updatedFlag))//fetch chain      
      .catch(err => {
        console.error(err);
      })


  }

  function captureUserInputs(inputs) {
    console.log('captureUserInputs', inputs);
    console.log('tmprowValues before setTmpRowValues', tmpRowValues);
    let scores = { push_ups_score: getPushupsScore(tmpRowValues.push_ups), sit_ups_score: getSitupsScore(tmpRowValues.sit_ups), run_time_score: getRunScore(tmpRowValues.run_time.slice(0, 5)) }
    console.log('scores before total', scores);
    let sumValues = Object.values(scores).reduce((a, b) => a + b);
    console.log('sumValues', sumValues);
    scores = { ...scores, total_score: sumValues.toFixed(1) };
    console.log('scores with total score', scores);
    let tmp = { test_id: clickedId, ...tmpRowValues, ...inputs, ...scores };
    console.log('setTmpRowValues inputs', tmp);
    //setTmpRowValues({...tmpRowValues, ...inputs, push_ups_score: getPushupsScore(tmpRowValues.push_ups), sit_ups_score: getSitupsScore(tmpRowValues.sit_ups)});
    setTmpRowValues({ ...tmp });
    console.log('captureUserInputs tmpRowValues: ', tmpRowValues);
    console.log('getUpshupsScore', getPushupsScore(tmpRowValues.push_ups));
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Delete</TableCell>
            <TableCell>Update</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Push-ups</TableCell>
            <TableCell>Push-up score</TableCell>
            <TableCell>Run time</TableCell>
            <TableCell>Run time score</TableCell>
            <TableCell>Sit-ups</TableCell>
            <TableCell>Sit-up score</TableCell>
            <TableCell>Test Date</TableCell>
            <TableCell>Total score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0 && testData
            ? testData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : testData
          ).map((testData) => (
            <TableRow key={testData.test_id}>
              <TableCell onClick={() => {
                handleDelete(testData.test_id)
              }
              } component="th" scope="row">
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </TableCell>

              {updateField === false || clickedId !== testData.test_id ?
                <>
                  <TableCell component="th" scope="row">
                    <Button onClick={() => {
                      setClickedId(testData.test_id);
                      setUpdateField(true);
                      setTmpRowValues(testData);
                      console.log('onClick update called');
                    }}>Update</Button>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.first_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.last_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.age}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.gender}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.push_ups}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.push_ups_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.run_time.slice(0, 5)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.run_time_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.sit_ups}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.sit_ups_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.test_date.slice(0, 10)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {testData.total_score}
                  </TableCell>
                </>
                :
                <>
                  <TableCell component="th" scope="row">
                    <Button onClick={() => {
                      setClickedId(testData.test_id);
                      setUpdateField(!updateField);
                      setTmpRowValues(testData);
                    }}>Cancel
                    </Button>
                    <Button onClick={() => {
                      onUpdate();
                      setUpdateField(!updateField);
                    }}>Submit</Button>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <TextField label="First Name" defaultValue={tmpRowValues.first_name} onChange={(event) => {
                      captureUserInputs({ first_name: event.target.value })
                    }
                    } />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <TextField label="Last Name" defaultValue={tmpRowValues.last_name} onChange={(event) => {
                      captureUserInputs({ last_name: event.target.value })
                    }
                    } />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <TextField type='number' min='16' label="Age" defaultValue={tmpRowValues.age} onChange={(event) => {
                      captureUserInputs({ age: event.target.value })
                    }
                    } />
                  </TableCell>
                  <TableCell component="th" scope="row">
                 
                <FormControl className={classes.field}>
              <InputLabel id="label">Gender</InputLabel>
              <Select labelId="label" value = {tmpRowValues.gender} onChange={(e)=> captureUserInputs({ gender: e.target.value })} >
                <MenuItem value={'female'}>Female</MenuItem>
                <MenuItem value={'male'}>Male</MenuItem>
 
                
              </Select>
            </FormControl>

                  </TableCell>
                  <TableCell component="th" scope="row">
                    <TextField type="number" min="0" label="Push Ups" defaultValue={tmpRowValues.push_ups} onChange={(event) => {
                      // setPushups(event.target.value)
                      captureUserInputs({ push_ups: event.target.value })
                    }
                    } />
                  </TableCell>
                  
                  <TableCell component="th" scope="row" type='number' min='0' step='0.1'>
                    {tmpRowValues.push_ups_score}
                  </TableCell>
                  
                  <TableCell component="th" scope="row">
                    <Table>
                    <TableRow>
                    <TextField type = 'number' label="Minutes" min = '0' max = '59' step = '1'  defaultValue={tmpRowValues.run_time.slice(0,2)} onChange={(event) => {
                      let tmp = '';
                      if(event.target.value < 10) 
                        tmp = ('0' + String(event.target.value));
                      else tmp = String(event.target.value);
                      captureUserInputs({ run_time: (tmp + tmpRowValues.run_time.slice(2,5)) } );
                      // setRunTime(event.target.value)
                    }}
                    />
     
                    <TextField type = 'number' label="Seconds"  min = '0' max = '59' step = '1' defaultValue={tmpRowValues.run_time.slice(3, 5)} onChange={(event) => {
                         let tmp = '';
                         if(event.target.value < 10) 
                           tmp = ('0' + String(event.target.value));
                         else tmp = String(event.target.value);
                      
                      captureUserInputs({ run_time: (tmpRowValues.run_time.slice(0,3) + tmp) } );
                      // setRunTime(event.target.value)
                    }}
                    />
                  </TableRow>

                  </Table>

                  </TableCell>
                  
                  <TableCell component="th" scope="row">
                    {tmpRowValues.run_time_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <TextField type="number" min='0' label="Sit Ups" defaultValue={tmpRowValues.sit_ups} onChange={(event) => {
                      captureUserInputs({ sit_ups: event.target.value })
                      // setSitups(event.target.value)
                    }}
                    />
                  </TableCell>
                  
                  <TableCell component="th" scope="row">
                    {tmpRowValues.sit_ups_score}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    
                    <TextField type="date" label="Test Date" defaultValue={tmpRowValues.test_date.slice(0, 10)} onChange={e => {
                      captureUserInputs({ test_date: e.target.value })

                    }} />
                  </TableCell>
                  
                  
                  <TableCell component="th" scope="row">
                    {tmpRowValues.total_score}
                  </TableCell>

                </>
              }
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={testData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}