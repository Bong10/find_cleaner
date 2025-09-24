module.exports = [
  {
    id: 1,
    title: "For Employers",
    menuList: [
      { name: "Find Cleaners", route: "/employers-list-v3" },
      { name: "Post a Job", route: "/employers-dashboard/post-jobs" },
      { name: "Pricing Plans", route: "/pricing" },
      { name: "FAQs for Employers", route: "/faq" },
      { name: "Support Center", route: "/contact" },
    ],
  },
  {
    id: 2,
    title: "For Cleaners",
    menuList: [
      { name: "Join as a Cleaner", route: "/register" },
      { name: "Cleaner Dashboard", route: "/candidates-dashboard/dashboard" },
      { name: "Job Opportunities", route: "/job-list-v2" },
      { name: "Cleaner Resources", route: "/candidates-dashboard/dashboard" },
      { name: "FAQs for Cleaners", route: "/faq" },
    ],
  },
  {
    id: 3,
    title: "Discover",
    menuList: [
      { name: "How It Works", route: "/home-12" },
      { name: "Success Stories", route: "/reviews" },
      { name: "Blog", route: "/blog-list-v1" },
      { name: "Careers", route: "/#" },
      { name: "Contact Us", route: "/contact" },
    ],
  },
  {
    id: 4,
    title: "Legal",
    menuList: [
      { name: "Privacy Policy", route: "/#" },
      { name: "Terms of Service", route: "/terms" },
      { name: "Cookie Policy", route: "/#" },
      { name: "Accessibility", route: "/#" },
      { name: "Security Center", route: "/#" },
    ],
  },
];
