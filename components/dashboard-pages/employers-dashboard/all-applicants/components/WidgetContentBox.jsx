"use client";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Applicants from "./Applicants";
import {
  loadAllApplicants,
  selectAllApplicants,
  selectAllApplicantsCounts,
  setApplicantsTab,
} from "@/store/slices/allApplicantsSlice";

const WidgetContentBox = () => {
  const dispatch = useDispatch();
  const { items, status, tab, query } = useSelector(selectAllApplicants);
  const counts = useSelector(selectAllApplicantsCounts);

  useEffect(() => {
    if (status === "idle") dispatch(loadAllApplicants());
  }, [status, dispatch]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    return items.filter((x) => {
      if (tab !== "all" && x.status !== tab) return false;
      if (!q) return true;
      const hay =
        `${x.cleaner_name || ""} ${x.job_title || ""} ${x.cover_letter || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, tab, query]);

  return (
    <div className="widget-content">
      <div className="tabs-box">
        <Tabs
          selectedIndex={["all", "a", "r"].indexOf(tab)}
          onSelect={(i) => dispatch(setApplicantsTab(["all", "a", "r"][i]))}
        >
          <div className="aplicants-upper-bar">
            <h6>All Applicants</h6>

            <TabList className="aplicantion-status tab-buttons clearfix">
              <Tab className="tab-btn totals"> Total(s): {counts.total}</Tab>
              <Tab className="tab-btn approved"> Approved: {counts.a}</Tab>
              <Tab className="tab-btn rejected"> Rejected(s): {counts.r}</Tab>
            </TabList>
          </div>

          <div className="tabs-content">
            <TabPanel>
              <div className="row">
                {status === "loading" ? (
                  <div className="col-12" style={{ padding: 16 }}>Loading…</div>
                ) : (
                  <Applicants items={filtered} />
                )}
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row">
                <Applicants items={filtered.filter((x) => x.status === "a")} />
              </div>
            </TabPanel>

            <TabPanel>
              <div className="row">
                <Applicants items={filtered.filter((x) => x.status === "r")} />
              </div>
            </TabPanel>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WidgetContentBox;
