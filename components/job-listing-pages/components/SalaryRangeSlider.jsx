'use client';

import { useEffect, useState } from 'react';
import InputRange from 'react-input-range';
import { useDispatch, useSelector } from 'react-redux';
import { addSalary } from "../../../store/slices/filterSlice";

const SalaryRangeSlider = () => {
  const { jobList } = useSelector((state) => state.filter);

  // local UI state
  const [salary, setSalary] = useState({
    min: jobList.salary.min ?? 10,
    max: jobList.salary.max ?? 30,
  });

  const dispatch = useDispatch();

  // keep in sync with Redux when jobList changes
  useEffect(() => {
    setSalary({
      min: jobList.salary.min ?? 10,
      max: jobList.salary.max ?? 30,
    });
  }, [jobList]);

  // called when user releases the slider
  const handleOnChangeComplete = (value) => {
    dispatch(addSalary({ min: value.min, max: value.max }));
  };

  return (
    <div className="range-slider-one salary-range">
      <InputRange
        formatLabel={() => ``}
        minValue={10}
        maxValue={30}
        value={{ min: salary.min, max: salary.max }}
        onChange={(value) => setSalary(value)}              // only local update
        onChangeComplete={(value) => handleOnChangeComplete(value)} // dispatch to Redux
      />
      <div className="input-outer">
        <div className="amount-outer">
          <span className="d-inline-flex align-items-center">
            <span className="min">£{salary.min}</span>
            <span className="max ms-2">£{salary.max}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalaryRangeSlider;
