import { useEffect, useState } from 'react';
import { MetricMeaseurement } from '@src/utils/consts';
import useSubmitData from '@src/hooks/useSubmitData';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { resetFormData } from '@src/utils/general';
import CreateObjectiveForm from './CreateObjectiveForm';
import { ApiRoutes } from '../../../../utils/ApiRoutes';
import { getCycles } from '../../../../hooks';

export default function CreateObjectiveLogic({ selectedDept, selectedEmp }) {

  const { submitData } = useSubmitData()
  const [yearFilter, setYearFilter] = useState('');
  const [metric, setMetric] = useState('Number');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startValue: '',
    targetValue: '',
    weight: '',
    startDate: '',
    endDate: '',
    currency: '',
    cycleId: '',
    cycles: '',
    yesorNoValue: ''
  })


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const submissionData = {
      ...(selectedEmp ? { employee_id: selectedEmp } : ''),
      ...(selectedDept ? { department_id: selectedDept } : ''),
      title: formData.title,
      description: formData.description,
      weight: formData.weight,
      performance_cycle_id: formData.cycleId,
      start_date: formData.startDate,
      end_date: formData.endDate,
      metric_type: metric
    };

    // Add fields specific to each metric
    switch (metric) {
      case MetricMeaseurement.CURRENCY:
        submissionData.currency = formData.currency;
        submissionData.start_value = formData.startValue;
        submissionData.target_value = formData.targetValue;
        break;

      case MetricMeaseurement.NUMBER:
      case MetricMeaseurement.PERCENTAGE:
        submissionData.start_value = formData.startValue;
        submissionData.target_value = formData.targetValue;
        break;

      case MetricMeaseurement.YESORNO:
        submissionData.target_value = formData.yesorNoValue;
        break;

      case MetricMeaseurement.RATINGSCALE:
        // Add any specific fields for rating scale if needed
        break;

      default:
        break;
    }

    if (submissionData.start_date == '' || submissionData.end_date == '') {
      delete submissionData['start_date']
      delete submissionData['end_date']
    }
    const response = await submitData({
      endpoint: ApiRoutes.performanceManager.objectives.create,
      data: submissionData,
      reload: false
    });

    if (response?.success) {
      resetFormData(formData);
    }
  }

  const { data: cycleData, error, isLoading } = useQuery({
    queryKey: ['cyclesData', yearFilter],
    queryFn: async () => await getCycles(submitData, yearFilter),
    keepPreviousData: false,
  })
  const activeCycles = cycleData?.filter(cycle => cycle.status === 'active') || [];

  useEffect(() => {
    if (activeCycles.length > 0) {
      if (formData.cycleId !== activeCycles[0].id) {
        setFormData((prev) => ({
          ...prev,
          cycleId: activeCycles[0].id
        }));
      }
    } else if (formData.cycles) {
      if (formData.cycleId !== formData.cycles) {
        setFormData((prev) => ({
          ...prev,
          cycleId: formData.cycles
        }));
      }
    }
  }, [activeCycles, formData.cycles, formData.cycleId]);



  return (
    <>
      <CreateObjectiveForm
        metric={metric}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        setMetric={setMetric}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        cycleData={cycleData}
      />
    </>
  )
}

