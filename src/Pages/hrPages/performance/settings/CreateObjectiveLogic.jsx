import { useEffect, useState } from 'react';
import { MetricMeaseurement } from '../../../utils/consts';
import useSubmitData from '../../../hooks/useSubmitData';
import { useParams } from 'react-router';
import { getCycles } from '../../../hooks';
import { useQuery } from '@tanstack/react-query';
import { ApiRoutes } from '../../../utils/ApiRoutes';
import { resetFormData } from '../../../utils/general';
import CreateObjectiveForm from './CreateObjectiveForm';

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
      ...(selectedEmp ? { employee: selectedEmp } : ''),
      ...(selectedDept ? { department: selectedDept } : ''),
      title: formData.title,
      description: formData.description,
      weight: formData.weight,
      cycleId: formData.cycleId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      metricType: metric
    };

    // Add fields specific to each metric
    switch (metric) {
      case MetricMeaseurement.CURRENCY:
        submissionData.currency = formData.currency;
        submissionData.startValue = formData.startValue;
        submissionData.targetValue = formData.targetValue;
        break;

      case MetricMeaseurement.NUMBER:
      case MetricMeaseurement.PERCENTAGE:
        submissionData.startValue = formData.startValue;
        submissionData.targetValue = formData.targetValue;
        break;

      case MetricMeaseurement.YESORNO:
        submissionData.yesNoTarget = formData.yesorNoValue;
        break;

      case MetricMeaseurement.RATINGSCALE:
        // Add any specific fields for rating scale if needed
        break;

      default:
        break;
    }

    if (submissionData.startDate == '' || submissionData.endDate == '') {
      delete submissionData['startDate']
      delete submissionData['endDate']
    }
    const response = await submitData({
      endpoint: ApiRoutes.performance.objectives.createObjectives,
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
    keepPreviousData: true,
  })

  const activeCycles = cycleData?.data?.filter(cycle => cycle.status === 'active') || [];

  useEffect(() => {
    if (activeCycles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        cycleId: activeCycles[0]._id
      }));
    } else if (formData.cycles) {
      setFormData((prev) => ({
        ...prev,
        cycleId: formData.cycles
      }));
    }
  }, [activeCycles, formData.cycles]);


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

