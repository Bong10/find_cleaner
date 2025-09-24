// import Image from "next/image";

// const ImageBox = () => {
//   return (
//     <div className="image-box">
//       <figure className="main-image" data-aos="fade-in" data-aos-delay="1200">
//         <Image
//           width={595}
//           height={627}
//           src="/images/index-13/header/2.png"
//           alt="hero image"
//         />
//       </figure>
//       {/* hero image */}
//     </div>
//   );
// };

// export default ImageBox;


import Image from "next/image";

const ImageBox = () => {
  return (
    <div className="image-box">
      <figure className="main-image" data-aos="fade-in" data-aos-delay="500">
        <Image
          width={600}
          height={626}
          src="/images/index-13/header/1.png"
          alt="hero image"
        />
      </figure>
      {/* hero image */}
      {/* <!-- Info BLock One --> */}
      <div className="info_block" data-aos="fade-in" data-aos-delay="1000">
        <span className="icon flaticon-email"></span>
        <p>
        Chat Directly with <br />
        Professionals
        </p>
      </div>
      {/* <!-- Info BLock Two --> */}
      <div className="info_block_two" data-aos="fade-in" data-aos-delay="2000">
        <p>10,000+ Satisfied Customers</p>
        <div className="image">
          <Image
            width={206}
            height={53}
            src="/images/resource/multi-peoples.png"
            alt="mulit people"
          />
        </div>
      </div>
      {/* <!-- Info BLock Three --> */}
      <div
        className="info_block_three"
        data-aos="fade-in"
        data-aos-delay="1500"
      >
        <span className="icon flaticon-briefcase"></span>
        <p>Helping</p>
        <span className="sub-text">Businesses and Homes Shine</span>
        <span className="right_icon fa fa-check"></span>
      </div>
      {/* <!-- Info BLock Four --> */}
      <div className="info_block_four" data-aos="fade-in" data-aos-delay="2500">
        <span className="icon flaticon-paper-plane-1"></span>
        <div className="inner">
        <p>Post a Job</p>
        <span className="sub-text">Connect with Verified Cleaners</span>
        </div>
      </div>
    </div>
  );
};

export default ImageBox;
