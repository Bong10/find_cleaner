'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addKeyword, addLocation, addCategory } from "@/store/slices/filterSlice";

const JobSearchForm = () => {
  const dispatch = useDispatch();
  const { jobList } = useSelector((s) => s.filter) || {};
  const [local, setLocal] = useState({
    keyword: jobList?.keyword || '',
    location: jobList?.location || '',
    category: jobList?.category || '',
  });

  const onChange = (key) => (e) =>
    setLocal((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    // 1) push values into redux (this triggers the search)
    dispatch(addKeyword((local.keyword || '').trim()));
    dispatch(addLocation((local.location || '').trim()));
    dispatch(addCategory((local.category || '').trim()));

    // 2) notify any listeners to fetch with current redux filters
    document.dispatchEvent(new CustomEvent('public-jobs:search'));

    // 3) clear the form inputs (UI only; redux keeps the submitted values)
    setLocal({ keyword: '', location: '', category: '' });
  };

  return (
    <form className="job-search-form" onSubmit={onSubmit}>
      <div className="row">
        <div className="form-group col-lg-4 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            value={local.keyword}
            onChange={onChange('keyword')}
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <span className="icon flaticon-map-locator"></span>
          <input
            type="text"
            placeholder="City or postcode"
            value={local.location}
            onChange={onChange('location')}
          />
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
          <span className="icon flaticon-briefcase"></span>
          <input
            type="text"
            placeholder="Choose a category"
            value={local.category}
            onChange={onChange('category')}
          />
        </div>

        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one">
            Find Jobs
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobSearchForm;
