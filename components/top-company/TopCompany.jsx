'use client';

import topCompany from "../../data/topCompany";
import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";

const TopCompany = () => {
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} arrows={false}>
      {topCompany.map((service) => (
        <div className="company-block" key={service.id}>
          <div className={`inner-box ${service.bgColor}`}>
            <figure className="image">
              <Image
                width={90}
                height={90}
                src={service.img}
                alt="cleaning service"
              />
            </figure>
            <h4 className="name">
              <Link href={`/services/${service.id}`}>{service.name}</Link>
            </h4>
            <div className="description">{service.description}</div>
            <div className="location">
              <i className="flaticon-map-locator"></i> {service.serviceArea}
            </div>
            <div className="tasks-completed">
              <i className="flaticon-check"></i> {service.tasksCompleted} Tasks Completed
            </div>
            <div className="rating">
              <i className="flaticon-star"></i> {service.ratings.score} ★ ({service.ratings.reviews} reviews)
            </div>
            <Link
              href={`/services/${service.id}`}
              className="theme-btn btn-style-three"
            >
              Explore Service
            </Link>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default TopCompany;
