import Image from "next/image";

const Block1 = () => {
  const blockContent = [
    {
      id: 1,
      icon: "/images/resource/work-1.png",
      title: "Create Your Profile",
      text: `Sign up as a cleaner or client in minutes. Cleaners can showcase their skills, experience, and availability, while clients can post cleaning job requirements effortlessly.`,
    },
    {
      id: 2,
      icon: "/images/resource/work-2.png",
      title: "Connect & Match",
      text: `Our smart matching system connects cleaners with suitable jobs based on location, skills, and preferences. Clients can review detailed profiles and make informed hiring decisions.`,
    },
    {
      id: 3,
      icon: "/images/resource/work-3.png",
      title: "Work with Confidence",
      text: `Book jobs securely with our verified payment system. Track work history, leave reviews, and build your reputation. We're here to support you every step of the way.`,
    },
  ];
  return (
    <>
      {blockContent.map((item) => (
        <div className="work-block col-lg-4 col-md-6 col-sm-12" key={item.id}>
          <div className="inner-box">
            <figure className="image">
              <Image
                width={105}
                height={113}
                src={item.icon}
                alt="how it works"
              />
            </figure>
            <h5>{item.title}</h5>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Block1;
