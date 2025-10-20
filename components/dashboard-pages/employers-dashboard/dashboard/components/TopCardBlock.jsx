// components/dashboard-pages/employers-dashboard/dashboard/components/TopCardBlock.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyJobs } from "@/store/slices/myJobsSlice";
import { loadAllApplicants } from "@/store/slices/allApplicantsSlice";
import { selectShortlist, loadShortlist } from "@/store/slices/shortlistSlice";
import { selectUnreadCount } from "@/store/slices/messagesSlice";
import { selectAllChats } from "@/store/slices/chatsSlice";

const TopCardBlock = () => {
  const dispatch = useDispatch();

  // store slices
  const myJobs = useSelector((s) => s.myJobs);
  const allApps = useSelector((s) => s.allApplicants);
  const shortlistState = useSelector(selectShortlist);
  // Global unread messages count from messages slice
  const unreadMessages = useSelector(selectUnreadCount) || 0;
  // Chats list (optional: could compute unread chats if needed)
  const chats = useSelector(selectAllChats) || [];

  // ensure data is loaded (no UI changes)
  useEffect(() => {
    if (myJobs?.status === "idle") dispatch(fetchMyJobs({ months: 6 }));
  }, [dispatch, myJobs?.status]);

  useEffect(() => {
    if (allApps?.status === "idle") dispatch(loadAllApplicants());
  }, [dispatch, allApps?.status]);

  useEffect(() => {
    if (shortlistState?.status === "idle") dispatch(loadShortlist());
  }, [dispatch, shortlistState?.status]);

  // dynamic counts
  const postedJobs = myJobs?.items?.length ?? 0;
  const applications = allApps?.items?.length ?? 0;
  const shortlist = shortlistState?.items?.length ?? 0;

  // messages now dynamic from messages slice (unread messages total)
  const messages = unreadMessages;

  // show "…" while section is loading
  const show = (val, st) => (st === "loading" ? "…" : val);

  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: show(postedJobs, myJobs?.status),
      metaName: "Posted Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: show(applications, allApps?.status),
      metaName: "Application",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: "la-comment-o",
      countNumber: messages,
      metaName: "Messages",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: "la-bookmark-o",
      countNumber: show(shortlist, shortlistState?.status),
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
