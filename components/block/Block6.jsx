const Block6 = () => {
  const blockContent = [
    {
      id: 1,
      icon: "icon-doc", // Task paper or checklist icon
      title: "Post a Task",
      text: "Describe your cleaning needs in a few simple steps.",
      bgClass: "-blue",
    },
    {
      id: 2,
      icon: "icon-case", // Profile icon or magnifying glass
      title: "Find Cleaners",
      text: "Get matched with verified professionals near you.",
      bgClass: "-red",
    },
    {
      id: 3,
      icon: "icon-doc", // Smile icon or relaxed couch
      title: "Relax and Enjoy",
      text: "Sit back while your cleaning task is completed.",
      bgClass: "-yellow",
    },
  ];
  
  return (
    <>
      {blockContent.map((item) => (
        <div className="col-lg-4 col-md-6 col-sm-12" key={item.id}>
          <div className="work-block -type-2 mb-0">
            <div className="inner-box">
              <div className={`icon-wrap ${item.bgClass}`}>
                <span className={`icon ${item.icon}`}></span>
              </div>
              <h5>{item.title}</h5>
              <p>{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Block6;
