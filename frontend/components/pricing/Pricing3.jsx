import Image from "next/image";
import Link from "next/link";

const Pricing3 = () => {
  const pricingCotent = [
    {
      id: 1,
      img: "/images/index-13/pricing/1.svg",
      type: "Basic Cleaning",
      price: "Free",
      duration: "per month",
      features: [
        "Post up to 2 cleaning tasks",
        "Access to verified cleaners",
        "Basic support",
        "Standard listing for 7 days",
      ],
    },
    {
      id: 2,
      img: "/images/index-13/pricing/2.svg",
      type: "Premium Cleaning",
      price: "£5",
      duration: "per month",
      features: [
        "Post unlimited cleaning tasks",
        "Access to premium cleaners",
        "Priority support",
        "Priority listing for 30 days",
      ],
    },
    // {
    //   id: 3,
    //   img: "/images/index-13/pricing/3.svg",
    //   type: "Elite Cleaning",
    //   price: "£99.95",
    //   duration: "per month",
    //   features: [
    //     "Unlimited tasks with guaranteed matches",
    //     "Top-rated cleaners only",
    //     "24/7 premium customer support",
    //     "Featured listings for 30 days",
    //   ],
    // },
  ];
  

  return (
    <>
      {pricingCotent.map((item) => (
        <div className="col-lg-4 col-md-6" key={item.id}>
          <div className="pricingCard -type-2">
            <h4 className="pricingCard__title">{item.type}</h4>
            <div className="pricingCard__price">{item.price}</div>
            <div className="pricingCard__subtitle">{item.duration}</div>

            <div className="pricingCard__img">
              <Image width={90} height={91} src={item.img} alt="images" />
            </div>

            <div className="pricingCard__text text-left">
              Standard listing submission, active for 30 days
            </div>

            <ul className="pricingCard__list">
              {item.features.map((val, i) => (
                <li key={i}>{val}</li>
              ))}
            </ul>

            <div className="pricingCard__btn">
              <Link href="/shop/cart" className="theme-btn btn-style-modern">
              Choose Plan
              </Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Pricing3;
