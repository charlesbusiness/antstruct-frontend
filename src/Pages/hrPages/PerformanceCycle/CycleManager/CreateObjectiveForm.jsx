import {
  Box,
  Button,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  MenuItem,
  Divider,
  Paper
} from '@mui/material';
import { CURRENCY, MetricMeaseurement } from '@src/utils/consts';
import { LabelBox } from './LabelBox';
import { CycleCommonFields } from './CycleCommonFields';

export default function CreateObjectiveForm({
  yearFilter,
  setYearFilter,
  metric,
  setMetric,
  formData,
  handleInputChange,
  handleSubmit,
  cycleData
}) {

  return (
    <>
      <Box sx={{ mx: 'auto', }} component={'form'} onSubmit={handleSubmit}>
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
          <CycleCommonFields
            formData={formData}
            handleInputChange={handleInputChange}
            cycleData={cycleData}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
          />
          {
            cycleData ?
              <>
                <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Grid item xs={4} md={3}>
                    <LabelBox>
                      Key Result Title  <span style={{ color: 'red' }}>*</span>
                    </LabelBox>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <TextField
                      fullWidth
                      required
                      name='title'
                      placeholder="Make 40 out going calls"
                      value={formData?.title}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                  <Grid item xs={4} md={3}>
                    <LabelBox>Key Result Description</LabelBox>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name='description'
                      placeholder="What is this key result about"
                      value={formData?.description}
                      onChange={handleInputChange}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  How will this key result be measured? <span style={{ color: 'red' }}>*</span>
                </Typography>

                <ToggleButtonGroup
                  value={metric}
                  exclusive
                  onChange={(e, newMetric) => {
                    if (newMetric) setMetric(newMetric);
                  }}
                  fullWidth
                  color="primary"
                  sx={{
                    mb: 3,
                    '& .MuiToggleButton-root': {
                      textTransform: 'none',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      '&.Mui-selected': {
                        backgroundColor: '#1976d2',
                        color: 'white',
                      }
                    }
                  }}
                >
                  {Object.keys(MetricMeaseurement).map((key) => (
                    <ToggleButton key={key} value={MetricMeaseurement[key]}>
                      {MetricMeaseurement[key]}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                {metric === MetricMeaseurement.CURRENCY && (
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={4} md={4} lg={4}>
                      <LabelBox >Currency <span style={{ color: 'red' }}>*</span></LabelBox>
                    </Grid>
                    <Grid item xs={8} md={8} lg={8}>
                      <TextField
                        select
                        required
                        fullWidth
                        size="small"
                        name='currency'
                        value={formData?.currency}
                        onChange={handleInputChange}
                      >
                        {Object.keys(CURRENCY).map((key) => (
                          <MenuItem key={key} value={CURRENCY[key]}>
                            {CURRENCY[key]}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                )}

                {/* Value Fields */}
                {metric !== MetricMeaseurement.YESORNO && metric !== MetricMeaseurement.RATINGSCALE && (
                  <>
                    <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Grid item xs={4} md={4}>
                        <LabelBox>Start Value  <span style={{ color: 'red' }}>*</span></LabelBox>
                      </Grid>
                      <Grid item xs={8} md={8}>
                        <TextField
                          fullWidth
                          required
                          name='startValue'
                          type='number'
                          placeholder="0"
                          value={formData?.startValue}
                          onChange={handleInputChange}
                          size="small"
                        />
                      </Grid>
                    </Grid>


                    <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                      <Grid item xs={4} md={4}>
                        <LabelBox>Target Value  <span style={{ color: 'red' }}>*</span></LabelBox>
                      </Grid>
                      <Grid item xs={8} md={8}>
                        <TextField
                          fullWidth
                          required
                          name='targetValue'
                          type='number'
                          placeholder="10"
                          value={formData?.targetValue}
                          onChange={handleInputChange}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </>
                )}

                {metric === MetricMeaseurement.YESORNO && (
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={4} md={4}>
                      <LabelBox>Yes/No Value  <span style={{ color: 'red' }}>*</span></LabelBox>
                    </Grid>
                    <Grid item xs={8} md={8}>
                      <TextField
                        select
                        required
                        fullWidth
                        size="small"
                        name='yesorNoValue'
                        value={formData?.yesorNoValue}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                )}

                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={4} md={4}>
                    <LabelBox>Weight  <span style={{ color: 'red' }}>*</span></LabelBox>
                  </Grid>
                  <Grid item xs={8} md={8}>
                    <TextField
                      required
                      fullWidth
                      type='number'
                      size="small"
                      name='weight'
                      placeholder='5'
                      value={formData?.weight}
                      onChange={handleInputChange}
                    />

                  </Grid>
                </Grid>


                {/* Date section with divider */}
                <Divider sx={{ my: 3 }} />

                <Grid container alignContent={'space-between'} sx={{ mb: 2 }} pl={-2}>
                  <Grid item xs={3} md={3} lg={2} >
                    <LabelBox>Start Date</LabelBox>
                  </Grid>
                  <Grid item xs={4} md={4} lg={3.5}>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      name='startDate'
                      value={formData?.startDate}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>


                  <Grid item xs={6} md={3} lg={2} ml={2}>
                    <LabelBox>End Date</LabelBox>
                  </Grid>
                  <Grid item xs={6} md={4} lg={3.5}>
                    <TextField
                      fullWidth
                      type="date"
                      name='endDate'
                      size="small"
                      value={formData?.endDate}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  A start and end date that is not within the appraisal period cannot be selected.
                </Typography>

                <Button
                  variant="contained"
                  type='submit'
                  fullWidth
                  size="large"
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Save & Add Another Key Result
                </Button>
              </> :
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant='body1' align='center'>Please configure your appraiser cycle for the  {yearFilter} year to proceed</Typography>
              </>
          }
        </Paper>
      </Box>
    </>
  )
}

