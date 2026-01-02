'use client';
import { useSelector } from "react-redux";
import { 
  selectAppliedJobsCount,
  selectJobAlertsCount, 
  selectShortlistCount,
  selectMetricsLoading
} from '@/store/slices/metricsSlice';
import { selectUnreadCount } from '@/store/slices/messagesSlice';

const TopCardBlock = () => {
  // Use selectors instead of direct state access
  const appliedJobs = useSelector(selectAppliedJobsCount);
  const jobAlerts = useSelector(selectJobAlertsCount);
  // Use global unread messages count from messages slice
  const messages = useSelector(selectUnreadCount) || 0;
  const shortlist = useSelector(selectShortlistCount);
  const loading = useSelector(selectMetricsLoading);

  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: loading ? "..." : String(appliedJobs),
      metaName: "Applied Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: loading ? "..." : String(jobAlerts),
      metaName: "Job Alerts",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: "la-comment-o",
      countNumber: loading ? "..." : String(messages),
      metaName: "Messages",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: "la-bookmark-o",
      countNumber: loading ? "..." : String(shortlist),
      metaName: "Shortlist",
      uiClass: "ui-green",
    },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i className={`icon la ${item.icon}`}></i>
            </div>
            <div className="right">
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
